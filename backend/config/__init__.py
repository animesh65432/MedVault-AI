import os
from dotenv import load_dotenv

load_dotenv()

config = {
    "DATABASE_URL": os.getenv("DATABASE_URL"),
    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
    "SECRET_KEY": os.getenv("SECRET_KEY"),
    "ALGORITHM": os.getenv("ALGORITHM"),
}