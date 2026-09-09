"""
Ashky Google Veo 3.1 Video Generation Engine
============================================
Integrates Google Veo 3.1 (veo-3.1-fast-generate-preview) for high-speed,
photorealistic AI video generation for solo founder marketing reels.

Features:
- Native 9:16 and 16:9 vertical/horizontal generation
- Asynchronous operation polling with timeout management
- Robust fallback to keyframe + cinematic motion if quota / network throttles
- Integration with Prometheus metrics and Loki structured logs
"""

import os
import asyncio
import logging
from pathlib import Path
from typing import Optional, Dict, List
import urllib.request

try:
    from google import genai  # type: ignore
    from google.genai import types  # type: ignore
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

from app.config import settings
from app.services.telemetry import log_collector

logger = logging.getLogger(__name__)

MEDIA_DIR = Path(__file__).resolve().parent.parent.parent / "media"
VIDEO_DIR = MEDIA_DIR / "videos"


class GoogleVeoEngine:
    """
    Client for Google DeepMind's Veo 3.1 Video Generation Model.
    Generates high-definition cinematic video clips per scene from director prompts.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = getattr(settings, "VEO_FAST_MODEL", "veo-3.1-generate-preview")
        self.client = None
        self._is_live = False

        VIDEO_DIR.mkdir(parents=True, exist_ok=True)

        if HAS_GENAI and self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
                self._is_live = True
                log_collector.record_log(
                    "INFO",
                    "veo_engine",
                    f"Connected to Google Veo 3.1 engine ({self.model_name})"
                )
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI client for Veo: {e}")
        else:
            log_collector.record_log(
                "WARN",
                "veo_engine",
                "Google GenAI SDK or API key missing. Veo will run in simulation / fallback mode."
            )

    async def generate_scene_video(
        self,
        prompt: str,
        output_path: str,
        duration_seconds: int = 5,
        aspect_ratio: str = "9:16",
        poll_interval: float = 3.0,
        timeout_seconds: float = 120.0,
    ) -> Optional[str]:
        """
        Generate a single scene video clip with Veo 3.1.
        
        Args:
            prompt: Visual prompt and director motion cues
            output_path: Destination local file path for MP4
            duration_seconds: Video duration (4 to 8 seconds)
            aspect_ratio: "9:16" or "16:9"
            poll_interval: Seconds between status checks
            timeout_seconds: Max seconds before giving up and falling back
            
        Returns:
            Path to saved MP4 file, or None if generation failed / timed out
        """
        if not self._is_live or not self.client:
            logger.info("Veo live client unavailable, returning None for compositor fallback")
            return None

        # Veo duration must be between 4 and 8 inclusive
        clamped_duration = max(4, min(8, int(duration_seconds)))
        clean_aspect = "9:16" if "9" in aspect_ratio else "16:9"

        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        try:
            log_collector.record_log(
                "INFO",
                "veo_engine",
                f"Dispatching Veo 3.1 job ({clamped_duration}s, {clean_aspect}): {prompt[:80]}..."
            )

            # Launch Veo long-running operation in thread pool to avoid blocking async loop
            loop = asyncio.get_running_loop()
            
            def _launch_job():
                models_to_try = [self.model_name]
                for fallback_m in ["veo-3.1-generate-preview", "veo-3.1-lite-generate-preview"]:
                    if fallback_m not in models_to_try:
                        models_to_try.append(fallback_m)

                last_err = None
                for m in models_to_try:
                    try:
                        return self.client.models.generate_videos(
                            model=m,
                            prompt=prompt,
                            config=types.GenerateVideosConfig(
                                aspect_ratio=clean_aspect,
                                duration_seconds=clamped_duration,
                                number_of_videos=1,
                            )
                        )
                    except Exception as err:
                        last_err = err
                        err_str = str(err)
                        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
                            logger.warning(f"Veo model {m} quota exhausted (429). Trying fallback model if available...")
                            log_collector.record_log(
                                "WARN",
                                "veo_engine",
                                f"Veo model {m} quota exhausted (429). Attempting fallback tier..."
                            )
                            continue
                        raise err
                if last_err:
                    raise last_err

            initial_op = await loop.run_in_executor(None, _launch_job)
            op_name = getattr(initial_op, 'name', None)
            logger.info(f"Veo operation launched: {op_name}")

            # Poll until completed or timeout
            start_time = asyncio.get_event_loop().time()
            dummy_op = types.GenerateVideosOperation(name=op_name)

            while (asyncio.get_event_loop().time() - start_time) < timeout_seconds:
                await asyncio.sleep(poll_interval)

                def _check_op():
                    return self.client.operations.get(dummy_op)

                op = await loop.run_in_executor(None, _check_op)

                if op.done:
                    if op.error:
                        logger.error(f"Veo operation failed: {op.error}")
                        log_collector.record_log(
                            "ERROR",
                            "veo_engine",
                            f"Veo operation error: {op.error}"
                        )
                        return None

                    # Download video result
                    generated_videos = getattr(op.response, 'generated_videos', None)
                    if not generated_videos and hasattr(op, 'result'):
                        generated_videos = getattr(op.result, 'generated_videos', None)

                    if generated_videos and len(generated_videos) > 0:
                        first_vid = generated_videos[0]
                        
                        # Check if video has video_bytes directly
                        vid_obj = getattr(first_vid, 'video', None)
                        if vid_obj and hasattr(vid_obj, 'video_bytes') and vid_obj.video_bytes:
                            with open(output_path, "wb") as f:
                                f.write(vid_obj.video_bytes)
                            logger.info(f"Veo video written from bytes to {output_path}")
                            return output_path

                        # Check if video has URI or downloadable reference
                        if vid_obj and hasattr(vid_obj, 'uri') and vid_obj.uri:
                            try:
                                dl_url = f"{vid_obj.uri}&key={self.api_key}" if "key=" not in vid_obj.uri else vid_obj.uri
                                req = urllib.request.Request(dl_url)
                                def _fetch_and_save():
                                    with urllib.request.urlopen(req) as resp:
                                        data = resp.read()
                                        with open(output_path, "wb") as f:
                                            f.write(data)
                                await loop.run_in_executor(None, _fetch_and_save)
                                if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                                    logger.info(f"Veo video downloaded via authenticated media URI: {output_path}")
                                    return output_path
                            except Exception as uri_err:
                                logger.warning(f"Could not download via authenticated URI: {uri_err}")

                            def _download():
                                self.client.files.download(file=vid_obj, destination=output_path)
                            try:
                                await loop.run_in_executor(None, _download)
                                if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                                    logger.info(f"Veo video downloaded via files API: {output_path}")
                                    return output_path
                            except Exception as dl_err:
                                logger.warning(f"Could not download via client.files: {dl_err}")

                        # Fallback: check download_url or custom link
                        if hasattr(first_vid, 'download_url') and first_vid.download_url:
                            urllib.request.urlretrieve(first_vid.download_url, output_path)
                            return output_path

                    logger.warning("Veo operation completed but no valid video payload could be extracted")
                    return None

            logger.warning(f"Veo operation timed out after {timeout_seconds}s")
            return None

        except Exception as e:
            logger.exception(f"Error during Veo scene video generation: {e}")
            log_collector.record_log(
                "WARN",
                "veo_engine",
                f"Veo scene generation exception: {e}. Falling back to compositor."
            )
            return None

    async def generate_campaign_videos(
        self,
        campaign_id: str,
        scenes: list,
        aspect_ratio: str = "9:16"
    ) -> Dict[int, str]:
        """
        Generate video clips for all scenes in a campaign concurrently.
        
        Returns:
            Dict mapping scene_number -> local file path (for successfully rendered scenes)
        """
        camp_dir = VIDEO_DIR / campaign_id
        camp_dir.mkdir(parents=True, exist_ok=True)

        tasks = []
        for scene in scenes:
            scene_num = scene.scene_number
            out_file = str(camp_dir / f"scene_{scene_num}_veo.mp4")
            prompt = (
                f"{scene.visual_prompt}. "
                f"Camera movement: {scene.camera_cues}. "
                f"Cinematic motion: {scene.kinetic_motion}."
            )
            dur = max(4, min(8, int(round(scene.duration_seconds))))
            task = self.generate_scene_video(
                prompt=prompt,
                output_path=out_file,
                duration_seconds=dur,
                aspect_ratio=aspect_ratio,
                timeout_seconds=90.0,
            )
            tasks.append((scene_num, task))

        results = {}
        for scene_num, task in tasks:
            try:
                path = await task
                if path and os.path.exists(path) and os.path.getsize(path) > 1000:
                    results[scene_num] = path
            except Exception as e:
                logger.warning(f"Scene {scene_num} Veo task failed: {e}")

        return results


# Global singleton instance
veo_engine = GoogleVeoEngine()
