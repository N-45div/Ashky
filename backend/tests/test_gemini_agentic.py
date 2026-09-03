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
    assert "gemini-3.5-flash" in data["gemini_model"]
    assert data["token_reduction_pct"] >= 80.0

    assert data["cost_savings_pct"] >= 60.0
    assert len(data["active_inspections"]) >= 3
    assert data["active_inspections"][0]["inspection_type"] == "hook_interrupt"
    assert data["overall_hook_retention_score"] >= 90

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
