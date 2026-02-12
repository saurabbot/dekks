from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    
    DATABASE_URL: str = "postgresql://user:password@db:5432/shipment_db"
    REDIS_URL: str = "redis://redis:6379/0"
    JWT_SECRET: str = "papzzp6H93zsKzzZh0ujlgGqrrkLRPYvmJuaeUYcFOX"
    DATALASTIC_API_KEY: Optional[str] = None
    JSONCARGO_API_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30 # 30 days
    VERIFICATION_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    FRONTEND_URL: str = "http://localhost:3000"

    # Email Settings
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: int = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = "Shipment Tracker"

settings = Settings()
