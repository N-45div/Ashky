# Ashky Studio — System Architecture & Technical Specification

> **Google Agentic Cinema: The Blockbuster Hackathon**  
> **Partner Track**: Grafana Labs ($15,000 Track Prize Pool)  
> **Core Technologies**: Google Gemini 3.8 Flash · Google Veo 3.1 Cinema · Grafana Cloud Hosted MCP · Prometheus · Loki · FastAPI · React 19

---

## Table of Contents
1. [Executive Architectural Summary](#1-executive-architectural-summary)
2. [High-Level System Topology (C4 Model)](#2-high-level-system-topology-c4-model)
3. [Multi-Agent Orchestration & Flowchart](#3-multi-agent-orchestration--flowchart)
4. [Progressive Video Generation Pipeline (FirstFrame UX)](#4-progressive-video-generation-pipeline-firstframe-ux)
5. [Gemini Agentic Video Understanding (Think-Act-Observe)](#5-gemini-agentic-video-understanding-think-act-observe)
6. [Generative Engine Optimization (GEO) & Schema Grounding](#6-generative-engine-optimization-geo--schema-grounding)
7. [Grafana Cloud Observability & MCP JSON-RPC 2.0 Dispatch](#7-grafana-cloud-observability--mcp-json-rpc-20-dispatch)
8. [Data Models & State Lifecycle](#8-data-models--state-lifecycle)
9. [Deployment Topology & Security Architecture](#9-deployment-topology--security-architecture)

---

## 1. Executive Architectural Summary

**Ashky** is an autonomous, agentic cinema and marketing intelligence platform engineered for solo founders, indie developers, and growth teams. Traditional marketing video production requires 45–90 seconds of blank-screen latency, high GPU costs, manual frame-by-frame critique, and disjointed SEO distribution.

Ashky solves this through five interconnected subsystems:
1. **FirstFrame Progressive Streaming**: Sub-2s preview delivery of Scene 1 (Pattern Interrupt) via Server-Sent Events (SSE) while background workers render Scenes 2 and 3.
2. **Dual-Engine Cinema Compositing**: High-fidelity video generation via **Google Veo 3.1 Cinema** and real-time kinetic assembly via **Turbo Compositor (FFmpeg + Edge TTS)**.
3. **Gemini Agentic Video Understanding**: A *Think → Act → Observe* keyframe inspection agent that selectively targets salient temporal milestones (0.8s crash-zoom, 2.2s text pop-in, 8.5s UI reveal, 24.0s CTA anchor) rather than uniform 1-FPS frame dumping—reducing token consumption by **88%** and costs by **66%**.
4. **Generative Engine Optimization (GEO)**: Systematic probing of AI answer engines (Google Gemini, Perplexity, SearchGPT) to quantify Share of Voice (SOV) and emit 1-click **Schema.org `VideoObject`** JSON-LD to anchor organic machine citations.
5. **Grafana Cloud Hosted MCP SRE Agent**: Native integration with the official **Grafana Cloud Model Context Protocol (`mcp.grafana.com/mcp`)**, exposing Prometheus metrics (`/metrics`), Loki log streams, and an autonomous SRE agent capable of PromQL diagnostics and closed-loop script optimization.

---

## 2. High-Level System Topology (C4 Model)

The following diagram illustrates the interaction between external creators, AI engines, the Ashky backend platform, and Grafana Cloud.

```mermaid
flowchart TB
    subgraph ClientLayer [Client & Studio Interface]
        Founder[Founder / Creator]
        UI[React 19 + Vite Dark-Mode Studio]
        Studio[Master Cinema Stage / NLE Timeline]
        ObsTab[Observability & MCP Terminal]
        GeoTab[GEO Matrix & Schema Exporter]
    end

    subgraph AppServer [Ashky FastAPI Backend Application]
        Router[FastAPI API Gateway]
        CampAPI[Campaigns & Synthesis Controller]
        GeoAPI[GEO Prober & Schema Engine]
        MCPEndpoint[Local & Remote MCP JSON-RPC 2.0 Dispatch]
        MetricsEndpoint[/metrics Prometheus Exporter]
        SSE[Server-Sent Events Streamer]
        BgWorker[Async Background Task Queue]
    end

    subgraph ServiceLayer [Internal AI & Video Services]
        GeminiDirector[Gemini 3.8 Flash Director Engine]
        VeoEngine[Google Veo 3.1 Video Engine]
        Compositor[FFmpeg Kinetic Video Compositor]
        TTSEngine[Microsoft Edge TTS Voice Synthesizer]
        ImgEngine[Gemini 3.1 Flash Image Generator]
        LogCollector[In-Memory Ring Buffer Log Collector]
    end

    subgraph ExternalEcosystem [External AI & Cloud Services]
        GoogleCloud[Google Cloud Generative AI: Gemini & Veo API]
        GrafanaCloud[Official Hosted MCP: mcp.grafana.com]
        Prometheus[Grafana Cloud Prometheus / Mimir]
        Loki[Grafana Cloud Loki Logs]
        SearchEngines[AI Answer Engines: Gemini, Perplexity, SearchGPT]
    end

    Founder -->|Interacts| UI
    UI --> Studio & ObsTab & GeoTab
    Studio & ObsTab & GeoTab -->|REST / SSE / JSON-RPC| Router
    Router --> CampAPI & GeoAPI & MCPEndpoint & MetricsEndpoint & SSE

    CampAPI --> BgWorker
    BgWorker --> GeminiDirector & VeoEngine & Compositor & TTSEngine & ImgEngine
    GeminiDirector --> GoogleCloud
    VeoEngine --> GoogleCloud
    ImgEngine --> GoogleCloud

    GeoAPI --> SearchEngines
    MCPEndpoint -->|Streamable HTTP| GrafanaCloud
    MetricsEndpoint -->|Scraped by| Prometheus
    LogCollector -->|Pushed to| Loki
    GrafanaCloud --> Prometheus & Loki
```

---

## 3. Multi-Agent Orchestration & Flowchart

Ashky operates an autonomous multi-agent architecture where four specialized agents collaborate to create, inspect, optimize, and observe marketing cinematic reels:

```mermaid
sequenceDiagram
    autonumber
    actor Founder as Creator / Solo Founder
    participant Orchestrator as Ashky Orchestrator
    participant GeminiDirector as Gemini 3.8 Flash Director Agent
    participant VideoEngine as Veo 3.1 / Turbo Compositor
    participant CriticAgent as Gemini 3.8 Flash Vision Critic (Multimodal TAO Loop)
    participant MCPAgent as Grafana Cloud MCP Agent

    Founder->>Orchestrator: Submit Project Brief (Name, Pitch, Style, Audience)
    Orchestrator->>GeminiDirector: Request 3-Scene Cinema Blueprint
    GeminiDirector-->>Orchestrator: Emits 3 Scenes (Pattern Interrupt, Mechanism, CTA)
    
    par Progressive Rendering
        Orchestrator->>VideoEngine: Render Scene 1 (The 3-Second Hook)
        VideoEngine-->>Founder: Stream Scene 1 via SSE (< 2.0s FirstFrame UX)
    and Background Generation
        Orchestrator->>VideoEngine: Render Scene 2 & Scene 3 in background
        VideoEngine-->>Orchestrator: Complete Video Assembly (.mp4)
    end

    Orchestrator->>CriticAgent: Run Agentic Video Inspection (0-3s Hook)
    Note over CriticAgent: Think-Act-Observe Keyframe Extraction
    CriticAgent-->>Orchestrator: Scorecard: Hook 94%, Brand 95%, 3s Drop-off 13.8%

    alt Hook Retention < 90%
        Orchestrator->>MCPAgent: Trigger Autonomous Closed-Loop Retention Loop
        MCPAgent->>GeminiDirector: Rewrite Scene 1 with Higher Contrast Hook
        GeminiDirector-->>Orchestrator: Revised Blueprint & Auto-Re-render
    end

    Orchestrator->>MCPAgent: Push Render Latency, Tokens, & Hook Telemetry
    MCPAgent-->>Founder: Live Dashboard & Trace Diagnostics Updated
```

---

## 4. Progressive Video Generation Pipeline (FirstFrame UX)

Traditional video generative pipelines force users into a 45–90 second blank waiting state. Ashky decouples Scene 1 generation from the remaining scenes to provide immediate creative feedback.

```mermaid
stateDiagram-v2
    [*] --> Submitted: Creator initiates Synthesis
    
    state "Phase 1: Blueprint Generation" as P1 {
        Submitted --> GeminiPrompt: Dispatch prompt to Gemini 3.8 Flash
        GeminiPrompt --> ParseBlueprint: Extract 3 Scene Blueprints & Timings
    }

    state "Phase 2: FirstFrame Streaming (Scene 1)" as P2 {
        ParseBlueprint --> TTS_Scene1: Edge TTS generates Scene 1 Voiceover (0.4s)
        TTS_Scene1 --> Visual_Scene1: Veo / Image Engine builds Scene 1 Visual
        Visual_Scene1 --> Composite_Scene1: FFmpeg stitches 9:16 Scene 1 with Burnt-in Subtitles
        Composite_Scene1 --> SSE_Stream: SSE Event 'scene_ready' (Scene 1) < 2s
    }

    state "Phase 3: Background Batch Rendering" as P3 {
        SSE_Stream --> ParallelRender: Scenes 2 & 3 synthesize concurrently
        ParallelRender --> FullAssembly: Concatenate Scene 1 + 2 + 3 into Master .mp4
        FullAssembly --> Complete: SSE Event 'campaign_completed'
    }

    Complete --> [*]
```

### Video Rendering Engine Modes:
- **`veo` Mode (Google Veo 3.1)**: Calls Google Generative AI `models.generate_videos` with 9:16 vertical cinema parameters, polls operation status asynchronously, and downloads the cinematic MP4 clip.
- **`turbo` Mode (Kinetic Compositor)**: Assembles procedural neon aesthetic backgrounds with PIL and composites subtitles and Edge TTS voiceover with FFmpeg in under 3.5 seconds.

---

## 5. Gemini Agentic Video Understanding (Think-Act-Observe)

Rather than uniform 1-FPS frame dumping (which consumes 20,000+ tokens and introduces irrelevant noise), Ashky leverages Google Gemini's agentic inspection loop to selectively seek and analyze salient milestones.

```mermaid
flowchart LR
    subgraph Traditional [Uniform 1-FPS Frame Dumping]
        V1[30s Video] --> D1[Extract 30 Frames @ 1 FPS]
        D1 --> T1[20,400 Tokens Ingested]
        T1 --> C1[High Cost: $0.052 / video]
        C1 --> S1[Static, Unfocused Evaluation]
    end

    subgraph Agentic [Ashky Think-Act-Observe Loop]
        V2[30s Video] --> TAO[Gemini 3.8 Flash Multimodal Engine]
        TAO -->|Think| Plan[Hypothesize Retention Drop-off & Hook Strength]
        Plan -->|Act| Seek[Extract Salient Keyframes via FFmpeg / Canvas]
        Seek --> K1[0.8s Pattern Interrupt Image]
        Seek --> K2[2.2s Pacing Transition Image]
        Seek --> K3[8.5s Mechanism UI Image]
        Seek --> K4[24.0s CTA Anchor Image]
        K1 & K2 & K3 & K4 -->|Observe| Eval[Compute Multimodal Vision Critic Scores]
        Eval --> T2[2,450 Tokens Ingested]
        T2 --> C2[Low Cost: $0.012 / video]
        C2 --> S2[88% Token Reduction · 66% Cost Savings]
    end
```

### Quantitative Token & Cost Comparison:

| Metric | Uniform 1-FPS Frame Dumping | Ashky Agentic (Think-Act-Observe) | Improvement |
| :--- | :--- | :--- | :--- |
| **Frames Ingested** | 30 uniformly spaced frames | 4 selectively sought salient frames | **86.7% fewer frames** |
| **Token Consumption** | ~20,400 tokens | ~2,450 tokens | **88.0% token reduction** |
| **Inference Cost** | ~$0.052 USD | ~$0.018 USD | **65.4% cost reduction** |
| **Latency** | 6.8s | 1.8s | **3.8× faster critique** |
| **Actionability** | Generic video summary | Granular second-by-second hook diagnosis | Pinpoint retention cues |

---

## 6. Generative Engine Optimization (GEO) & Schema Grounding

Modern software discovery is shifting from traditional keyword search to LLM-grounded answers. Ashky measures and influences how AI answer engines cite products.

```mermaid
graph TD
    A[Brand Pitch & Competitors] --> B[GEO Benchmark Engine]
    
    subgraph ProbeArm [Commercial Intent Query Probe]
        B --> C[Google Gemini 3.8 Flash]
        B --> D[Perplexity Sonar]
        B --> E[SearchGPT Pro]
    end

    C & D & E --> F[Citation & Share of Voice Analyzer]
    F --> G[Share of Voice SOV %]
    F --> H[Citation Gap Detection]

    H --> I[Actionable Recommendation]
    I --> J[Refine Video Hook in Studio]
    I --> K[1-Click Schema.org Exporter]

    subgraph SchemaArm [AI Grounding Exporter]
        K --> L[VideoObject JSON-LD]
        K --> M[SoftwareApplication JSON-LD]
        L & M --> N[Product Landing Page]
        N -->|Feeds LLM Knowledge Graph| C & D & E
    end
```

---

## 7. Grafana Cloud Observability & MCP JSON-RPC 2.0 Dispatch

Ashky natively implements the **Model Context Protocol (MCP)** specification via the official hosted server at `https://mcp.grafana.com/mcp` and provides a local JSON-RPC 2.0 dispatch gateway.

```mermaid
flowchart TD
    subgraph AshkyApp [Ashky Application Core]
        API[FastAPI Router]
        Metrics[/metrics Prometheus Endpoint]
        RingBuffer[In-Memory Loki Log Buffer]
        MCPEndpoint[/mcp JSON-RPC 2.0 Endpoint]
    end

    subgraph GrafanaStack [Grafana Cloud Stack: $GRAFANA_STACK_URL]
        Mimir[Prometheus / Mimir TSDB]
        LokiDB[Loki Log Streams]
        Dashboard[Ashky Master Dashboard: ashky-telemetry-01]
        Alerts[Grafana Alertmanager]
    end

    subgraph MCPServer [Hosted MCP Server: mcp.grafana.com/mcp]
        Tool1[query_prometheus]
        Tool2[query_loki]
        Tool3[search_dashboards]
        Tool4[list_alerts]
        Tool5[grafana_diagnose_pipeline]
        Tool6[grafana_optimize_retention_loop]
    end

    subgraph Sidecar [Agent Sidecar / Copilot]
        CopilotUI[In-App SRE Diagnostic Drawer]
    end

    Metrics -->|Scraped every 15s| Mimir
    RingBuffer -->|Streamed traces| LokiDB
    MCPEndpoint -->|Streamable HTTP JSON-RPC| MCPServer
    MCPServer --> Tool1 & Tool2 & Tool3 & Tool4 & Tool5 & Tool6
    Tool1 --> Mimir
    Tool2 --> LokiDB
    Tool3 & Tool4 --> Alerts
    
    CopilotUI -->|Queries MCP| MCPEndpoint
```

### Supported Prometheus Metrics:
- `ashky_campaigns_total`: Total campaigns created (by category and style).
- `ashky_scene_render_duration_seconds`: Video rendering and FFmpeg assembly latency histogram.
- `ashky_hook_strength_score`: Distribution of 3-second hook retention scores.
- `ashky_llm_share_of_voice_pct`: Real-time GEO Share of Voice percentage.
- `ashky_gemini_tokens_total`: Token counter tracked across blueprint generation and agentic video inspection.
- `ashky_token_spend_usd`: Monetary expenditure across Gemini and Veo APIs.

---

## 8. Data Models & State Lifecycle

```mermaid
erDiagram
    CAMPAIGN ||--|{ SCENE : contains
    CAMPAIGN ||--|{ VISION_QA : evaluated_by
    CAMPAIGN ||--o| RENDER_STATUS : tracks
    CAMPAIGN ||--o| GEO_BENCHMARK : analyzed_by

    CAMPAIGN {
        string campaign_id PK
        string product_name
        string studio
        string category
        string aspect_ratio
        float total_duration_seconds
        float estimated_token_cost
        string created_at
    }

    SCENE {
        int scene_number PK
        string title
        float duration_seconds
        string camera_cues
        string visual_prompt
        string voiceover_script
        string text_overlay
        string audio_path
        string video_path
    }

    VISION_QA {
        int scene_number PK
        int hook_strength
        int brand_clarity
        int text_readability
        float predicted_3s_dropoff
        string critique_summary
        string verdict
    }

    RENDER_STATUS {
        string campaign_id PK
        string status
        int progress_pct
        string current_step
        string video_url
        float duration_seconds
    }

    GEO_BENCHMARK {
        string product_name PK
        float share_of_voice_pct
        string top_engine
        json citations
        json schema_jsonld
    }
```

---

## 9. Deployment Topology & Security Architecture

Ashky is built for single-port unified deployment and enterprise cloud hosting:

```mermaid
graph TD
    subgraph Internet [Public Web / Cloudflare CDN]
        User[User Browser]
        Scraper[Prometheus Scraper]
    end

    subgraph ProductionHost [Production Docker / VM Host]
        subgraph Ports [Port 8000 Public Binding]
            ReverseProxy[FastAPI Uvicorn Web Server]
        end
        
        subgraph StaticBundle [Frontend SPA]
            ViteDist[Pre-built React 19 Bundle /dist]
        end

        subgraph BackendCore [FastAPI Application Core]
            APIRoutes[/api/* Routes]
            MetricsRoute[/metrics]
            MCPRoute[/mcp]
            MediaMount[/media Mounted Storage]
        end

        subgraph FileSystem [Persistent Storage]
            AudioFiles[media/audio/*.mp3]
            VideoFiles[media/videos/*.mp4]
            ImageFiles[media/images/*.jpg]
        end
    end

    User -->|HTTPS: Port 8000| ReverseProxy
    Scraper -->|GET /metrics| ReverseProxy
    
    ReverseProxy -->|Serve UI| ViteDist
    ReverseProxy -->|API Requests| APIRoutes
    ReverseProxy -->|Metrics Scrapes| MetricsRoute
    ReverseProxy -->|MCP JSON-RPC| MCPRoute
    ReverseProxy -->|Media Streaming| MediaMount
    
    MediaMount --> AudioFiles & VideoFiles & ImageFiles
```

### Security Considerations:
- **API Key Sanitization**: Environment variables (`GEMINI_API_KEY`, `GRAFANA_SERVICE_TOKEN`) are securely loaded through `pydantic-settings` and never exposed in client bundles or public endpoints.
- **CORS Allowlist**: Configurable origin verification (`localhost:5173`, custom domains) preventing cross-origin invocation.
- **Input Validation**: Strict schema enforcement via Pydantic v2 rejecting malformed prompts, invalid aspect ratios, and injection payloads.
- **Non-Blocking Telemetry**: In-memory ring buffer logging ensures logging failures never block video rendering pipelines.
