import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra="allow")

    APP_NAME: str = "Ashky"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Google Gemini API
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-2.0-flash"
    GEMINI_VISION_MODEL: str = "gemini-2.0-flash"

    # Grafana Cloud Settings
    GRAFANA_CLOUD_URL: Optional[str] = os.getenv("GRAFANA_CLOUD_URL", "")
    GRAFANA_LOKI_URL: Optional[str] = os.getenv("GRAFANA_LOKI_URL", "")
    GRAFANA_CLOUD_USER: Optional[str] = os.getenv("GRAFANA_CLOUD_USER", "")
    GRAFANA_API_KEY: Optional[str] = os.getenv("GRAFANA_API_KEY", "")

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]

settings = Settings()
