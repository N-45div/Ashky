import os
from typing import Optional
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

load_dotenv()

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra="allow")


    APP_NAME: str = "Ashky"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Google Gemini API (Agentic Video Understanding)
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.7-flash")
    GEMINI_VISION_MODEL: str = os.getenv("GEMINI_VISION_MODEL", "gemini-3.7-flash")
    GEMINI_IMAGE_MODEL: str = os.getenv("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-image")


    # Grafana Cloud Settings
    GRAFANA_CLOUD_URL: Optional[str] = os.getenv("GRAFANA_CLOUD_URL", "")
    GRAFANA_LOKI_URL: Optional[str] = os.getenv("GRAFANA_LOKI_URL", "")
    GRAFANA_CLOUD_USER: Optional[str] = os.getenv("GRAFANA_CLOUD_USER", "")
    GRAFANA_API_KEY: Optional[str] = os.getenv("GRAFANA_API_KEY", "")

    # Edge TTS Settings
    EDGE_TTS_VOICE: str = os.getenv("EDGE_TTS_VOICE", os.getenv("TTS_VOICE", "en-US-GuyNeural"))

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]

settings = Settings()
