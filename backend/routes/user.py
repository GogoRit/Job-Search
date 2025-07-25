from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
import logging
from typing import Dict, Any

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/user/profile")
async def save_user_profile(
    profile_data: Dict[str, Any],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Save user profile data (stub for Firebase integration)"""
    try:
        # For now, just log the profile data - we'll implement proper storage with Firebase later
        logger.info(f"Profile data received: {profile_data.get('name', 'Unknown User')}")
        
        # TODO: Integrate with Firebase Authentication
        # TODO: Store profile data in MongoDB with user ID
        # TODO: Hash and store password securely (if using email/password auth)
        
        return {
            "success": True,
            "message": "Profile saved successfully",
            "user_id": "temp_user_123",  # Placeholder until Firebase integration
            "next_step": "/onboard/linkedin"
        }
        
    except Exception as e:
        logger.error(f"Failed to save profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to save profile")

@router.get("/user/profile")
async def get_user_profile(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get user profile data (stub for Firebase integration)"""
    try:
        # TODO: Get user ID from authentication
        # TODO: Fetch profile from MongoDB
        
        return {
            "success": False,
            "message": "Profile not found",
            "data": None
        }
        
    except Exception as e:
        logger.error(f"Failed to get profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to get profile")
