import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    NODE_ENV: str = os.getenv("NODE_ENV", "development")
    API_URL: str = os.getenv("API_URL", "http://localhost:3000")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "minioadmin")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "minioadmin")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_S3_ENDPOINT: str = os.getenv("AWS_S3_ENDPOINT", "http://lensai-minio:9000")
    AWS_S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "lensai-uploads")

settings = Settings()
