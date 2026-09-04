"""
Ashky TTS Voiceover Synthesis Engine
=====================================
Generates natural-sounding founder voiceovers for each video scene
using Microsoft Edge TTS (free, no API key required).

Voice: en-US-GuyNeural (clean, professional male founder voice)
Output: MP3 files per scene, stored in backend/media/audio/
"""

import os
import asyncio
import logging
from typing import List, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

# Verify edge-tts availability
try:
    import edge_tts
    HAS_EDGE_TTS = True
except ImportError:
    HAS_EDGE_TTS = False
    logger.warning("edge-tts not installed. TTS voiceover synthesis will be unavailable.")

# Default media directories
MEDIA_ROOT = Path(__file__).resolve().parent.parent.parent / "media"
AUDIO_DIR = MEDIA_ROOT / "audio"
VIDEO_DIR = MEDIA_ROOT / "videos"


def ensure_media_dirs():
    """Create media directories if they don't exist."""
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)


# Available voices for different founder persona options
VOICE_OPTIONS = {
    "male_us": "en-US-GuyNeural",
    "female_us": "en-US-JennyNeural",
    "male_uk": "en-GB-RyanNeural",
    "female_uk": "en-GB-SoniaNeural",
}

DEFAULT_VOICE = os.getenv("TTS_VOICE", "en-US-GuyNeural")


class TTSEngine:
    """
    AI Voiceover Synthesis Engine using Microsoft Edge TTS.

    Generates high-quality speech audio files for video scene voiceovers.
    Zero API key required — uses the same engine as Microsoft Edge Read Aloud.
    """

    def __init__(self, voice: str = DEFAULT_VOICE):
        self.voice = voice
        self.available = HAS_EDGE_TTS
        ensure_media_dirs()

    async def generate_voiceover(
        self,
        text: str,
        output_path: str,
        voice: Optional[str] = None,
    ) -> str:
        """
        Synthesize speech from text and save as MP3.

        Args:
            text: The voiceover script text
            output_path: Full path for the output .mp3 file
            voice: Optional override voice (default: self.voice)

        Returns:
            The output file path on success

        Raises:
            RuntimeError: If edge-tts is not available or synthesis fails
        """
        if not self.available:
            raise RuntimeError("edge-tts is not installed. Run: pip install edge-tts")

        selected_voice = voice or self.voice

        try:
            communicate = edge_tts.Communicate(text, selected_voice)
            await communicate.save(output_path)
            logger.info(f"TTS voiceover saved: {output_path} (voice={selected_voice}, chars={len(text)})")
            return output_path
        except Exception as e:
            logger.error(f"TTS synthesis failed for '{text[:50]}...': {e}")
            raise RuntimeError(f"TTS synthesis failed: {e}") from e

    async def generate_scene_voiceovers(
        self,
        campaign_id: str,
        scenes: list,
    ) -> List[str]:
        """
        Generate voiceover audio files for all scenes in a campaign.

        Args:
            campaign_id: Unique campaign identifier
            scenes: List of SceneBlueprint objects with voiceover_script field

        Returns:
            List of file paths to generated MP3 audio files
        """
        ensure_media_dirs()
        campaign_audio_dir = AUDIO_DIR / campaign_id
        campaign_audio_dir.mkdir(parents=True, exist_ok=True)

        audio_paths = []

        for scene in scenes:
            scene_num = scene.scene_number
            script = scene.voiceover_script

            if not script or not script.strip():
                logger.warning(f"Scene {scene_num} has empty voiceover script, skipping TTS")
                continue

            output_path = str(campaign_audio_dir / f"scene_{scene_num}.mp3")
            await self.generate_voiceover(script, output_path)
            audio_paths.append(output_path)

        logger.info(
            f"Generated {len(audio_paths)} voiceover files for campaign {campaign_id}"
        )
        return audio_paths


# Module-level singleton
tts_engine = TTSEngine()
