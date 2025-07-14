from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # 修改默认数据库路径，指向持久化的数据目录
    database_url: str = "sqlite:///./data/sports_platform.db"
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
