import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_gemini_agentic_inspection_direct():
    """Test Gemini agentic video understanding direct endpoint."""
    payload = {
        "campaign_id": "test_camp_direct_001",
        "target_focus": "0-3s_hook"
    }
    res = client.post("/api/campaigns/agentic-inspect", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["campaign_id"] == "test_camp_direct_001"
    assert "gemini-" in data["gemini_model"]
    assert data["token_reduction_pct"] >= 75.0
    assert data["cost_savings_pct"] >= 60.0
    assert len(data["active_inspections"]) >= 3
    assert 0 <= data["overall_hook_retention_score"] <= 100

def test_gemini_agentic_inspection_existing_campaign():
    """Test Gemini agentic video inspection on an actively created campaign."""
    # Step 1: Create campaign
    create_payload = {
        "product_name": "CinemaFlow",
        "product_pitch": "AI-directed generative video pipeline for solo creators",
        "category": "B2B SaaS",
        "aspect_ratio": "9:16"
    }
    create_res = client.post("/api/campaigns/create", json=create_payload)
    assert create_res.status_code == 200
    campaign_id = create_res.json()["campaign_id"]

    # Step 2: Run agentic inspection
    inspect_res = client.post(f"/api/campaigns/{campaign_id}/agentic-inspect")
    assert inspect_res.status_code == 200
    inspect_data = inspect_res.json()
    assert inspect_data["campaign_id"] == campaign_id
    assert inspect_data["tokens_consumed"] < inspect_data["static_ingestion_baseline_tokens"]
    assert len(inspect_data["recommended_modifications"]) > 0

def test_dynamic_blueprint_generation_varies_by_product():
    """Verify different products generate tailored, non-generic blueprints with real Vision Critic scores."""
    payload = {
        "product_name": "PostgresTune",
        "product_pitch": "Automated index tuning and deadlock prevention for high-scale PostgreSQL clusters.",
        "category": "DevTool",
        "aspect_ratio": "9:16",
        "style": "Cyberpunk Technical Dark"
    }
    res = client.post("/api/campaigns/create", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["product_name"] == "PostgresTune"
    assert len(data["scenes"]) == 3
    assert len(data["vision_qa"]) == 3
    # Verify the scenes are customized to PostgreSQL / database / tuning
    combined_text = " ".join([s["voiceover_script"] + " " + s["text_overlay"] for s in data["scenes"]]).lower()
    assert any(term in combined_text for term in ["postgres", "index", "database", "tuning", "deadlock", "cluster"])
    # Verify vision critic scores are populated and valid
    for score in data["vision_qa"]:
        assert 0 <= score["hook_strength"] <= 100
        assert len(score["critique_summary"]) > 0
        assert len(score["actionable_improvements"]) > 0
