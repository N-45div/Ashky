from fastapi import APIRouter
from app.models import TelemetrySnapshot, MCPAgentQuery, MCPAgentResponse
from app.services.telemetry import get_telemetry_snapshot, log_collector
from app.services.grafana_mcp import GRAFANA_MCP_TOOLS, process_agent_inquiry

router = APIRouter(prefix="/api/grafana", tags=["grafana"])

@router.get("/snapshot", response_model=TelemetrySnapshot)
async def get_snapshot():
    data = get_telemetry_snapshot()
    return TelemetrySnapshot(**data)

@router.get("/mcp/tools")
async def get_mcp_tools():
    return {"tools": GRAFANA_MCP_TOOLS}

@router.post("/mcp/chat", response_model=MCPAgentResponse)
async def chat_with_mcp_agent(query: MCPAgentQuery):
    log_collector.record_log(
        "INFO",
        "growth_sre_agent",
        f"Processing founder inquiry: '{query.user_query}'"
    )
    result = process_agent_inquiry(query.user_query)
    return MCPAgentResponse(**result)
