
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    PORT: int = int(os.getenv("PORT", 8000))
    ENV: str = os.getenv("ENV", "production")

settings = Settings()
