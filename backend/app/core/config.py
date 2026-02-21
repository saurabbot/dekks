from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    
    DATABASE_URL: str = "postgresql://user:password@db:5432/shipment_db"
    REDIS_URL: str = "redis://redis:6379/0"
    JWT_SECRET: str = "papzzp6H93zsKzzZh0ujlgGqrrkLRPYvmJuaeUYcFOX"
    DATALASTIC_API_KEY: Optional[str] = None
    JSONCARGO_API_KEY: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None
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

# Debug info for Railway
print("\n" + "="*50)
print("🚀 DEKKS BACKEND STARTING UP")
print("="*50)

import os
# Check for "ghost" environment variables
for key in ['REDIS_URL', 'DATABASE_URL', 'REDIS_PUBLIC_URL', 'DATABASE_PUBLIC_URL']:
    val = os.environ.get(key)
    if val:
        is_proxy = "proxy.rlwy.net" in val
        status = "⚠️ PROXY (BAD FOR PROD)" if is_proxy else "✅ INTERNAL (GOOD)"
        masked = val.split('@')[-1] if '@' in val else '***'
        print(f"ENV {key}: ...{masked} [{status}]")

print("-" * 50)
settings = Settings()

# Validation Fail-Safe
if "proxy.rlwy.net" in (settings.REDIS_URL or ""):
    print("\n❌ FATAL ERROR: Backend is trying to use a REDIS PROXY URL.")
    print("Please go to Railway Backend Variables and change REDIS_URL to ${{Redis.REDIS_URL}}")
    # We won't exit here yet so you can at least see the logs, but it will fail later
    
if "proxy.rlwy.net" in (settings.DATABASE_URL or ""):
    print("\n❌ FATAL ERROR: Backend is trying to use a DATABASE PROXY URL.")
    print("Please go to Railway Backend Variables and change DATABASE_URL to ${{Postgres.DATABASE_URL}}")

print("="*50 + "\n")
