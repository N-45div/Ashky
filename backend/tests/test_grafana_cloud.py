import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.campaigns import CAMPAIGN_STORE
from app.models import CampaignBlueprint, SceneBlueprint, VisionCriticScore

client = TestClient(app)

def test_prometheus_metrics_endpoint():
    """Verify Prometheus scrape endpoint returns standard metrics text format."""
    res = client.get("/metrics")
    assert res.status_code == 200
    text = res.text
    assert "ashky_campaigns_total" in text
    assert "ashky_gemini_tokens_total" in text
    assert "ashky_scene_render_duration_seconds" in text
    assert "ashky_hook_strength_score" in text
    assert "ashky_llm_share_of_voice_pct" in text

def test_mcp_jsonrpc_initialize_and_tools():
    """Verify standard MCP JSON-RPC 2.0 initialize and tools/list endpoints."""
    # 1. Initialize
    init_res = client.post("/mcp", json={
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {}
    })
    assert init_res.status_code == 200
    init_data = init_res.json()
    assert init_data["result"]["protocolVersion"] == "2024-11-05"
    assert init_data["result"]["serverInfo"]["name"] == "ashky-grafana-mcp"

    # 2. tools/list
    tools_res = client.post("/mcp", json={
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/list",
        "params": {}
    })
    assert tools_res.status_code == 200
    tools_data = tools_res.json()
    tool_names = [t["name"] for t in tools_data["result"]["tools"]]
    assert "grafana_query_metrics" in tool_names
    assert "grafana_query_loki_logs" in tool_names
    assert "grafana_diagnose_pipeline" in tool_names
    assert "grafana_optimize_retention_loop" in tool_names

def test_mcp_jsonrpc_tools_call():
    """Verify MCP tools/call executes PromQL and diagnosis queries."""
    call_res = client.post("/mcp", json={
        "jsonrpc": "2.0",
        "id": 3,
        "method": "tools/call",
        "params": {
            "name": "grafana_query_metrics",
            "arguments": {"promql_query": "ashky_hook_strength_score"}
        }
    })
    assert call_res.status_code == 200
    call_data = call_res.json()
    assert "result" in call_data
    assert len(call_data["result"]["content"]) > 0
    assert call_data["result"]["isError"] is False

def test_closed_loop_retention_optimization():
    """Verify closed-loop agentic optimization triggers Scene 1 hook rewrite and upgrades retention score."""
    # Create test campaign in store
    camp_id = "test_loop_camp_01"
    CAMPAIGN_STORE[camp_id] = CampaignBlueprint(
        campaign_id=camp_id,
        product_name="SubZeroDB",
        aspect_ratio="9:16",
        total_duration_seconds=30.0,
        estimated_token_cost=0.038,
        scenes=[
            SceneBlueprint(
                scene_number=1,
                title="Slow Initial Hook",
                duration_seconds=3.0,
                timeframe="0-3s",
                camera_cues="Static pan",
                kinetic_motion="Text sits",
                text_overlay="SubZeroDB: In-Memory Database",
                voiceover_script="Are you looking for a faster database?",
                visual_prompt="Dark database UI",
                status="ready"
            )
        ],
        vision_qa=[
            VisionCriticScore(
                scene_number=1,
                hook_strength=82,
                brand_clarity=85,
                text_readability=88,
                predicted_3s_dropoff=24.5,
                critique_summary="Hook is too passive. Audience needs high-voltage pattern interrupt.",
                actionable_improvements=["Inject shock keyword in first 0.8s"],
                verdict="NEEDS POLISH"
            )
        ],
        created_at="2026-09-04T12:00:00Z"
    )

    # Trigger optimization loop
    res = client.post(f"/api/grafana/optimize-loop/{camp_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "optimized"
    assert data["previous_hook_score"] == 82
    assert data["optimized_hook_score"] > 82
    assert data["loop_verdict"] == "CLOSED-LOOP AGENTIC OPTIMIZATION SUCCESSFUL"

    # Verify campaign in store was updated
    updated_camp = CAMPAIGN_STORE[camp_id]
    assert "SUBZERODB" in updated_camp.scenes[0].text_overlay.upper()
    assert updated_camp.vision_qa[0].hook_strength > 82
