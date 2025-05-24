import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from pathlib import Path

class Settings(BaseSettings):
    # API settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Emberly API"
    
    # MongoDB settings (for chat data)
    MONGODB_URI: str = os.getenv(
        "MONGODB_URI", 
        "mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority"
    )
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "emberly")
    
    # PostgreSQL settings (for structured data)
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "nakuljn")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "emberly")
    POSTGRES_URI: str = os.getenv(
        "POSTGRES_URI",
        f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
    )
    
    # JWT settings
    JWT_SECRET_KEY: str = "development_secret_key"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Firebase settings
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_ADMIN_CREDENTIALS_PATH: str = "./app/core/firebase-credentials.json"
    
    # AWS S3 settings
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_S3_BUCKET: Optional[str] = os.getenv("AWS_S3_BUCKET")
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    
    # App settings
    DAILY_SWIPE_LIMIT: int = int(os.getenv("DAILY_SWIPE_LIMIT", "8"))
    MAX_PROFILE_PHOTOS: int = int(os.getenv("MAX_PROFILE_PHOTOS", "6"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

# Create global settings object
settings = Settings() 