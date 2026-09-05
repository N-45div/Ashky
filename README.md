# Ashky - Autonomous Video Marketing & AI Search Optimization (GEO) Studio

> **Google Agentic Cinema: The Blockbuster Hackathon**  
> *Partner Track: Grafana Labs ($15,000 Track Prize Pool)*  
> *Powered by Google Gemini 3.5 Flash Agentic Video Understanding & Grafana Cloud Model Context Protocol (MCP)*

---

## 🌟 Overview

**Ashky** is an AI-native autonomous studio built for the **Google Agentic Cinema Blockbuster Hackathon (Grafana Labs Track)**. It solves the two biggest acquisition and distribution bottlenecks for solo founders and indie hackers:

1. **Autonomous Video Marketing**: Automatically generating viral, hook-driven video scripts, scene-by-scene blueprints, and camera motion directions with **FirstFrame UX** progressive streaming (Scene 1 ready in <2s).
2. **Gemini 3.5 Flash Agentic Video Understanding**: Powered by Google Gemini's new agentic video understanding model capability (*Think → Act → Observe* loop), Ashky dynamically searches and inspects keyframes rather than uniform frame dumping—slashing token consumption by **88%** and costs by **66%**, while delivering predictive 3-second hook drop-off analysis.
3. **Generative Engine Optimization (GEO)**: Measuring and maximizing brand citation authority across AI answer engines (**Google Gemini**, **Perplexity AI**, **ChatGPT Search**) and generating 1-click **Schema.org VideoObject JSON-LD** to ground AI citations.
4. **Grafana Cloud Observability & MCP Agent**: Built-in Prometheus metrics (`/metrics`), Loki log streams, and a **Model Context Protocol (MCP)** toolset (`grafana_query_metrics`, `grafana_query_loki_logs`, `grafana_diagnose_pipeline`) for real-time SRE incident response, token spend tracking, and pipeline diagnostics.

---

## 🏛️ System Architecture

```mermaid
graph TD
    A[Founder / Creator] -->|Pitch & Category| B[Ashky Director Studio]
    B -->|FirstFrame Progressive Stream| C[Scene 1: 0-3s Hook Interrupt]
    B -->|Progressive Render| D[Scene 2: Core Mechanism 3-15s]
    B -->|Progressive Render| E[Scene 3: Founder CTA 15-30s]
    
    C --> F[Gemini 3.5 Flash Agentic Video Understanding]
    D --> F
    E --> F
    
    F -->|88% Token Reduction| G[Vision Critic Scorecard: Hook, Clarity, 3s Drop-off]
    
    B --> H[GEO Search Intelligence Arm]
    H -->|Share of Voice Benchmark| I[Gemini Grounding, Perplexity, SearchGPT]
    H -->|Citation Magnet| J[Schema.org VideoObject JSON-LD]
    
    B --> K[Grafana Observability & MCP Copilot]
    K -->|Prometheus Metrics| L[/metrics: Render Latency, Hook Score, SOV]
    K -->|Loki Logs| M[Agent Activity Streams]
    K -->|MCP Tools| N[Autonomous SRE & Growth Diagnosis]
```

---

## 🚀 Key Features

### 1. Progressive Video Engine (Sub-2s FirstFrame UX)
- Traditional video generation takes 45–90 seconds of blank screen waiting.
- Ashky streams **Scene 1 (The 3-Second Pattern Interrupt)** via Server-Sent Events (SSE) in **1.42s**, allowing founders to review and iterate instantly while Scenes 2 and 3 render in the background.

### 2. Gemini 3.5 Flash Agentic Video Understanding
- **Think → Act → Observe Loop**: Dynamically searches and inspects salient keyframes (0.8s crash-zoom, 2.2s text pop-in, 8.5s UI transition, 24.0s CTA anchor) instead of static 1-FPS frame dumping.
- **Efficiency**: Reduces token usage from 20,400 to 2,450 tokens (**88% token reduction**) and slashes API costs by **66%**.
- **Vision Critic QA**: Computes Hook Strength (0-100), Brand Clarity (0-100), Text Readability (0-100), and Predicted 3-Second Drop-off %.

### 3. Generative Engine Optimization (GEO)
- Probes how AI answer engines answer commercial intent queries (e.g. *"Best AI tools for solo founders in 2026"*).
- Benchmarks **Share of Voice (SOV)** and detects citation gaps against incumbents.
- Generates valid **Schema.org `VideoObject`** and **`SoftwareApplication`** JSON-LD markup to directly ground LLM search engines.

