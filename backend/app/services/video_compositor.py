"""
Ashky FFmpeg Video Compositor
==============================
Composites per-scene voiceover audio + background visuals + burnt-in subtitles
into a single downloadable 9:16 (1080x1920) or 16:9 (1920x1080) MP4 file.

Uses FFmpeg subprocess calls directly for maximum reliability on Windows.
"""

import os
import asyncio
import logging
import shutil
import subprocess
import json
from typing import List, Optional, Tuple, Dict
from pathlib import Path

logger = logging.getLogger(__name__)

MEDIA_ROOT = Path(__file__).resolve().parent.parent.parent / "media"
AUDIO_DIR = MEDIA_ROOT / "audio"
VIDEO_DIR = MEDIA_ROOT / "videos"

# Aspect ratio presets: (width, height)
ASPECT_RATIOS = {
    "9:16": (1080, 1920),
    "16:9": (1920, 1080),
}

# Scene background colors (dark matte palette matching the UI)
SCENE_COLORS = [
    "0x0f1115",  # Scene 1: Deep charcoal
    "0x14171d",  # Scene 2: Slate graphite
    "0x1a1e26",  # Scene 3: Dark titanium
]

# Font configuration for subtitle burn-in
FONT_CONFIG = {
    "fontcolor": "white",
    "fontsize_title": 56,
    "fontsize_body": 42,
    "fontsize_subtitle": 36,
    "borderw": 3,
    "bordercolor": "black",
}


def _get_font_path() -> str:
    """
    Get an explicit font file path for ffmpeg drawtext on Windows.
    FFmpeg's fontconfig is typically not configured on Windows,
    so we must specify fontfile= directly.
    """
    candidates = [
        # Windows
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/calibri.ttf",
        # Linux
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans.ttf",
        # macOS
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return path.replace("\\", "/")

    logger.warning("No system font found, drawtext may fail")
    return "arial"


SYSTEM_FONT = _get_font_path()


def _find_ffmpeg() -> str:
    """Locate ffmpeg binary on the system."""
    ffmpeg_path = shutil.which("ffmpeg")
    if not ffmpeg_path:
        raise RuntimeError(
            "ffmpeg not found on PATH. Install ffmpeg: https://ffmpeg.org/download.html"
        )
    return ffmpeg_path


def _find_ffprobe() -> str:
    """Locate ffprobe binary on the system."""
    ffprobe_path = shutil.which("ffprobe")
    if not ffprobe_path:
        raise RuntimeError("ffprobe not found on PATH.")
    return ffprobe_path


def _run_ffmpeg(args: List[str], description: str = "ffmpeg", timeout: int = 300) -> subprocess.CompletedProcess:
    """Run an ffmpeg command and handle errors."""
    ffmpeg = _find_ffmpeg()
    cmd = [ffmpeg, "-y"] + args  # -y to overwrite output without asking
    logger.info(f"Running {description}: {' '.join(cmd[:8])}...")

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=timeout,
    )

    if result.returncode != 0:
        logger.error(f"{description} failed:\nstderr: {result.stderr[-500:]}")
        raise RuntimeError(f"{description} failed: {result.stderr[-200:]}")

    return result


