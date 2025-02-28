from typing import List
from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "MCP Chat API"
    VERSION: str = "0.1.0"
    DESCRIPTION: str = "Multi-model Chat API with LangChain integration"
    
    # API Keys
    OPENAI_API_KEY: str
    GOOGLE_API_KEY: str
    DEEPSEEK_API_KEY: str
    NVIDIA_API_KEY: str
    TAVILY_API_KEY: str
    LANGCHAIN_HUB_API_KEY: str
    
    # LangChain
    LANGCHAIN_API_KEY: str
    LANGCHAIN_ENDPOINT: str
    LANGCHAIN_PROJECT: str
    LANGCHAIN_TRACING_V2: bool = True
    
    # Database
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"
    DB_NAME: str = "mcp_chat"
    
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SQLALCHEMY_DATABASE_URI: PostgresDsn | None = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str | None, values: dict) -> str:
        if isinstance(v, str):
            return v
        return str(PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=values.get("POSTGRES_DB"),
        ))

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 