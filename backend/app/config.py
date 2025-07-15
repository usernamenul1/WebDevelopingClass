from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # SQLite 数据库配置 - 存储在项目根目录
    database_url: str = "sqlite:///./sports_platform.db"
    secret_key: str = "sports-platform-secret-key-please-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