def get_audio_duration(audio_path: str) -> float:
    """Get the duration of an audio file in seconds using ffprobe."""
    ffprobe = _find_ffprobe()
    cmd = [
        ffprobe,
        "-v", "quiet",
        "-show_entries", "format=duration",
        "-of", "json",
        audio_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        logger.warning(f"ffprobe failed for {audio_path}, defaulting to 5s")
        return 5.0

    try:
        data = json.loads(result.stdout)
        return float(data["format"]["duration"])
    except (KeyError, ValueError, json.JSONDecodeError):
        return 5.0


class VideoCompositor:
    """
    FFmpeg-based video compositor that assembles per-scene voiceover audio
    and visual backgrounds into a single downloadable MP4.

    Pipeline:
    1. For each scene: generate a static color background with drawtext overlay
    2. Combine background video + voiceover audio per scene
    3. Concatenate all scene clips into one final MP4
    """

    def __init__(self):
        self.ffmpeg = _find_ffmpeg()

    def _generate_scene_clip(
        self,
        scene_number: int,
        audio_path: str,
        title: str,
        subtitle: str,
        voiceover_text: str,
        output_path: str,
        width: int = 1080,
        height: int = 1920,
        image_path: Optional[str] = None,
        video_clip_path: Optional[str] = None,
    ) -> str:
        """
        Generate a single scene video clip with:
        - Video background (from Veo 3.1) or Image background with solid fallback
        - Smooth crossfade transitions (fade in/out)
        - Title text overlay (top area)
        - Subtitle text overlay (bottom area, simulating kinetic captions)
        - Voiceover audio track

        Returns the output clip path.
        """
        duration = get_audio_duration(audio_path)
        # Add 0.5s padding at end for breathing room
        duration = round(duration + 0.5, 2)

        bg_color = SCENE_COLORS[min(scene_number - 1, len(SCENE_COLORS) - 1)]
        fc = FONT_CONFIG

        # Normalize file paths for ffmpeg
        audio_path = audio_path.replace("\\", "/")
        output_path = output_path.replace("\\", "/")

        # Prepare title and subtitle text files to avoid FFmpeg escaping issues with apostrophes and %
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)
        title_file_path = output_dir / f"title_{scene_number}.txt"
        sub_file_path = output_dir / f"sub_{scene_number}.txt"

        # Truncate subtitle for display (max ~60 chars per line)
        formatted_subtitle = voiceover_text
        if len(formatted_subtitle) > 120:
            mid = len(formatted_subtitle) // 2
            split_pos = formatted_subtitle.rfind(" ", 0, mid + 10)
            if split_pos == -1:
                split_pos = mid
            formatted_subtitle = formatted_subtitle[:split_pos] + "\n" + formatted_subtitle[split_pos + 1:]

        title_file_path.write_text(title, encoding="utf-8")
        sub_file_path.write_text(formatted_subtitle, encoding="utf-8")

        title_file_esc = str(title_file_path).replace("\\", "/").replace(":", "\\:")
        sub_file_esc = str(sub_file_path).replace("\\", "/").replace(":", "\\:")

        # Scene number badge
        scene_badge = f"SCENE {scene_number}"

        # Build drawtext filter chain (fontfile= required on Windows, textfile= avoids escaping issues)
        font_esc = SYSTEM_FONT.replace(":", "\\:")
        drawtext_filters = (
            # Scene number badge (top-left)
            f"drawtext=fontfile='{font_esc}':"
            f"text='{scene_badge}':"
            f"fontcolor=0xaaaaaa:fontsize=28:"
            f"x=60:y=80:"
            f"borderw=0,"
            # Title (center-top area) with expansion=none to support % and textfile to support apostrophes
            f"drawtext=fontfile='{font_esc}':"
            f"textfile='{title_file_esc}':expansion=none:"
            f"fontcolor=white:fontsize={fc['fontsize_title']}:"
            f"x=(w-text_w)/2:y=h/4:"
            f"borderw={fc['borderw']}:bordercolor={fc['bordercolor']},"
            # Subtitle / voiceover text (bottom third, with fade-in)
            f"drawtext=fontfile='{font_esc}':"
            f"textfile='{sub_file_esc}':expansion=none:"
            f"fontcolor=0xe0e0e0:fontsize={fc['fontsize_subtitle']}:"
            f"x=(w-text_w)/2:y=3*h/4:"
            f"borderw=2:bordercolor=black:"
            f"enable='gte(t\\,0.3)'"
        )

        fade_filter = f"fade=t=in:st=0:d=0.3,fade=t=out:st={max(0.1, duration - 0.3)}:d=0.3"

        if video_clip_path and os.path.exists(video_clip_path):
            safe_vid = video_clip_path.replace("\\", "/")
            video_inputs = [
                "-stream_loop", "-1",
                "-t", str(duration),
                "-i", safe_vid,
            ]
            video_filters = (
                f"scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height},setsar=1,"
                f"{fade_filter},"
                f"{drawtext_filters}"
            )
        elif image_path and os.path.exists(image_path):
            safe_img = image_path.replace("\\", "/")
            video_inputs = [
                "-loop", "1",
                "-t", str(duration),
                "-i", safe_img,
            ]
            video_filters = (
                f"scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height},setsar=1,"
                f"{fade_filter},"
                f"{drawtext_filters}"
            )
        else:
            video_inputs = [
                "-f", "lavfi",
                "-i", f"color=c={bg_color}:s={width}x{height}:d={duration}:r=30",
            ]
            video_filters = f"{fade_filter},{drawtext_filters}"

        args = (
            video_inputs
            + ["-i", audio_path]
            + ["-vf", video_filters]
            + [
                "-c:v", "libx264",
                "-preset", "veryfast",
                "-threads", "2",
                "-crf", "23",
                "-c:a", "aac",
                "-b:a", "128k",
                "-shortest",
                "-pix_fmt", "yuv420p",
                output_path,
            ]
        )

        _run_ffmpeg(args, f"scene {scene_number} clip generation")
        
        # Cleanup temporary text files
        try:
            if title_file_path.exists():
                title_file_path.unlink()
            if sub_file_path.exists():
                sub_file_path.unlink()
        except Exception:
            pass

        logger.info(f"Scene {scene_number} clip: {output_path} ({duration}s)")
        return output_path

    def _concatenate_clips(
        self,
        clip_paths: List[str],
        output_path: str,
    ) -> str:
        """
        Concatenate multiple scene clips into one final video using
        ffmpeg's concat demuxer (lossless concatenation).
        """
        concat_list_path = str(Path(output_path).parent / "concat_list.txt")
        with open(concat_list_path, "w") as f:
            for clip in clip_paths:
                safe_path = clip.replace("\\", "/")
                f.write(f"file '{safe_path}'\n")

        args = [
            "-f", "concat",
            "-safe", "0",
            "-i", concat_list_path,
            "-c", "copy",
            output_path,
        ]

        _run_ffmpeg(args, "final video concatenation")

        try:
            os.remove(concat_list_path)
        except OSError:
            pass

        logger.info(f"Final video assembled: {output_path}")
        return output_path

    async def render_campaign(
        self,
        campaign_id: str,
        scenes: list,
        audio_paths: List[str],
        aspect_ratio: str = "9:16",
        image_paths: Optional[Dict[int, str]] = None,
        video_paths: Optional[Dict[int, str]] = None,
    ) -> str:
        """
        Full render pipeline: combine per-scene audio with visuals and
        concatenate into a single downloadable MP4.

        Args:
            campaign_id: Campaign identifier
            scenes: List of SceneBlueprint objects
            audio_paths: List of audio file paths (one per scene)
            aspect_ratio: "9:16" or "16:9"
            image_paths: Optional mapping of scene_number -> local image file path
            video_paths: Optional mapping of scene_number -> local video clip path (from Veo 3.1)

        Returns:
            Path to the final rendered MP4 file
        """
        width, height = ASPECT_RATIOS.get(aspect_ratio, (1080, 1920))

        campaign_video_dir = VIDEO_DIR / campaign_id
        campaign_video_dir.mkdir(parents=True, exist_ok=True)

        # Step 1: Generate per-scene clips
        clip_paths = []
        for i, (scene, audio_path) in enumerate(zip(scenes, audio_paths)):
            clip_output = str(campaign_video_dir / f"scene_{scene.scene_number}.mp4")
            img_path = image_paths.get(scene.scene_number) if image_paths else None
            vid_path = video_paths.get(scene.scene_number) if video_paths else None

            clip_path = await asyncio.get_event_loop().run_in_executor(
                None,
                self._generate_scene_clip,
                scene.scene_number,
                audio_path,
                scene.title,
                scene.text_overlay,
                scene.voiceover_script,
                clip_output,
                width,
                height,
                img_path,
                vid_path,
            )
            clip_paths.append(clip_path)

        # Step 2: Concatenate all clips
        final_output = str(VIDEO_DIR / f"{campaign_id}.mp4")
        await asyncio.get_event_loop().run_in_executor(
            None,
            self._concatenate_clips,
            clip_paths,
            final_output,
        )

        # Verify the output exists and has content
        if not os.path.exists(final_output):
            raise RuntimeError(f"Video render failed: output file not created")

        file_size = os.path.getsize(final_output)
        if file_size < 1000:
            raise RuntimeError(f"Video render produced suspiciously small file ({file_size} bytes)")

        logger.info(
            f"Campaign {campaign_id} rendered: {final_output} "
            f"({file_size / 1024:.1f} KB, {aspect_ratio})"
        )
        return final_output


# Module-level singleton
video_compositor = VideoCompositor()
