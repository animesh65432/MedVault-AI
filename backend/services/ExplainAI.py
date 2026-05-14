from groq import Groq
from config import config


ExplainGroq = Groq(api_key=config["EXPLAIN_MEDICAL_API_KEY"])

