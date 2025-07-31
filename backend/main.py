from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import uvicorn
from typing import Optional
import logging
# Rate limiting temporarily disabled for troubleshooting
# from slowapi.errors import RateLimitExceeded

from models import *
from routes import api_key, resume, jobs, linkedin, features, user, auth
from database import database, get_database, connect, disconnect
from encryption import EncryptionManager
# from rate_limiter import limiter, rate_limit_exceeded_handler

load_dotenv()

# Configure logging
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up FastAPI application...")
    await connect()
    logger.info("Connected to MongoDB")
    yield
    # Shutdown
    logger.info("Shutting down FastAPI application...")
    await disconnect()
    logger.info("Disconnected from MongoDB")

# Create FastAPI app
app = FastAPI(
    title="Job Search Assistant API",
    description="AI-powered job search management platform",
    version="1.0.0",
    lifespan=lifespan
)

# Rate limiting temporarily disabled for troubleshooting
# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(api_key.router, prefix="/api", tags=["API Keys"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(user.router, prefix="/api", tags=["User"])
app.include_router(jobs.router, prefix="/api", tags=["Jobs"])
app.include_router(linkedin.router, prefix="/api", tags=["LinkedIn"])
app.include_router(features.router, prefix="/api", tags=["Features"])

@app.get("/")
async def root():
    return {"message": "Job Search Assistant API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    try:
        # Check database connection
        db = await get_database()
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
