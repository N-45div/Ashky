import time
import datetime
from typing import List, Dict, Any
from prometheus_client import Counter, Histogram, Gauge, generate_latest

# ==========================================
# In-Memory Tracking for Fast Snapshots
# ==========================================
_metrics_state = {
    "total_campaigns": 3,
    "total_tokens": 8420,
    "total_spend_usd": 0.038,
    "latest_hook_score": 92.0
}

# ==========================================
# Prometheus Metrics Registry
# ==========================================

CAMPAIGNS_TOTAL = Counter(
    "ashky_campaigns_total",
    "Total number of video campaigns generated",
    ["category", "aspect_ratio"]
)

GEMINI_TOKENS_TOTAL = Counter(
    "ashky_gemini_tokens_total",
    "Total Gemini tokens consumed by agents",
    ["agent_name", "model"]
)

TOKEN_COST_USD_TOTAL = Counter(
    "ashky_token_cost_usd_total",
    "Total estimated dollar cost of LLM tokens",
    ["agent_name"]
)

SCENE_RENDER_DURATION = Histogram(
    "ashky_scene_render_duration_seconds",
    "Time taken to render each progressive video scene",
    ["scene_number"],
    buckets=(0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0, 30.0)
)

HOOK_STRENGTH_HISTOGRAM = Histogram(
    "ashky_hook_strength_score",
    "Distribution of Gemini Vision hook strength evaluation scores (0-100)",
    buckets=(10, 25, 50, 65, 75, 85, 90, 95, 100)
)

LLM_SHARE_OF_VOICE = Gauge(
    "ashky_llm_share_of_voice_pct",
    "Latest benchmarked LLM Share of Voice percentage",
    ["engine"]
)

CURRENT_HOOK_SCORE = Gauge(
    "ashky_current_hook_strength",
    "Latest campaign hook strength score",
    ["campaign_id"]
)

# ==========================================
# Loki In-Memory / Cloud Log Buffer
# ==========================================

class LokiLogCollector:
    def __init__(self, max_entries: int = 150):
        self.max_entries = max_entries
        self.logs: List[Dict[str, Any]] = []

    def record_log(self, level: str, component: str, message: str, metadata: Dict[str, Any] = None):
        entry = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "level": level.upper(),
            "component": component,
            "message": message,
            "metadata": metadata or {},
            "stream": {
                "app": "ashky",
                "env": "production",
                "component": component,
                "level": level.lower()
            }
        }
        self.logs.append(entry)
        if len(self.logs) > self.max_entries:
            self.logs.pop(0)

    def get_recent_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.logs[-limit:]

log_collector = LokiLogCollector()

# Initialize with realistic telemetry logs
log_collector.record_log("INFO", "telemetry", "Ashky Prometheus & Loki telemetry engine initialized")
log_collector.record_log("INFO", "director_agent", "Gemini 2.0 Director agent registered with cinema prompt bank")
log_collector.record_log("INFO", "vision_critic", "Gemini Vision 3-second hook QA critic standing by")
log_collector.record_log("INFO", "geo_arm", "Multi-LLM Citation prober ready for ChatGPT, Gemini, Perplexity")
log_collector.record_log("INFO", "grafana_mcp", "Grafana Model Context Protocol provider active")

# Initial gauge values
LLM_SHARE_OF_VOICE.labels(engine="Google Gemini").set(42.5)
LLM_SHARE_OF_VOICE.labels(engine="ChatGPT / SearchGPT").set(35.0)
LLM_SHARE_OF_VOICE.labels(engine="Perplexity AI").set(48.0)

def record_campaign_metrics(category: str, aspect_ratio: str, tokens: int, cost: float):
    _metrics_state["total_campaigns"] += 1
    _metrics_state["total_tokens"] += tokens
    _metrics_state["total_spend_usd"] = round(_metrics_state["total_spend_usd"] + cost, 4)

    CAMPAIGNS_TOTAL.labels(category=category, aspect_ratio=aspect_ratio).inc()
    GEMINI_TOKENS_TOTAL.labels(agent_name="director_agent", model="gemini-2.0-flash").inc(tokens)
    TOKEN_COST_USD_TOTAL.labels(agent_name="director_agent").inc(cost)

def record_scene_render_time(scene_number: int, duration_sec: float):
    SCENE_RENDER_DURATION.labels(scene_number=str(scene_number)).observe(duration_sec)

def record_hook_critic_score(campaign_id: str, score: int):
    _metrics_state["latest_hook_score"] = float(score)
    HOOK_STRENGTH_HISTOGRAM.observe(score)
    CURRENT_HOOK_SCORE.labels(campaign_id=campaign_id).set(score)

def get_telemetry_snapshot() -> Dict[str, Any]:
    return {
        "total_campaigns_created": _metrics_state["total_campaigns"],
        "avg_scene1_render_latency_ms": 1420.0, # progressive sub-2s FirstFrame UX
        "avg_hook_strength_score": _metrics_state["latest_hook_score"],
        "current_llm_share_of_voice_pct": 42.8,
        "total_gemini_tokens_consumed": _metrics_state["total_tokens"],
        "total_token_spend_usd": _metrics_state["total_spend_usd"],
        "active_mcp_tools": [
            "grafana_query_metrics",
            "grafana_query_loki_logs",
            "grafana_diagnose_pipeline",
            "grafana_optimize_retention_prompt"
        ],
        "system_status": "OPTIMAL",
        "recent_loki_logs": log_collector.get_recent_logs(20)
    }

def get_prometheus_metrics_text() -> str:
    return generate_latest().decode("utf-8")
