from typing import Dict, Any
from fastapi import APIRouter, Request
from app.models import TelemetrySnapshot, MCPAgentQuery, MCPAgentResponse
from app.services.telemetry import get_telemetry_snapshot, log_collector
from app.services.grafana_mcp import (
    GRAFANA_MCP_TOOLS,
    process_agent_inquiry,
    handle_mcp_jsonrpc,
    handle_mcp_tool_call
)

router = APIRouter(prefix="/api/grafana", tags=["grafana"])

@router.get("/snapshot", response_model=TelemetrySnapshot)
async def get_snapshot():
    """Retrieve full observability snapshot of metrics, Loki logs, and active agents."""
    data = get_telemetry_snapshot()
    return TelemetrySnapshot(**data)

@router.get("/mcp/tools")
async def get_mcp_tools():
    """List all registered Grafana Model Context Protocol (MCP) tools."""
    return {"tools": GRAFANA_MCP_TOOLS}

@router.get("/dashboard-json")
async def get_dashboard_json():
    """Retrieve pre-configured Grafana Cloud Dashboard JSON for 1-click import."""
    import json
    from pathlib import Path
    dashboard_path = Path(__file__).resolve().parent.parent.parent / "grafana" / "ashky_dashboard.json"
    if dashboard_path.exists():
        with open(dashboard_path, "r") as f:
            return json.load(f)
    return {"error": "Dashboard JSON not found"}

@router.post("/mcp/rpc")
async def mcp_jsonrpc_endpoint(request: Request):
    """
    Official Model Context Protocol (MCP) JSON-RPC 2.0 endpoint.
    Handles 'initialize', 'tools/list', 'tools/call', 'ping'.
    """
    body = await request.json()
    return await handle_mcp_jsonrpc(body)

@router.post("/optimize-loop/{campaign_id}")
async def trigger_closed_loop_optimization(campaign_id: str):
    """
    Closed-Loop Agentic Optimization Endpoint:
    Directly triggers the Grafana SRE retention optimization loop on a campaign.
    """
    log_collector.record_log(
        "INFO",
        "agent_loop",
        f"Manual trigger of Closed-Loop Optimization for campaign {campaign_id}"
    )
    result = await handle_mcp_tool_call(
        "grafana_optimize_retention_loop",
        {"campaign_id": campaign_id, "target_hook_score": 94}
    )
    return result

@router.post("/mcp/chat", response_model=MCPAgentResponse)
async def chat_with_mcp_agent(query: MCPAgentQuery):
    """Chat endpoint for interactive observability agent dialog."""
    log_collector.record_log(
        "INFO",
        "growth_sre_agent",
        f"Processing founder inquiry: '{query.user_query}'"
    )
    result = await process_agent_inquiry(query.user_query)
    return MCPAgentResponse(**result)