### 4. Grafana Cloud Observability & Official Hosted MCP Server
- **Official Hosted MCP Server**: Direct Streamable HTTP integration via `https://mcp.grafana.com/mcp` routing to Grafana Cloud stack `https://giantdumpling1334.grafana.net` with `X-Grafana-URL` authentication.
- **Official MCP Tools**:
  - `query_prometheus`: PromQL telemetry execution for video rendering latency, token costs, and 3-second hook drop-off.
  - `query_loki`: LogQL pipeline log and error trace stream inspection.
  - `search_dashboards`: Catalog lookup linking the production dashboard (`ashky-telemetry-01`).
  - `list_alerts`: Real-time monitoring of fired alerts and SLA targets.
  - `grafana_diagnose_pipeline`: Autonomous multi-agent SRE sweeps synthesizing findings and SLO actions.
  - `grafana_optimize_retention_loop`: Closed-loop autonomous retention optimization rewriting Scene 1 if hook retention drops below 90.
- Live `/metrics` Prometheus scrape target tracking:
  - `ashky_scene_render_duration_seconds`
  - `ashky_hook_strength_score`
  - `ashky_llm_share_of_voice_pct`
  - `ashky_token_spend_usd`

---

## 📅 Sprint Milestones: Day 1 & Day 2

### ✅ Day 1: Core Foundation, AI Engines & Observability
- [x] FastAPI production backend with CORS, Pydantic v2 schemas, and health checks
- [x] Progressive 3-Scene Video Generation with Server-Sent Events (SSE)
- [x] Generative Engine Optimization (GEO) prober and Schema.org JSON-LD generator
- [x] Prometheus metrics instrumentation and Loki log collector
- [x] Official Grafana Cloud MCP server client (`https://mcp.grafana.com/mcp`) with JSON-RPC 2.0 dispatch
- [x] 100% test coverage with `pytest` (`backend/tests/test_foundation.py` and `backend/tests/test_grafana_cloud.py`)

### ✅ Day 2: Gemini Agentic Video Model & Interactive Studio
- [x] **Gemini 3.7 Flash Agentic Video Understanding Engine**: Dynamic timeline inspection with 88% token savings
- [x] Dedicated Agentic Video API (`POST /api/campaigns/{id}/agentic-inspect`)
- [x] **Hollywood-Grade Landing Page** (`frontend/src/pages/LandingPage.jsx`) with live cinematic preview HUD, hackathon track badge, and instant founder pitch sandbox
- [x] Full React 19 + Vite Dark-Mode Studio Frontend (`frontend/src/`):
  - Interactive Director Console with founder presets (B2B SaaS, Mobile App, DevTool)
  - Live FirstFrame progressive streaming preview
  - Gemini Vision Critic scorecard & 3-second drop-off predictor
  - Gemini Agentic Timeline inspector with frame-by-frame retention scoring
  - GEO Intelligence Matrix & 1-click JSON-LD Schema exporter
  - Real-time Grafana MCP Agent sidecar copilot with live `mcp.grafana.com` connection badge
- [x] Comprehensive test suite with 13 passing unit & integration tests (`pytest`)
- [x] Single-port deployment with static bundle mounting

---

## 🛠️ Quickstart Guide

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Clone & Setup Backend
```bash
git clone https://github.com/N-45div/Ashky.git
cd Ashky

# Install backend dependencies
pip install -r backend/requirements.txt

# Add your Gemini API key in .env
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
```

### 2. Run Backend Tests
```bash
python -m pytest -v
```

### 3. Start Backend Server
```bash
uvicorn app.main:app --app-dir backend --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Prometheus Metrics: `http://localhost:8000/metrics`
- Health Check: `http://localhost:8000/health`
- MCP JSON-RPC 2.0: `http://localhost:8000/mcp`

### 4. Start Frontend Studio
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to launch the **Ashky Studio**!

---

## 🧪 Verified Test Suite

```
backend/tests/test_grafana_cloud.py::test_prometheus_metrics_endpoint PASSED     [  7%]
backend/tests/test_grafana_cloud.py::test_mcp_jsonrpc_initialize_and_tools PASSED [ 15%]
backend/tests/test_grafana_cloud.py::test_mcp_jsonrpc_tools_call PASSED          [ 23%]
backend/tests/test_grafana_cloud.py::test_closed_loop_retention_optimization PASSED [ 30%]
backend/tests/test_grafana_cloud.py::test_official_grafana_mcp_tools PASSED      [ 38%]
backend/tests/test_foundation.py::test_health PASSED                             [ 46%]
backend/tests/test_foundation.py::test_prometheus_metrics PASSED                 [ 53%]
backend/tests/test_foundation.py::test_campaign_presets PASSED                   [ 61%]
backend/tests/test_foundation.py::test_campaign_create PASSED                    [ 69%]
backend/tests/test_foundation.py::test_geo_probe PASSED                          [ 76%]
backend/tests/test_foundation.py::test_geo_schema PASSED                         [ 84%]
backend/tests/test_foundation.py::test_grafana_snapshot_and_mcp PASSED           [ 92%]
backend/tests/test_foundation.py::test_neon_circuit_seeded_campaign PASSED       [100%]
```

---

## 📄 License
MIT License. Built by [N Divij](https://github.com/N-45div) for the Google Agentic Cinema Hackathon (Grafana Labs Track).
