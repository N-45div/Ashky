import os
import shutil
import pytest
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app
from app.services.tts_engine import tts_engine, AUDIO_DIR, ensure_media_dirs
from app.services.video_compositor import video_compositor, VIDEO_DIR, get_audio_duration
from app.services.image_generator import image_generator, IMAGE_DIR
from app.models import SceneBlueprint

client = TestClient(app)

TEMP_TEST_CAMPAIGN = "test_pipeline_camp"


@pytest.fixture(autouse=True)
def setup_and_teardown():
    """Ensure media dirs exist before test, clean up test campaign media after."""
    ensure_media_dirs()
    yield
    # Clean up test artifacts
    shutil.rmtree(str(AUDIO_DIR / TEMP_TEST_CAMPAIGN), ignore_errors=True)
    shutil.rmtree(str(VIDEO_DIR / TEMP_TEST_CAMPAIGN), ignore_errors=True)
    shutil.rmtree(str(IMAGE_DIR / TEMP_TEST_CAMPAIGN), ignore_errors=True)
    test_mp4 = VIDEO_DIR / f"{TEMP_TEST_CAMPAIGN}.mp4"
    if test_mp4.exists():
        try:
            os.remove(str(test_mp4))
        except OSError:
            pass


@pytest.mark.asyncio
async def test_tts_voiceover_synthesis():
    """Verify Edge TTS synthesizes a playable MP3 voiceover file."""
    output_audio = str(AUDIO_DIR / TEMP_TEST_CAMPAIGN / "scene_1.mp3")
    os.makedirs(os.path.dirname(output_audio), exist_ok=True)

    result_path = await tts_engine.generate_voiceover(
        text="Stop burning cash on ineffective ads. Ashky automates video marketing.",
        voice="en-US-GuyNeural",
        output_path=output_audio,
    )

    assert os.path.exists(result_path)
    file_size = os.path.getsize(result_path)
    assert file_size > 5000, f"Generated audio too small ({file_size} bytes)"

    duration = get_audio_duration(result_path)
    assert duration > 1.0, f"Audio duration too short: {duration}s"


@pytest.mark.asyncio
async def test_video_compositor_scene_and_campaign_assembly():
    """Verify FFmpeg compositor generates a 9:16 MP4 clip with burnt-in text and audio."""
    # First create an audio file for the scene
    audio_path = str(AUDIO_DIR / TEMP_TEST_CAMPAIGN / "scene_1.mp3")
    os.makedirs(os.path.dirname(audio_path), exist_ok=True)
    await tts_engine.generate_voiceover(
        text="Introducing LaunchFlow, your autonomous onboarding agent.",
        voice="en-US-GuyNeural",
        output_path=audio_path,
    )

    fake_scenes = [
        SceneBlueprint(
            scene_number=1,
            title="What isn't 100% possible?",
            duration_seconds=3.0,
            timeframe="0-3s",
            camera_cues="Crash zoom to glowing terminal",
            kinetic_motion="Text pulses",
            text_overlay="LaunchFlow Autonomous Agent: 100% Instant",
            voiceover_script="What if dying wasn't game over—but 100% the key to winning?",
            visual_prompt="Dark sleek software UI",
            status="ready",
        )
    ]

    output_video = await video_compositor.render_campaign(
        campaign_id=TEMP_TEST_CAMPAIGN,
        scenes=fake_scenes,
        audio_paths=[audio_path],
        aspect_ratio="9:16",
    )

    assert os.path.exists(output_video)
    file_size = os.path.getsize(output_video)
    assert file_size > 10000, f"Rendered MP4 too small ({file_size} bytes)"
    assert output_video.endswith(".mp4")


@pytest.mark.asyncio
async def test_image_generator_and_compositing_with_visuals():
    """Verify image generator generates backgrounds and video compositor renders with visual backgrounds."""
    # 1. Generate image background
    img_path = await image_generator.generate_scene_image(
        campaign_id=TEMP_TEST_CAMPAIGN,
        scene_number=1,
        visual_prompt="Futuristic dark UI SaaS dashboard with glowing neon accents",
        aspect_ratio="9:16",
    )
    assert os.path.exists(img_path)
    assert os.path.getsize(img_path) > 1000

    # 2. Generate voiceover audio
    audio_path = str(AUDIO_DIR / TEMP_TEST_CAMPAIGN / "scene_1.mp3")
    os.makedirs(os.path.dirname(audio_path), exist_ok=True)
    await tts_engine.generate_voiceover(
        text="Experience autonomous AI marketing with Ashky Studio.",
        voice="en-US-GuyNeural",
        output_path=audio_path,
    )

    # 3. Assemble video with image background
    fake_scenes = [
        SceneBlueprint(
            scene_number=1,
            title="Visual Background Scene",
            duration_seconds=3.0,
            timeframe="0-3s",
            camera_cues="Smooth pan",
            kinetic_motion="Captions float",
            text_overlay="Ashky Visual Studio",
            voiceover_script="Experience autonomous AI marketing with Ashky Studio.",
            visual_prompt="Futuristic dark UI SaaS dashboard with glowing neon accents",
            status="ready",
        )
    ]

    output_video = await video_compositor.render_campaign(
        campaign_id=TEMP_TEST_CAMPAIGN,
        scenes=fake_scenes,
        audio_paths=[audio_path],
        aspect_ratio="9:16",
        image_paths={1: img_path},
    )

    assert os.path.exists(output_video)
    assert os.path.getsize(output_video) > 10000
    assert output_video.endswith(".mp4")


def test_render_endpoint_validation_and_status():
    """Verify render API rejects invalid campaign IDs and returns proper schema."""
    # 404 for unknown campaign
    res = client.post("/api/campaigns/nonexistent_xyz/render")
    assert res.status_code == 404

    # 404 for unknown campaign status
    res = client.get("/api/campaigns/nonexistent_xyz/render-status")
    assert res.status_code == 404

    # 404 for unknown campaign download
    res = client.get("/api/campaigns/nonexistent_xyz/download")
    assert res.status_code == 404


def test_campaign_create_and_render_initiation():
    """Verify creating a campaign then triggering render returns queued/synthesizing status."""
    create_res = client.post("/api/campaigns/create", json={
        "product_name": "TestRenderApp",
        "product_pitch": "Automated video ads for founders",
        "category": "B2B SaaS",
        "aspect_ratio": "9:16",
    })
    assert create_res.status_code == 200
    camp_id = create_res.json()["campaign_id"]

    # Trigger render (using turbo engine for test speed)
    render_res = client.post(f"/api/campaigns/{camp_id}/render", json={
        "voice": "en-US-GuyNeural",
        "aspect_ratio": "9:16",
        "include_subtitles": True,
        "engine": "turbo",
    })
    assert render_res.status_code == 200
    render_data = render_res.json()
    assert render_data["campaign_id"] == camp_id
    assert render_data["status"] in ("queued", "synthesizing_audio", "rendering_scenes", "completed")

    # Poll status
    status_res = client.get(f"/api/campaigns/{camp_id}/render-status")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["campaign_id"] == camp_id
    assert "status" in status_data
    assert "progress_pct" in status_data
