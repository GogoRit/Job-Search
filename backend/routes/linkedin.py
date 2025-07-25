from fastapi import APIRouter, HTTPException, Depends, Request, Query
from models import LinkedInSettings, LinkedInResponse
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
from bson import ObjectId
from datetime import datetime
import os
import urllib.parse
from linkedin_oauth import linkedin_oauth
# Rate limiting temporarily disabled for troubleshooting
# from rate_limiter import limiter, LINKEDIN_RATE_LIMIT, API_RATE_LIMIT

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
        # Check if any user has LinkedIn connected
        user = await db.users.find_one({"linkedin_connected": True})
        
        if user:
            return {
                "connected": True,
                "linkedin_enabled": user.get("linkedin_enabled", False),
                "user_data": {
                    "name": user.get("linkedin_name"),
                    "email": user.get("linkedin_email"),
                    "profile_picture": user.get("linkedin_profile_picture")
                },
                "message": "LinkedIn status retrieved"
            }
        else:
            return {
                "connected": False,
                "linkedin_enabled": False,
                "message": "No LinkedIn connection found"
            }
        
    except Exception as e:
        logger.error(f"Failed to get LinkedIn status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get LinkedIn status")

@router.get("/linkedin-auth-url")
# Rate limiting temporarily disabled for troubleshooting
# @limiter.limit(LINKEDIN_RATE_LIMIT)
async def get_linkedin_auth_url(request: Request):
    """Generate LinkedIn OAuth authorization URL"""
    try:
        result = linkedin_oauth.generate_auth_url()
        
        if not result["success"]:
            raise HTTPException(
                status_code=503, 
                detail=result.get("error", "LinkedIn OAuth not configured")
            )
        
        return {
            "success": True,
            "auth_url": result["auth_url"],
            "state": result["state"],
            "redirect_uri": result["redirect_uri"],
            "message": "LinkedIn OAuth URL generated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate LinkedIn auth URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate LinkedIn auth URL")

@router.post("/linkedin-callback")
# Rate limiting temporarily disabled for troubleshooting
# @limiter.limit(LINKEDIN_RATE_LIMIT)
async def linkedin_callback(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handle LinkedIn OAuth callback"""
    try:
        # Get authorization code from callback
        body = await request.json()
        code = body.get("code")
        state = body.get("state")
        
        if not code:
            raise HTTPException(status_code=400, detail="Authorization code not provided")
        
        # Process OAuth callback using OAuth handler
        result = await linkedin_oauth.handle_oauth_callback(code, state)
        
        if not result["success"]:
            raise HTTPException(
                status_code=400,
                detail=result.get("error", "OAuth callback failed")
            )
        
        # Store user connection in database
        user_data = result["user_data"]
        access_token = result["access_token"]
        
        # For demo - create or update user record
        user_doc = {
            "linkedin_connected": True,
            "linkedin_enabled": True,
            "linkedin_token_encrypted": access_token,
            "linkedin_user_id": user_data.get("id"),
            "linkedin_name": f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip(),
            "linkedin_email": user_data.get("email"),
            "linkedin_profile_picture": user_data.get("profile_picture"),
            "updated_at": datetime.utcnow()
        }
        
        # Upsert user document
        await db.users.update_one(
            {"linkedin_user_id": user_data.get("id")},
            {"$set": user_doc},
            upsert=True
        )
        
        logger.info(f"LinkedIn connected for user {user_data.get('id')}")
        
        return {
            "success": True,
            "connected": True,
            "message": "LinkedIn account connected successfully",
            "user_data": {
                "name": user_doc["linkedin_name"],
                "email": user_doc["linkedin_email"],
                "profile_picture": user_doc["linkedin_profile_picture"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"LinkedIn callback failed: {e}")
        raise HTTPException(status_code=500, detail="LinkedIn connection failed")
