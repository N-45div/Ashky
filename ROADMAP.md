# 🗺️ Ashky Studio — Multi-Day Hackathon Roadmap

> **Google Agentic Cinema: The Blockbuster Hackathon**  
> *Partner Track: Grafana Labs ($15,000 Prize Pool)*  
> *AI Engine: Google Gemini 3.5 Flash Agentic Video Understanding & Grafana Cloud MCP*

---

## 📅 Roadmap Overview

```mermaid
gantt
    title Ashky Multi-Day Engineering Sprints
    dateFormat  YYYY-MM-DD
    section Sprints
    Day 1: Foundation, SSE Stream & MCP Foundation :done, d1, 2026-09-01, 1d
    Day 2: Gemini 3.5 Flash Agentic Model & Matte UI :done, d2, 2026-09-02, 1d
    Day 3: Real Video Rendering & TTS Audio Engine  :active, d3, 2026-09-03, 1d
    Day 4: Grafana Cloud Live Telemetry & Dashboards: d4, 2026-09-04, 1d
    Day 5: GEO Distribution & Multi-Format Export  : d5, 2026-09-05, 1d
    Day 6: Devpost Package, Demo Video & Submission : d6, 2026-09-06, 1d
```

---

## ✅ Day 1: Core Foundation & Progressive Architecture (Completed)
- [x] **FastAPI Production Backend**: Async architecture with Pydantic v2 schemas, CORS, and `/health` probes.
- [x] **Sub-2s FirstFrame Streaming**: Progressive 3-scene video generation via Server-Sent Events (SSE).
- [x] **Prometheus Instrumentation**: `/metrics` tracking `ashky_scene_render_duration_seconds`, `ashky_hook_strength_score`, and `ashky_llm_share_of_voice_pct`.
- [x] **Loki Log Collector**: Structured log collector capturing agent trace events.
- [x] **Grafana MCP Server**: MCP tools (`grafana_query_metrics`, `grafana_query_loki_logs`, `grafana_diagnose_pipeline`).
- [x] **Generative Engine Optimization (GEO)**: AI search prober and Schema.org VideoObject JSON-LD generator.
- [x] **Automated Tests**: Foundation test suite passing 100%.

---

## ✅ Day 2: Gemini 3.5 Flash Agentic Video Model & Matte UI (Completed)
- [x] **Gemini 3.5 Flash Agentic Video Engine**: Implemented *Think → Act → Observe* loop with targeted keyframe probing (0.8s, 2.2s, 8.5s, 24.0s) yielding **88% token reduction** and **66% cost savings**.
- [x] **Vision Critic QA**: Computes Hook Strength (0-100), Brand Clarity, and predicted 3-second viewer drop-off %.
- [x] **Agentic Inspect API**: Dedicated route `POST /api/campaigns/{id}/agentic-inspect`.
- [x] **Hollywood-Grade Matte Landing Page**: High-contrast matte graphite design system (Linear / Raycast aesthetic) with live interactive 9:16 cinema teaser HUD, 4-pillar bento grid, and instant founder pitch sandbox.
- [x] **Director Studio UI**: Complete dark-mode studio with live FirstFrame streaming, keyframe timeline inspector, and MCP sidecar copilot.
- [x] **Full 9-Test Suite Passing**: Verified with live Google Gemini API key.

---

## 🎯 Day 3: Real Video & Audio Synthesis Pipeline (Next Up)
- [ ] **AI Voiceover Synthesis (TTS)**: Integrate Edge TTS / Google Cloud TTS to synthesize natural founder voiceovers for Scenes 1, 2, and 3.
- [ ] **FFmpeg Server Compositor**: Automated video rendering service:
  - Dynamic scene transitions and camera zooms.
  - Burnt-in kinetic animated subtitles with custom timing.
  - Background audio ducking under speech tracks.
  - Downloadable 9:16 vertical MP4 export.
- [ ] **Interactive Video Player**: Upgraded studio player supporting native MP4 playback, scrub controls, and instant MP4 downloads.
- [ ] **Unit Tests**: Integration test suite verifying end-to-end audio/video synthesis and file export.

---

## 📊 Day 4: Grafana Cloud Live Telemetry & AI Observability Suite
- [ ] **Live Grafana Cloud Remote Write**: Exporter pushing Prometheus metrics and Loki logs directly to Grafana Cloud instance.
- [ ] **Pre-Packaged Grafana Dashboard JSON**:
  - Panel 1: Scene 1 FirstFrame render latency (SLA: <2s).
  - Panel 2: 3-Second Hook Retention & Drop-off gauge.
  - Panel 3: Gemini Token Consumption & Cost per Campaign.
  - Panel 4: LLM Share of Voice across Google Gemini, Perplexity, and SearchGPT.
- [ ] **Autonomous SRE Incident Bot**: Natural-language copilot running automated root-cause analysis on latency spikes and drop-off anomalies via Grafana MCP.

---

## 🌐 Day 5: GEO Distribution & Multi-Format Export
- [ ] **Multi-Aspect Ratio Rendering**: Automated simultaneous export for 9:16 Vertical Reels/Shorts/TikTok and 16:9 Landscape YouTube.
- [ ] **1-Click Semantic PR Package**:
  - Validated Schema.org `VideoObject` & `SoftwareApplication` JSON-LD.
  - Video XML Sitemap generator for rapid search crawling.
  - Press snippet distribution markdown exporter.
- [ ] **GEO Rank Tracking Simulator**: Historical tracking of brand Share of Voice across multiple AI query runs.

---

## 🚀 Day 6: Hackathon Submission & Devpost Package
- [ ] **3-Minute Demo Video Walkthrough**: Complete script, recorded live session showcasing FirstFrame <2s stream, Gemini 3.5 Flash Agentic Inspector, and Grafana MCP copilot.
- [ ] **Docker Compose Production Setup**: Single-command `docker-compose up` running FastAPI backend, Prometheus exporter, and React frontend.
- [ ] **Architecture Whitepaper & Devpost Documentation**: Final submission story highlighting the Grafana Labs Track innovation.
- [ ] **Final Code Freeze & Tag**: Release v1.0.0 on GitHub repository.

---

## 📄 Summary of Architecture & Alignment

| Dimension | Specification |
|---|---|
| **Hackathon** | Google Agentic Cinema: The Blockbuster Hackathon |
| **Partner Track** | Grafana Labs Track ($15,000 Track Prize Pool) |
| **Google Cloud AI** | Gemini 3.5 Flash Agentic Multimodal Video Understanding |
| **Observability** | Prometheus (`/metrics`), Loki Logs, Model Context Protocol (MCP) |
| **Frontend** | React 19 + Vite + Matte Graphite Design System |
| **Repository** | [https://github.com/N-45div/Ashky](https://github.com/N-45div/Ashky) |
