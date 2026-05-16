from groq import Groq
from config import config

Chatgroq = Groq(api_key=config["CHAT_MEDICAL_API_KEY"])