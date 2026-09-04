from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.services.telemetry import get_prometheus_metrics_text, log_collector
from app.services.tts_engine import MEDIA_ROOT, ensure_media_dirs
from app.api import campaigns, geo, grafana

# Ensure media storage directories exist
ensure_media_dirs()

app = FastAPI(
    title=settings.APP_NAME,
    description="Autonomous Video Marketing & AI Search Optimization (GEO) Studio for Solo Founders (Google Agentic Cinema Hackathon)",
    version=settings.APP_VERSION
)

# Static media route for rendered audio & video assets
app.mount("/media", StaticFiles(directory=str(MEDIA_ROOT)), name="media")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(campaigns.router)
app.include_router(geo.router)
app.include_router(grafana.router)

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "tagline": "Autonomous Video Marketing & AI Search Optimization (GEO) Studio for Solo Founders",
        "docs_url": "/docs",
        "metrics_url": "/metrics"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "engines": {
            "progressive_video_engine": "operational",
            "gemini_vision_critic": "operational",
            "geo_search_arm": "operational",
            "grafana_mcp_observability": "operational"
        }
    }

@app.get("/metrics")
async def prometheus_metrics():
    """Prometheus endpoint scraped by Grafana Agent / Prometheus server"""
    content = get_prometheus_metrics_text()
    return Response(content=content, media_type="text/plain; version=0.0.4")

from fastapi import Request
from app.services.grafana_mcp import handle_mcp_jsonrpc

@app.post("/mcp")
async def root_mcp_endpoint(request: Request):
    """Root JSON-RPC 2.0 endpoint for external Model Context Protocol clients."""
    body = await request.json()
    return await handle_mcp_jsonrpc(body)

# Optional Frontend Mounting if built
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/studio", response_class=FileResponse)
    @app.get("/app", response_class=FileResponse)
    async def serve_studio():
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

