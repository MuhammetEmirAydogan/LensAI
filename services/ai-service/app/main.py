from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import structlog

from app.config import settings
from app.routers import generate, styles, health

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup ve shutdown işlemleri"""
    logger.info("AI Service starting up", env=settings.NODE_ENV)
    yield
    logger.info("AI Service shutting down")


app = FastAPI(
    title="LensAI — AI Service",
    description="Video generation, image masking, and prompt engineering API",
    version="0.1.0",
    docs_url="/docs" if settings.NODE_ENV != "production" else None,
    redoc_url="/redoc" if settings.NODE_ENV != "production" else None,
    lifespan=lifespan,
)

# ─────────────────────────────────────
# MIDDLEWARE
# ─────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.API_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ─────────────────────────────────────
# ROUTERS
# ─────────────────────────────────────
app.include_router(health.router, tags=["health"])
app.include_router(generate.router, prefix="/ai/v1", tags=["generate"])
app.include_router(styles.router, prefix="/ai/v1", tags=["styles"])
