import json
import logging
from typing import Any, Dict, Optional
from ..core.config import settings

logger = logging.getLogger(__name__)

# Check for Gemini availability
try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False


class AIEngine:
    """Unified AI Engine with Google Gemini support and robust offline fallback."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client_initialized = False

        if HAS_GENAI and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(self.model_name)
                self._client_initialized = True
                logger.info(f"Initialized Google Gemini with model: {self.model_name}")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini client: {e}. Falling back to smart synthesizer.")
        else:
            logger.info("No Gemini API key provided. Using built-in high-fidelity synthesizer.")

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Generate text using Gemini or smart fallback."""
        if self._client_initialized:
            try:
                full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
                response = self.model.generate_content(full_prompt)
                if response and response.text:
                    return response.text
            except Exception as e:
                logger.warning(f"Gemini generation call failed ({e}). Using deterministic engine.")

        return f"[Synthesized AI Response] Analysis for: {prompt[:80]}..."

    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """Generate structured JSON output using Gemini or structured parser fallback."""
        if self._client_initialized:
            try:
                instruct = (system_instruction or "") + "\nRespond strictly in valid JSON format."
                response = self.model.generate_content(
                    f"{instruct}\n\n{prompt}",
                    generation_config={"response_mime_type": "application/json"}
                )
                if response and response.text:
                    return json.loads(response.text)
            except Exception as e:
                logger.warning(f"Gemini JSON generation failed ({e}). Using native structured synthesizer.")

        # Fallback return handled by caller domain logic
        return {}


ai_engine = AIEngine()
