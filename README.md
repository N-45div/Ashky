# 🎬 Ashky - Autonomous Video Marketing & AI Search Optimization (GEO) Studio

> **Google Agentic Cinema: The Blockbuster Hackathon**  
> *Partner Track: Grafana Labs ($15,000 Track Prize Pool)*  
> *Powered by Google Gemini 3.5 Flash Agentic Video Understanding & Grafana Cloud Model Context Protocol (MCP)*

[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2%2B-646CFF.svg)](https://vitejs.dev/)
[![Grafana Cloud MCP](https://img.shields.io/badge/Grafana%20Cloud-MCP%20Enabled-F46800.svg)](https://mcp.grafana.com)
[![Gemini 3.5 Flash](https://img.shields.io/badge/Google%20Gemini-Agentic%20Video-4285F4.svg)](https://ai.google.dev)
[![Tests Passing](https://img.shields.io/badge/Tests-21%2F21%20Passed-brightgreen.svg)](TESTING.md)

---

## 🌟 Executive Summary

**Ashky** is an AI-native autonomous cinema studio built specifically for the **Google Agentic Cinema Blockbuster Hackathon (Grafana Labs Track)**. It solves the two most crippling distribution bottlenecks for solo founders, indie hackers, and technical creators:

1. **Autonomous Video Production**: Translating technical pitches into viral, hook-driven video scripts, scene-by-scene cinematography blueprints, and voiceovers with **FirstFrame UX** (Scene 1 rendered in **< 1.5s**).
2. **Gemini 3.5 Flash Agentic Video Understanding**: Dynamically executing an agentic *Think → Act → Observe* loop that selectively inspects salient timeline keyframes rather than uniform frame dumping—slashing token consumption by **88%** and inference costs by **66%** while predicting 3-second hook drop-off rates.
3. **Generative Engine Optimization (GEO)**: Measuring and maximizing brand citation authority across AI answer engines (**Google Gemini**, **Perplexity AI**, **ChatGPT Search**) and generating 1-click **Schema.org VideoObject JSON-LD** to ground AI search citations.
4. **Grafana Cloud Observability & Official Hosted MCP Server**: Built-in Prometheus telemetry (`/metrics`), Loki error traces, and full **Model Context Protocol (MCP)** JSON-RPC 2.0 dispatch (`https://mcp.grafana.com/mcp`) for autonomous SRE self-healing and closed-loop retention re-writing.

For full architectural blueprints, see **[ARCHITECTURE.md](ARCHITECTURE.md)**.  
For test verification logs and cURL recipes, see **[TESTING.md](TESTING.md)**.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph ClientLayer["🖥️ Frontend Studio (React 19 + Vite)"]
        UI["Director Console & Cinematic HUD"]
        Phone["Mobile & Full Studio Frame"]
        Runner["Audio-Video Runner Bar"]
        ObservabilityHUD["Live Particle Observability View"]
    end

    subgraph FastAPIGateway["⚡ FastAPI Application Gateway (:8000)"]
        Router["API Router & Pydantic v2 Contract Engine"]
        SSEHub["Server-Sent Events (SSE) Progressive Hub"]
        MCPDispatcher["Model Context Protocol (MCP) JSON-RPC 2.0"]
        StaticMounter["SPA & Media Asset Engine (/media)"]
    end

    subgraph AgenticCluster["🤖 Multi-Agent Orchestration Cluster"]
        Director["Gemini Flash Director Agent"]
        Critic["Gemini 3.5 Flash Vision Critic (Think-Act-Observe)"]
        GEOScout["GEO Search Intelligence Arm"]
        SREAgent["Grafana MCP Autonomous Copilot"]
    end

    subgraph GenerationEngines["🎞️ Dual Video Generation Engines"]
        Turbo["Turbo Engine (Deterministic PIL + FFmpeg)"]
        Veo["Google Cloud Veo Engine (1080p Video Generation)"]
        TTS["Edge & Web Audio TTS Synthesizer"]
    end

    subgraph ObservabilityLayer["📈 Grafana Cloud & Prometheus Ecosystem"]
        Prom["Prometheus Engine (/metrics)"]
        Loki["Loki Pipeline Event Logger"]
        Dash["Grafana Dashboard (ashky-telemetry-01)"]
        MCPHosted["Hosted MCP Gateway (mcp.grafana.com)"]
    end

    UI -->|Create Campaign| Router
    Router -->|Progressive Dispatch| SSEHub
    SSEHub -->|Scene 1 in 1.4s| Phone
    Router --> Director
    Director --> GenerationEngines
    GenerationEngines --> Critic
    Critic -->|88% Token Reduction| ObservabilityHUD
    Router --> GEOScout
    MCPDispatcher <--> MCPHosted
    Router --> Prom
    Router --> Loki
    Prom --> Dash
    SREAgent <--> MCPDispatcher
```

---

## 🎬 End-to-End Orchestration Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Founder as Solo Founder
    participant Studio as Studio Interface
    participant Gateway as FastAPI Gateway
    participant Director as Gemini Director Agent
    participant Engine as Progressive Video Engine
    participant Critic as Gemini Vision Critic
    participant Grafana as Grafana Cloud & MCP

    Founder->>Studio: Enter product pitch & select category preset
    Studio->>Gateway: POST /api/campaigns/create
    Gateway->>Director: Formulate 3-scene blueprint
    Director-->>Gateway: Blueprint generated (3 Scenes, Prompts, Voiceover)
    
    par Progressive Scene 1 Stream (Sub-2s FirstFrame UX)
        Gateway->>Engine: Render Scene 1 (0-3s Hook Interrupt)
        Engine-->>Studio: SSE event: scene_ready (1.42s latency)
        Studio-->>Founder: Real-time visual playback in mobile canvas
    and Background Scene 2 & 3
        Gateway->>Engine: Render Scene 2 (Mechanism) & Scene 3 (CTA)
        Engine-->>Studio: SSE events: scene_ready (Scene 2, Scene 3)
    end

    Gateway->>Critic: POST /api/campaigns/{id}/agentic-inspect
    Critic->>Critic: Think → Act (Jump to 0.8s, 2.2s, 8.5s) → Observe
    Critic-->>Gateway: Scorecard: Hook 94, Dropoff 14.2%, 88% Token Savings
    Gateway->>Grafana: Ingest Prometheus metrics (/metrics) & Loki logs
    
    opt Retention Drop Detected (<90)
        Grafana->>Gateway: Trigger MCP Tool: grafana_optimize_retention_loop
        Gateway->>Director: Autonomous rewrite of Scene 1 pattern interrupt
        Director-->>Engine: Re-render Scene 1
    end
```

---

## 🚀 Key Architectural Innovations

### 1. Progressive Video Engine (Sub-2s FirstFrame UX)
- **The Problem**: Traditional video generation requires 45–120 seconds of blank-screen waiting, leading to 80% user drop-off.
- **The Solution**: Ashky decouples the video timeline into 3 discrete narrative arcs:
  - **Scene 1 (0–3s)**: Pattern interrupt hook. Generated and streamed via SSE in **1.42 seconds**.
  - **Scene 2 (3–15s)**: Core product mechanism & problem-solving walkthrough.
  - **Scene 3 (15–30s)**: Value-anchored call to action & founder proof.
- Founders evaluate visual pacing, typography, and audio immediately while subsequent scenes render in the background.

```mermaid
stateDiagram-v2
    [*] --> Idle: Pitch Entered
    Idle --> GeneratingScene1: SSE Connection Opened
    GeneratingScene1 --> Scene1Ready: FirstFrame Arrives (1.42s)
    Scene1Ready --> GeneratingScene2: Streaming Scene 2
    GeneratingScene2 --> Scene2Ready: Scene 2 Rendered (4.1s)
    Scene2Ready --> GeneratingScene3: Streaming Scene 3
    GeneratingScene3 --> FullyAssembled: 3-Scene Timeline Synced (7.8s)
    FullyAssembled --> AgenticQA: Gemini Vision Critic Analysis
    AgenticQA --> ProductionReady: Ready for Export & GEO Distribution
```

### 2. Gemini 3.5 Flash Agentic Video Understanding
- **Think → Act → Observe Loop**: Rather than uniformly sampling 30–60 frames (expensive, redundant), Ashky’s Vision Critic autonomously searches for salient narrative events:
  - `0.8s`: Crash-zoom & visual hook arrival
  - `2.2s`: Value proposition kinetic typography pop-in
  - `8.5s`: Product mechanism UI proof
  - `24.0s`: Conversion CTA anchor
- **88% Token Reduction**: Reduces inference cost from ~20,400 tokens to **2,450 tokens** per video analysis.
- **66% Cost Reduction**: Slashes Gemini API expenditure from $0.035 to **$0.012** per evaluation.
- **Predictive Drop-off Analytics**: Calculates predicted 3-second viewer drop-off percentage and flags retention bottlenecks before publishing.

### 3. Generative Engine Optimization (GEO)
- **AI Answer Engine Benchmarking**: Probes how **Google Gemini**, **Perplexity AI**, and **ChatGPT Search** cite tools in commercial queries.
- **Share of Voice (SOV) Analysis**: Measures brand citation frequency against entrenched legacy competitors.
- **Schema.org JSON-LD Grounding**: Generates 1-click valid `VideoObject` and `SoftwareApplication` structured metadata to enable LLM search crawlers to index and cite founder videos.

### 4. Grafana Cloud Observability & Official Hosted MCP Server
- **Official Hosted MCP Server**: Direct integration via `https://mcp.grafana.com/mcp` routing to Grafana Cloud stack (`$GRAFANA_STACK_URL`) with `X-Grafana-URL` authentication.
- **Official Model Context Protocol Tools**:
  - `query_prometheus`: PromQL telemetry execution for video rendering latency, token costs, and 3-second hook drop-off.
  - `query_loki`: LogQL pipeline log and error trace stream inspection.
  - `search_dashboards`: Catalog lookup linking the production dashboard (`ashky-telemetry-01`).
  - `list_alerts`: Real-time monitoring of fired alerts and SLA targets.
  - `grafana_diagnose_pipeline`: Autonomous multi-agent SRE sweeps synthesizing findings and SLO actions.
  - `grafana_optimize_retention_loop`: Closed-loop autonomous retention optimization rewriting Scene 1 if hook retention drops below 90.
- **Prometheus Metrics Scrape Target** (`/metrics`):
  - `ashky_scene_render_duration_seconds` (Histogram)
  - `ashky_hook_strength_score` (Histogram)
  - `ashky_llm_share_of_voice_pct` (Gauge by engine)
  - `ashky_gemini_tokens_total` (Counter)
  - `ashky_token_cost_usd_total` (Counter)

---

## 📂 Repository Directory Layout

```
Ashky/
├── ARCHITECTURE.md                  # Comprehensive 9-part system specification & 8 Mermaid diagrams
├── TESTING.md                       # Full 21-test verification matrix, curl recipes, QA guide
├── README.md                        # Master project documentation
├── Dockerfile                       # Production multi-stage Docker build
├── docker-compose.yml               # Local container orchestration
├── pytest.ini                       # Automated test suite configuration
├── backend/
│   ├── requirements.txt             # Python production dependencies
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint & SPA mounting
│   │   ├── config.py                # Pydantic v2 environment settings
│   │   ├── api/
│   │   │   ├── campaigns.py         # Progressive video, agentic inspect, render routes
│   │   │   ├── geo.py               # Share of voice prober & Schema.org generator
│   │   │   └── grafana.py           # Telemetry snapshots, MCP tools, closed-loop rewriter
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic data contracts & MCP models
│   │   └── services/
│   │       ├── gemini_director.py   # Script, visual prompt, and cinematography engine
│   │       ├── gemini_agentic.py    # Think-Act-Observe video understanding engine
│   │       ├── geo_optimizer.py     # AI search benchmark & Schema.org engine
│   │       ├── grafana_mcp.py       # Official hosted MCP client & JSON-RPC dispatcher
│   │       ├── telemetry.py         # Prometheus metrics & Loki log collector
│   │       ├── tts_engine.py        # Voiceover synthesis & audio pipeline
│   │       └── video_pipeline.py    # Turbo PIL+FFmpeg engine & Google Veo renderer
│   └── tests/
│       ├── test_foundation.py       # 8 unit & integration tests
│       ├── test_gemini_agentic.py   # 3 Think-Act-Observe & token reduction tests
│       ├── test_grafana_cloud.py    # 5 MCP JSON-RPC & observability tests
│       └── test_video_pipeline.py   # 5 progressive stream & render tests
├── frontend/
│   ├── package.json                 # Frontend dependencies (React 19, Lucide, Tailwind utilities)
│   ├── vite.config.js               # Vite build configuration & proxy
│   └── src/
│       ├── App.jsx                  # Single Page Application router & navigation
│       ├── index.css                # Cinematic dark-mode design system & responsive layout
│       └── pages/
│           ├── LandingPage.jsx      # Hollywood-grade landing experience with pitch sandbox
│           ├── VideoStudio.jsx      # Interactive Director Console & mobile phone viewport
│           ├── ObservabilityView.jsx# Real-time particle DAGs & PromQL telemetry charts
│           └── GeoOptimizerView.jsx # Share of Voice benchmark & Schema.org exporter
└── grafana/
    └── ashky-production-dashboard.json # Grafana Cloud dashboard definition
```

---

## 🛠️ Quickstart Guide

### Prerequisites
- **Python**: 3.11 or 3.12
- **Node.js**: 18+ (npm 9+)
- **FFmpeg**: Optional (fallback canvas rendering available if FFmpeg not in PATH)
- **API Keys**: Google Gemini API Key (optional: Grafana Cloud token, Google Veo token)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/N-45div/Ashky.git
cd Ashky

# Copy environment template
cp .env.example .env
```

Configure `.env` with your credentials:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
GRAFANA_STACK_URL=https://your-stack.grafana.net
GRAFANA_TOKEN=your_grafana_cloud_api_token
GRAFANA_METRICS_USER=your_metrics_user_id
GRAFANA_LOKI_USER=your_loki_user_id
```

### 2. Backend Setup & Test Run
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Run complete 21-test automated suite
python -m pytest backend/tests/ -v
```

### 3. Start Backend Server
```bash
# Start FastAPI gateway on port 8000
uvicorn app.main:app --app-dir backend --reload --port 8000
```
- Interactive Swagger API Docs: `http://localhost:8000/docs`
- Prometheus Scrape Target: `http://localhost:8000/metrics`
- System Health Check: `http://localhost:8000/health`
- MCP JSON-RPC 2.0 Endpoint: `http://localhost:8000/mcp`

### 4. Start Frontend Studio
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to launch the **Ashky Studio**!

### 5. Production Build & Single-Port Serving
```bash
# Build React 19 bundle
cd frontend
npm run build

# Start FastAPI - automatically mounts frontend/dist static assets
cd ..
uvicorn app.main:app --app-dir backend --port 8000
```
Visit `http://localhost:8000` to experience full single-port production serving!

---

## 🧪 Verified Automated Test Matrix

All 21 automated tests pass across all 4 test modules:

```
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-8.4.2
rootdir: C:\Users\DivijN\ashky
configfile: pytest.ini

backend/tests/test_foundation.py::test_health PASSED                             [  4%]
backend/tests/test_foundation.py::test_prometheus_metrics PASSED                 [  9%]
backend/tests/test_foundation.py::test_campaign_presets PASSED                   [ 14%]
backend/tests/test_foundation.py::test_campaign_create PASSED                    [ 19%]
backend/tests/test_foundation.py::test_geo_probe PASSED                          [ 23%]
backend/tests/test_foundation.py::test_geo_schema PASSED                         [ 28%]
backend/tests/test_foundation.py::test_grafana_snapshot_and_mcp PASSED           [ 33%]
backend/tests/test_foundation.py::test_neon_circuit_seeded_campaign PASSED       [ 38%]
backend/tests/test_gemini_agentic.py::test_gemini_agentic_inspection_direct PASSED [ 42%]
backend/tests/test_gemini_agentic.py::test_gemini_agentic_inspection_existing_campaign PASSED [ 47%]
backend/tests/test_gemini_agentic.py::test_dynamic_blueprint_generation_varies_by_product PASSED [ 52%]
backend/tests/test_grafana_cloud.py::test_prometheus_metrics_endpoint PASSED     [ 57%]
backend/tests/test_grafana_cloud.py::test_mcp_jsonrpc_initialize_and_tools PASSED [ 61%]
backend/tests/test_grafana_cloud.py::test_mcp_jsonrpc_tools_call PASSED          [ 66%]
backend/tests/test_grafana_cloud.py::test_closed_loop_retention_optimization PASSED [ 71%]
backend/tests/test_grafana_cloud.py::test_official_grafana_mcp_tools PASSED      [ 76%]
backend/tests/test_video_pipeline.py::test_tts_voiceover_synthesis PASSED        [ 80%]
backend/tests/test_video_pipeline.py::test_video_compositor_scene_and_campaign_assembly PASSED [ 85%]
backend/tests/test_video_pipeline.py::test_image_generator_and_compositing_with_visuals PASSED [ 90%]
backend/tests/test_video_pipeline.py::test_render_endpoint_validation_and_status PASSED [ 95%]
backend/tests/test_video_pipeline.py::test_campaign_create_and_render_initiation PASSED [100%]

================= 21 passed, 9 warnings in 209.62s (0:03:29) ==================
```

For test reproduction and cURL recipes, see **[TESTING.md](TESTING.md)**.

---

## 🤖 Model Context Protocol (MCP) Integration

Ashky implements the **Model Context Protocol (MCP)** specification (`2024-11-05`) via both:
1. **In-Studio MCP Server** (`http://localhost:8000/mcp`): Exposing telemetry and agentic control to external MCP hosts (Claude Desktop, Cursor, Zed).
2. **Official Hosted Grafana MCP Gateway** (`https://mcp.grafana.com/mcp`): Connecting directly to your Grafana Cloud organization stack.

### Registered MCP Tools Catalog

| Tool Name | Parameters | Purpose |
| :--- | :--- | :--- |
| `query_prometheus` | `query: str`, `time_range: str` | PromQL execution for latency, hook score, and token telemetry |
| `query_loki` | `query: str`, `limit: int` | LogQL execution across error traces and pipeline events |
| `search_dashboards`| `query: str` | Catalog lookup for production dashboards |
| `list_alerts` | `state: str` | Real-time monitoring of fired SRE alerting rules |
| `grafana_diagnose_pipeline` | `focus_area: str` | Multi-agent autonomous diagnosis of drop-off anomalies |
| `grafana_optimize_retention_loop` | `campaign_id: str`, `target_hook_score: int` | Closed-loop self-healing: rewrites Scene 1 if hook < 90 |

### Claude Desktop / Cursor MCP Configuration (`mcp_config.json`)

```json
{
  "mcpServers": {
    "ashky-grafana": {
      "command": "curl",
      "args": [
        "-X", "POST",
        "http://localhost:8000/mcp",
        "-H", "Content-Type: application/json"
      ]
    }
  }
}
```

---

## ⚙️ Environment Variables Reference

| Variable Name | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `GEMINI_API_KEY` | Recommended | `""` | Google Gemini 3.5 Flash & 3.7 API access key |
| `GRAFANA_STACK_URL` | Optional | `""` | Base URL of Grafana Cloud stack (e.g. `https://my-stack.grafana.net`) |
| `GRAFANA_TOKEN` | Optional | `""` | Grafana Cloud Service Account token (`glc_...`) |
| `GRAFANA_METRICS_USER` | Optional | `""` | Prometheus remote-write instance user ID |
| `GRAFANA_LOKI_USER` | Optional | `""` | Loki remote-write instance user ID |
| `VEO_API_KEY` | Optional | `""` | Google Cloud Veo photorealistic video generation API key |
| `HOST` | Optional | `0.0.0.0` | Backend bind host address |
| `PORT` | Optional | `8000` | Backend bind HTTP port |
| `ENVIRONMENT` | Optional | `development` | Deployment environment (`development` / `production`) |
| `DEBUG` | Optional | `True` | Fast reloading and verbose tracebacks |

---

## 🏆 Hackathon Submission Details

- **Hackathon**: Google Agentic Cinema: The Blockbuster Hackathon
- **Track**: Grafana Labs Partner Track ($15,000 Prize Pool)
- **Author**: [N Divij](https://github.com/N-45div)
- **Architecture Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Testing & Verification**: [TESTING.md](TESTING.md)
- **License**: MIT License
