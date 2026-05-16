import os
from dotenv import load_dotenv

load_dotenv()

config = {
    "DATABASE_URL" : os.getenv("DATABASE_URL"),
    "GOOGLE_CLIENT_ID" : os.getenv("GOOGLE_CLIENT_ID"),
    "SECRET_KEY" : os.getenv("SECRET_KEY"),
    "ALGORITHM" : os.getenv("ALGORITHM"),
    "GEMINI_API_KEY" : os.getenv("GEMINI_API_KEY"),
    "OPENAI_API_KEY" : os.getenv("OPENAI_API_KEY"),
    "CLOUDFLARE_ACCOUNT_ID" : os.getenv("CLOUDFLARE_ACCOUNT_ID"),
    "R2_BUCKET_NAME" : os.getenv("R2_BUCKET_NAME"),
    "R2_ACCESS_KEY" : os.getenv("R2_ACCESS_KEY"),
    "R2_SECRET_KEY" : os.getenv("R2_SECRET_KEY"),
    "R2_PUBLIC_URL" : os.getenv("R2_PUBLIC_URL"),
    "GROQ_API_KEY": os.getenv("GROQ_API_KEY"),
    "CHECK_MEDICAL_RECORD_API_KEY": os.getenv("CHECK_MEDICAL_RECORD_API_KEY"),
    "EXPLAIN_MEDICAL_API_KEY": os.getenv("EXPLAIN_MEDICAL_API_KEY"),
    "JINA_API_KEY": os.getenv("JINA_API_KEY"),
    "CHAT_MEDICAL_API_KEY": os.getenv("CHAT_MEDICAL_API_KEY")
}
