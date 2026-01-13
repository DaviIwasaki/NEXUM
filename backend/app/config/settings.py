# app/config/settings.py
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "uma77SecretTheKeyMy3System!.!")  # Mude isso!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 horas (ajuste depois)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()