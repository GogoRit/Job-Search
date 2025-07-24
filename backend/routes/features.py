from fastapi import APIRouter, HTTPException, Depends
from models import FeaturesResponse
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/features", response_model=FeaturesResponse)
async def get_features(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get available features and their status"""
    try:
        # Check feature availability
        has_openai_key = bool(os.getenv("OPENAI_API_KEY"))
        has_email_config = bool(os.getenv("SMTP_HOST") or os.getenv("GMAIL_CLIENT_ID"))
        
        # Check if any user has LinkedIn enabled
        linkedin_users = await db.users.count_documents({"linkedin_enabled": True})
        has_linkedin = linkedin_users > 0
        
        # Database is available if we can connect
        database_available = True
        try:
            await db.command("ping")
        except:
            database_available = False
        
        return FeaturesResponse(
            ai=has_openai_key,
            email=has_email_config,
            linkedin=has_linkedin,
            database=database_available,
            version="1.0.0",
            environment=os.getenv("ENVIRONMENT", "development")
        )
        
    except Exception as e:
        logger.error(f"Failed to get features: {e}")
        raise HTTPException(status_code=500, detail="Failed to get features")
