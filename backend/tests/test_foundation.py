import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "engines" in data

def test_prometheus_metrics():
    res = client.get("/metrics")
    assert res.status_code == 200
    assert "ashky_campaigns_total" in res.text

def test_campaign_presets():
    res = client.get("/api/campaigns/presets")
    assert res.status_code == 200
    presets = res.json()
    assert len(presets) >= 3
    assert presets[0]["category"] == "B2B SaaS"

def test_campaign_create():
    payload = {
        "product_name": "TestSaaS",
        "product_pitch": "Automated growth testing for indie hackers",
        "category": "B2B SaaS",
        "aspect_ratio": "9:16"
    }
    res = client.post("/api/campaigns/create", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["product_name"] == "TestSaaS"
    assert len(data["scenes"]) == 3
    assert data["scenes"][0]["scene_number"] == 1
    assert data["vision_qa"][0]["hook_strength"] >= 80

def test_geo_probe():
    payload = {
        "product_name": "TestSaaS",
        "category": "B2B SaaS",
        "competitors": ["CompX", "CompY"]
    }
    res = client.post("/api/geo/probe", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["overall_share_of_voice_pct"] > 0
    assert len(data["citations"]) >= 3

def test_geo_schema():
    payload = {
        "product_name": "TestSaaS",
        "category": "B2B SaaS",
        "competitors": ["CompX"]
    }
    res = client.post("/api/geo/schema", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "@context" in data["video_object_schema"]
    assert "hasPart" in data["video_object_schema"]

def test_grafana_snapshot_and_mcp():
    res = client.get("/api/grafana/snapshot")
    assert res.status_code == 200
    data = res.json()
    assert "active_mcp_tools" in data

    chat_payload = {"user_query": "Why did our Gemini ranking drop?"}
    chat_res = client.post("/api/grafana/mcp/chat", json=chat_payload)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert "answer" in chat_data
    assert len(chat_data["mcp_tools_called"]) > 0
    assert "structured_diagnostic" in chat_data
    assert chat_data["structured_diagnostic"] is not None
    assert "finding" in chat_data["structured_diagnostic"]
    assert "evidence" in chat_data["structured_diagnostic"]


def test_neon_circuit_seeded_campaign():
    """Verify default demo campaign is pre-seeded in memory so instant rendering succeeds."""
    from app.api.campaigns import CAMPAIGN_STORE
    assert "camp_neon_circuit_01" in CAMPAIGN_STORE
    neon = CAMPAIGN_STORE["camp_neon_circuit_01"]
    assert neon.product_name == "Neon Circuit"
    assert len(neon.scenes) == 3
    assert neon.scenes[0].text_overlay == "Every Crash Rewrites The City: Neon Circuit"
    assert neon.vision_qa[0].hook_strength >= 90

