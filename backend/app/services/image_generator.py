import os
import asyncio
import logging
from pathlib import Path
from typing import Optional, Dict, List
from PIL import Image, ImageDraw
from app.config import settings
from app.services.telemetry import log_collector

logger = logging.getLogger(__name__)

# Check for Google Generative AI availability
try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

MEDIA_DIR = Path(__file__).resolve().parent.parent.parent / "media"
IMAGE_DIR = MEDIA_DIR / "images"

ASPECT_DIMENSIONS = {
    "9:16": (1080, 1920),
    "16:9": (1920, 1080),
}


class GeminiImageGenerator:
    """
    AI Scene Background Generator powered by Google Gemini (gemini-3.1-flash-image).
    
    Generates photorealistic, high-resolution vertical or horizontal background imagery
    for video marketing scenes. Includes local disk caching and high-fidelity procedural
    gradient fallback if API quota is reached or network is unavailable.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_IMAGE_MODEL
        self._is_live = False
        self.model = None

        IMAGE_DIR.mkdir(parents=True, exist_ok=True)

        if HAS_GENAI and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(self.model_name)
                self._is_live = True
                log_collector.record_log(
                    "INFO",
                    "image_generator",
                    f"Gemini Image Generator connected via live model: {self.model_name}"
                )
            except Exception as e:
                logger.warning(f"Could not initialize live Gemini image model: {e}")
        else:
            log_collector.record_log(
                "INFO",
                "image_generator",
                "Gemini Image Generator initialized with procedural gradient fallback engine"
            )

    def _create_procedural_background(
        self,
        output_path: str,
        scene_number: int,
        aspect_ratio: str = "9:16"
    ) -> str:
        """Generate high-contrast, cinema-grade procedural gradient background image."""
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        width, height = ASPECT_DIMENSIONS.get(aspect_ratio, (1080, 1920))

        img = Image.new("RGB", (width, height), "#0d1117")
        draw = ImageDraw.Draw(img)

        # Curated aesthetic color transitions per scene
        palette = [
            ((15, 23, 42), (76, 29, 149), (217, 70, 239)),   # Scene 1: Dark Slate -> Deep Purple -> Neon Magenta
            ((10, 15, 30), (5, 150, 105), (16, 185, 129)),   # Scene 2: Deep Abyss -> Teal -> Emerald
            ((24, 10, 38), (190, 24, 93), (244, 63, 94)),    # Scene 3: Dark Violet -> Crimson -> Coral CTA
        ]
        c_top, c_mid, c_bot = palette[(scene_number - 1) % len(palette)]

        for y in range(height):
            ratio = y / height
            if ratio < 0.5:
                sub_r = ratio * 2
                r = int(c_top[0] + (c_mid[0] - c_top[0]) * sub_r)
                g = int(c_top[1] + (c_mid[1] - c_top[1]) * sub_r)
                b = int(c_top[2] + (c_mid[2] - c_top[2]) * sub_r)
            else:
                sub_r = (ratio - 0.5) * 2
                r = int(c_mid[0] + (c_bot[0] - c_mid[0]) * sub_r)
                g = int(c_mid[1] + (c_bot[1] - c_mid[1]) * sub_r)
                b = int(c_mid[2] + (c_bot[2] - c_bot[2]) * sub_r)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        img.save(output_path, "JPEG", quality=92)
        logger.info(f"Generated procedural background: {output_path} ({width}x{height})")
        return output_path

    async def generate_scene_image(
        self,
        campaign_id: str,
        scene_number: int,
        visual_prompt: str,
        aspect_ratio: str = "9:16"
    ) -> str:
        """
        Generate or retrieve background image for a specific scene.
        Attempts Gemini image generation, falling back to procedural gradient on failure.
        """
        campaign_img_dir = IMAGE_DIR / campaign_id
        campaign_img_dir.mkdir(parents=True, exist_ok=True)
        output_path = str(campaign_img_dir / f"scene_{scene_number}.jpg")

        # Return cached image if exists and valid
        if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
            return output_path

        # Live Gemini Image Generation
        if self._is_live and self.model:
            try:
                dim_str = "vertical 9:16 smartphone wallpaper aspect ratio" if aspect_ratio == "9:16" else "horizontal 16:9 widescreen"
                styled_prompt = (
                    f"Cinematic {dim_str}, photorealistic, high contrast, clean minimalist tech aesthetic, "
                    f"professional lighting, 8k resolution, suitable for text overlay: {visual_prompt}"
                )

                log_collector.record_log(
                    "INFO",
                    "image_generator",
                    f"Requesting AI background for Scene {scene_number} ({campaign_id}) via {self.model_name}"
                )

                # Run generation with timeout
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: self.model.generate_content(
                        styled_prompt,
                        request_options={"timeout": 25}
                    )
                )

                if response and response.candidates and response.candidates[0].content.parts:
                    for part in response.candidates[0].content.parts:
                        if hasattr(part, "inline_data") and part.inline_data:
                            with open(output_path, "wb") as f:
                                f.write(part.inline_data.data)

                            size_kb = round(os.path.getsize(output_path) / 1024, 1)
                            log_collector.record_log(
                                "INFO",
                                "image_generator",
                                f"Scene {scene_number} background image generated via Gemini ({size_kb} KB)"
                            )
                            return output_path

            except Exception as e:
                logger.warning(f"Gemini image generation failed for Scene {scene_number}: {e}. Falling back to procedural background.")
                log_collector.record_log(
                    "WARNING",
                    "image_generator",
                    f"Gemini image gen failed ({e}). Deploying cinema procedural gradient."
                )

        # Procedural fallback
        return self._create_procedural_background(output_path, scene_number, aspect_ratio)

    async def generate_campaign_images(
        self,
        campaign_id: str,
        scenes: list,
        aspect_ratio: str = "9:16"
    ) -> Dict[int, str]:
        """
        Generate background images for all scenes in a campaign and update their media_url.
        """
        image_map: Dict[int, str] = {}

        for scene in scenes:
            scene_num = scene.scene_number
            prompt = scene.visual_prompt or f"Cinematic dark SaaS interface background for {scene.title}"

            img_path = await self.generate_scene_image(
                campaign_id=campaign_id,
                scene_number=scene_num,
                visual_prompt=prompt,
                aspect_ratio=aspect_ratio
            )
            image_map[scene_num] = img_path
            # Update media_url for frontend display
            scene.media_url = f"/media/images/{campaign_id}/scene_{scene_num}.jpg"

        return image_map


image_generator = GeminiImageGenerator()
