from groq import Groq
from config import config

Groqclient = Groq(
    api_key=config["CHECK_MEDICAL_RECORD_API_KEY"]
)