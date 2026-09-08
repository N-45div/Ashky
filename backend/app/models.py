from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ==========================================
# Video Studio & Marketing Director Models
# ==========================================

class CampaignRequest(BaseModel):
    product_name: str = Field(..., json_schema_extra={"example": "LaunchFlow"})
    product_pitch: str = Field(..., json_schema_extra={"example": "Autonomous customer onboarding & screen recording agent for SaaS founders."})
    product_url: Optional[str] = Field(None, json_schema_extra={"example": "https://launchflow.io"})
    target_audience: Optional[str] = Field("Solo founders, indie hackers, and SaaS growth engineers", json_schema_extra={"example": "Solo founders"})
    category: str = Field("B2B SaaS", json_schema_extra={"example": "B2B SaaS"})
    aspect_ratio: str = Field("9:16", json_schema_extra={"example": "9:16"})
    style: str = Field("Kinetic High-Tech", json_schema_extra={"example": "Kinetic High-Tech"})

class SceneBlueprint(BaseModel):
    scene_number: int
    title: str
    duration_seconds: float
    timeframe: str
    hook_type: Optional[str] = None
    camera_cues: str
    kinetic_motion: str
    text_overlay: str
    voiceover_script: str
    visual_prompt: str
    media_url: Optional[str] = None
    status: str = "queued" # queued, rendering, ready, failed

class VisionCriticScore(BaseModel):
    scene_number: int
    hook_strength: int = Field(..., ge=0, le=100)
    brand_clarity: int = Field(..., ge=0, le=100)
    text_readability: int = Field(..., ge=0, le=100)
    predicted_3s_dropoff: float = Field(..., ge=0.0, le=100.0)
    critique_summary: str
    actionable_improvements: List[str]
    verdict: str

class CampaignBlueprint(BaseModel):
    campaign_id: str
    product_name: str
    aspect_ratio: str
    total_duration_seconds: float = 30.0
    estimated_token_cost: float = 0.038
    scenes: List[SceneBlueprint]
    vision_qa: Optional[List[VisionCriticScore]] = None
    created_at: str

class RenderRequest(BaseModel):
    voice: Optional[str] = None
    aspect_ratio: Optional[str] = "9:16"
    include_subtitles: bool = True
    engine: Optional[str] = "veo"  # "veo" for Google Veo 3.1 or "turbo" for instant kinetic compositor

class QuickSynthesizeRequest(BaseModel):
    product_name: str = Field(..., json_schema_extra={"example": "Neo-Racing Tokyo"})
    studio: Optional[str] = Field("Ashky", json_schema_extra={"example": "Ashky"})
    product_pitch: Optional[str] = Field(None, json_schema_extra={"example": "Autonomous AI cinema & marketing reel engine"})
    target_audience: Optional[str] = Field("Gen Z/Alpha", json_schema_extra={"example": "Gen Z/Alpha"})
    category: Optional[str] = Field("Gaming & Entertainment", json_schema_extra={"example": "Gaming & Entertainment"})
    style: Optional[str] = Field("Cinematic Neon-Noir", json_schema_extra={"example": "Cinematic Neon-Noir"})
    aspect_ratio: Optional[str] = Field("9:16", json_schema_extra={"example": "9:16"})
    engine: Optional[str] = Field("veo", json_schema_extra={"example": "veo"})  # "veo" or "turbo"
    voice: Optional[str] = None

class RenderStatus(BaseModel):
    campaign_id: str
    status: str = "queued"  # queued, synthesizing_audio, rendering_scenes, assembling_video, completed, failed
    progress_pct: int = 0
    current_step: str = "Queued for rendering..."
    video_url: Optional[str] = None
    download_url: Optional[str] = None
    file_size_bytes: Optional[int] = None
    duration_seconds: Optional[float] = None
    error: Optional[str] = None

# ==========================================
# Generative Engine Optimization (GEO) Models
# ==========================================

class GeoProbeRequest(BaseModel):
    product_name: str
    category: str
    competitors: List[str] = []
    sample_queries: Optional[List[str]] = None

