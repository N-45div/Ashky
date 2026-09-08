import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.feedback_harness import feedback_harness
from app.models import (
    CampaignBlueprint,
    SceneBlueprint,
    GeminiAgenticVideoAnalysis,
    GeminiKeyframeInspection,
)


@pytest.fixture
def mock_blueprint():
    return CampaignBlueprint(
        campaign_id="camp_test_evolution_01",
        product_name="TestProduct",
        aspect_ratio="9:16",
        total_duration_seconds=30.0,
        estimated_token_cost=0.038,
        scenes=[
            SceneBlueprint(
                scene_number=1,
                title="Scene 1 Hook",
                duration_seconds=3.0,
                timeframe="0.0s - 3.0s",
                hook_type="Kinetic Hook",
                camera_cues="Static camera",
                kinetic_motion="Static text",
                text_overlay="Test Hook Overlay",
                voiceover_script="Test voiceover script for scene 1",
                visual_prompt="Cyberpunk street 9:16",
                media_url=None,
                status="ready"
            ),
            SceneBlueprint(
                scene_number=2,
                title="Scene 2 Mechanism",
                duration_seconds=12.0,
                timeframe="3.0s - 15.0s",
                hook_type="Gameplay Reveal",
                camera_cues="Slow pan",
                kinetic_motion="Subtle text",
                text_overlay="Feature Walkthrough",
                voiceover_script="Test voiceover script for scene 2",
                visual_prompt="Futuristic dashboard 9:16",
                media_url=None,
                status="queued"
            ),
            SceneBlueprint(
                scene_number=3,
                title="Scene 3 CTA",
                duration_seconds=15.0,
                timeframe="15.0s - 30.0s",
                hook_type="CTA Anchor",
                camera_cues="Static wide",
                kinetic_motion="Fade in",
                text_overlay="Try Today",
                voiceover_script="Download today on Steam",
                visual_prompt="Hero car 9:16",
                media_url=None,
                status="queued"
            )
        ],
        created_at="2026-09-08T12:00:00Z"
    )


@pytest.fixture
def mock_critic_analysis():
    return GeminiAgenticVideoAnalysis(
        campaign_id="camp_test_evolution_01",
        gemini_model="gemini-3.8-flash (Agentic Multimodal)",
        token_reduction_pct=88.0,
        cost_savings_pct=66.0,
        tokens_consumed=2450,
        static_ingestion_baseline_tokens=20400,
        active_inspections=[
            GeminiKeyframeInspection(
                timestamp_seconds=0.8,
                inspection_type="hook_interrupt",
                visual_retention_score=55,
                detected_elements=["cockpit", "text banner"],
                critic_notes="Horizontal text edge clipping detected near border."
            ),
            GeminiKeyframeInspection(
                timestamp_seconds=2.2,
                inspection_type="hook_interrupt",
                visual_retention_score=48,
                detected_elements=["static cockpit"],
                critic_notes="Pacing stall between 0.8s and 2.2s risks viewer drop-off."
            ),
        ],
        overall_hook_retention_score=52,
        predicted_3s_dropoff_pct=49.0,
        recommended_modifications=[
            "Inject camera whip-cut before 2.0s to break visual stall",
            "Adjust subtitle padding for 9:16 mobile safe zone compliance",
        ]
    )


@pytest.mark.asyncio
async def test_feedback_harness_evolution_logic(mock_blueprint, mock_critic_analysis):
    """Verifies that the harness generates mutations, evolutions, and boosts hook retention."""
    evolved_bp, record = await feedback_harness.evolve_campaign(
        blueprint=mock_blueprint,
        critic_analysis=mock_critic_analysis,
    )

    assert record.iteration >= 1
    assert record.hook_score_before == 52
    assert record.hook_score_after > record.hook_score_before
    assert record.dropoff_pct_after < record.dropoff_pct_before
    assert len(record.mutations_applied) > 0
    for m in record.mutations_applied:
        assert m.target_scene in (1, 2, 3)
        assert len(m.mutated_value) > 0
        assert len(m.critic_rationale) > 0

    # Check lineage retention
    lineage = feedback_harness.get_lineage("camp_test_evolution_01")
    assert len(lineage) >= 1
    assert lineage[-1].iteration == record.iteration


@pytest.mark.asyncio
async def test_api_evolution_endpoints(mock_blueprint, mock_critic_analysis):
    """Verifies POST /api/campaigns/{id}/evolve and GET /api/campaigns/{id}/evolution-lineage."""
    from unittest.mock import patch, AsyncMock
    from app.models import HarnessEvolutionRecord, HarnessMutation

    mock_record = HarnessEvolutionRecord(
        iteration=1,
        timestamp="2026-09-08T12:00:00Z",
        hook_score_before=55,
        hook_score_after=85,
        dropoff_pct_before=45.0,
        dropoff_pct_after=18.0,
        mutations_applied=[
            HarnessMutation(
                target_scene=1,
                mutation_type="CAMERA_KINETIC_BOOST",
                original_value="static",
                mutated_value="whip-cut",
                critic_rationale="eliminates stall"
            )
        ],
        critic_summary="Evolved scene 1 hook",
        evolved_blueprint=mock_blueprint
    )

    with patch("app.api.campaigns._execute_render", new_callable=AsyncMock), \
         patch("app.api.campaigns.gemini_agentic_engine.inspect_campaign_video", return_value=mock_critic_analysis), \
         patch("app.api.campaigns.feedback_harness.evolve_campaign", return_value=(mock_blueprint, mock_record)):
        
        feedback_harness.evolution_ledger["camp_neon_circuit_01"] = [mock_record]

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # 1. Evolve campaign
            res = await client.post("/api/campaigns/camp_neon_circuit_01/evolve", json={
                "campaign_id": "camp_neon_circuit_01",
                "engine": "turbo"
            })
            assert res.status_code == 200
            data = res.json()
            assert data["status"] == "evolved"
            assert "evolution_record" in data
            assert "iteration" in data
            assert data["evolution_record"]["hook_score_after"] >= data["evolution_record"]["hook_score_before"]

            # 2. Check Lineage
            res_lineage = await client.get("/api/campaigns/camp_neon_circuit_01/evolution-lineage")
            assert res_lineage.status_code == 200
            lineage_data = res_lineage.json()
            assert lineage_data["total_iterations"] >= 1
            assert len(lineage_data["lineage"]) >= 1

            # 3. Test Auto-Improve Loop
            res_loop = await client.post("/api/campaigns/camp_neon_circuit_01/auto-improve", json={
                "campaign_id": "camp_neon_circuit_01",
                "target_min_score": 75,
                "max_iterations": 1,
                "engine": "turbo"
            })
            assert res_loop.status_code == 200
            loop_data = res_loop.json()
            assert loop_data["status"] == "auto_improved"


