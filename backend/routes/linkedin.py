from fastapi import APIRouter, HTTPException, Depends
from models import LinkedInSettings, LinkedInResponse
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
from bson import ObjectId
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/linkedin-settings", response_model=LinkedInResponse)
async def save_linkedin_settings(
    settings: LinkedInSettings,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Save LinkedIn integration settings"""
    try:
        user_id = ObjectId()  # For demo - in production, get from auth
        
        # Update user's LinkedIn settings
        await db.users.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "linkedin_enabled": settings.linkedin_enabled,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        logger.info(f"LinkedIn settings updated for user {user_id}: enabled={settings.linkedin_enabled}")
        
        return LinkedInResponse(
            success=True,
            message="LinkedIn settings saved successfully"
        )
        
    except Exception as e:
        logger.error(f"Failed to save LinkedIn settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to save LinkedIn settings")

@router.get("/linkedin-status")
async def get_linkedin_status(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get LinkedIn integration status"""
    try:
        # For demo - check if any user has LinkedIn enabled
        user_count = await db.users.count_documents({"linkedin_enabled": True})
        
        return {
            "linkedin_enabled": user_count > 0,
            "message": "LinkedIn status retrieved"
        }
        
    except Exception as e:
        logger.error(f"Failed to get LinkedIn status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get LinkedIn status")