class GeoQueryCitation(BaseModel):
    query: str
    engine: str
    product_mentioned: bool
    citation_position: Optional[int] = None
    share_of_voice_pct: float
    competitors_cited: List[str] = []
    generated_snippet: str
    gap_analysis: str

class GeoProbeResult(BaseModel):
    campaign_id: Optional[str] = None
    product_name: str
    overall_share_of_voice_pct: float
    top_ranking_engine: str
    queries_tested: int
    citations: List[GeoQueryCitation]
    recommended_keywords: List[str]
    citation_gap_insights: List[str]

class GeoSchemaOutput(BaseModel):
    product_name: str
    video_object_schema: Dict[str, Any]
    software_app_schema: Dict[str, Any]
    semantic_transcript: str
    citation_magnet_press_pitch: str

# ==========================================
# Grafana Observability & MCP Agent Models
# ==========================================

class TelemetrySnapshot(BaseModel):
    total_campaigns_created: int
    avg_scene1_render_latency_ms: float
    avg_hook_strength_score: float
    current_llm_share_of_voice_pct: float
    total_gemini_tokens_consumed: int
    total_token_spend_usd: float
    active_mcp_tools: List[str]
    system_status: str = "HEALTHY"
    recent_loki_logs: List[Dict[str, Any]] = []
    mcp_server_endpoint: Optional[str] = "https://mcp.grafana.com/mcp"
    grafana_stack_url: Optional[str] = None
    mcp_connection_status: Optional[str] = "CONNECTED"

class MCPAgentQuery(BaseModel):
    user_query: str
    context_campaign_id: Optional[str] = None

class MCPAgentResponse(BaseModel):
    answer: str
    mcp_tools_called: List[str]
    telemetry_data_used: Dict[str, Any]
    suggested_actions: List[str]
    structured_diagnostic: Optional[Dict[str, Any]] = None
    mcp_server_endpoint: Optional[str] = "https://mcp.grafana.com/mcp"
    grafana_stack_url: Optional[str] = None

# ==========================================
# Gemini Agentic Video Understanding Models
# ==========================================

class GeminiAgenticInspectionRequest(BaseModel):
    campaign_id: str
    target_focus: str = Field(default="0-3s_hook", description="'0-3s_hook', 'brand_clarity', 'narrative_arc', 'all'")
    video_url: Optional[str] = None

class GeminiKeyframeInspection(BaseModel):
    timestamp_seconds: float
    inspection_type: str # 'hook_interrupt', 'ui_transition', 'cta_anchor'
    visual_retention_score: int # 0-100
    detected_elements: List[str]
    critic_notes: str

class GeminiAgenticVideoAnalysis(BaseModel):
    campaign_id: str
    gemini_model: str = "gemini-3.8-flash (Agentic Multimodal)"
    token_reduction_pct: float = 88.0
    cost_savings_pct: float = 66.0
    tokens_consumed: int = 2450
    static_ingestion_baseline_tokens: int = 20400
    active_inspections: List[GeminiKeyframeInspection]
    overall_hook_retention_score: int = 92
    predicted_3s_dropoff_pct: float = 14.2
    recommended_modifications: List[str]


# ==========================================
# Agentic Self-Improving Video Harness Models
# ==========================================

class HarnessMutation(BaseModel):
    target_scene: int
    mutation_type: str  # 'PROMPT_EVOLUTION', 'CAMERA_KINETIC_BOOST', 'SAFE_ZONE_ADJUSTMENT', 'VOICEOVER_PACING'
    original_value: str
    mutated_value: str
    critic_rationale: str

class HarnessEvolutionRecord(BaseModel):
    iteration: int
    timestamp: str
    hook_score_before: int
    hook_score_after: int
    dropoff_pct_before: float
    dropoff_pct_after: float
    mutations_applied: List[HarnessMutation]
    critic_summary: str
    evolved_blueprint: Optional[CampaignBlueprint] = None

class EvolutionRequest(BaseModel):
    campaign_id: str
    engine: Optional[str] = "veo"
    target_focus: Optional[str] = "0-3s_hook"

class AutoImproveLoopRequest(BaseModel):
    campaign_id: str
    target_min_score: int = 80
    max_iterations: int = 3
    engine: Optional[str] = "veo"


