from groq import Groq
from config import config

Groqclient = Groq(
    api_key=config["GROQ_API_KEY"]
)