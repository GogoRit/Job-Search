from fastapi import APIRouter, HTTPException, Depends
from models import ApiKeyStore, ApiKeyResponse, User
from database import get_database
from encryption import encryption_manager
from auth import get_current_active_user
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
from datetime import datetime
from bson import ObjectId

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/store-api-key", response_model=ApiKeyResponse)
async def store_api_key(
    api_key_data: ApiKeyStore,
    current_user: User = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Store encrypted OpenAI API key for authenticated user"""
    try:
        # Validate API key format (basic check)
        if not api_key_data.api_key.startswith('sk-'):
            raise HTTPException(status_code=400, detail="Invalid OpenAI API key format")
        
        # Encrypt the API key
        encrypted_key = encryption_manager.encrypt(api_key_data.api_key)
        
        # Update user's API key
        await db.users.update_one(
            {"_id": current_user.id},
            {
                "$set": {
                    "openai_key_encrypted": encrypted_key,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        logger.info(f"API key stored successfully for user {current_user.id}")
        
        return ApiKeyResponse(
            success=True,
            message="API key stored securely"
        )
        
    except Exception as e:
        logger.error(f"Failed to store API key: {e}")
        raise HTTPException(status_code=500, detail="Failed to store API key")

@router.get("/api-key-status")
async def get_api_key_status(
    current_user: User = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Check if current user has API key stored"""
    try:
        # Check if current user has an API key
        user_doc = await db.users.find_one({"_id": current_user.id})
        has_api_key = user_doc and user_doc.get("openai_key_encrypted") is not None
        
        return {
            "has_api_key": has_api_key,
            "message": "API key status retrieved"
        }
        
    except Exception as e:
        logger.error(f"Failed to get API key status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get API key status")

@router.get("/check-api-key")
async def check_api_key(
    current_user: User = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Check if current user has an API key saved
    """
    try:
        # Check if current user has an API key
        user_doc = await db.users.find_one({"_id": current_user.id})
        has_api_key = user_doc and user_doc.get("openai_key_encrypted") is not None
        
        return {
            "has_api_key": has_api_key,
            "message": "API key check completed"
        }
        
    except Exception as e:
        logger.error(f"Failed to check API key: {e}")
        raise HTTPException(status_code=500, detail="Failed to check API key")

@router.post("/rotate-api-key", response_model=ApiKeyResponse)
async def rotate_api_key(
    api_key_data: ApiKeyStore,
    current_user: User = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Rotate (replace) the user's existing API key with a new one"""
    try:
        # Validate API key format (basic check)
        if not api_key_data.api_key.startswith('sk-'):
            raise HTTPException(status_code=400, detail="Invalid OpenAI API key format")
        
        # Check if user has an existing API key
        user_doc = await db.users.find_one({"_id": current_user.id})
        if not user_doc or not user_doc.get("openai_key_encrypted"):
            raise HTTPException(status_code=400, detail="No existing API key to rotate")
        
        # Encrypt the new API key
        encrypted_key = encryption_manager.encrypt(api_key_data.api_key)
        
        # Update user's API key
        await db.users.update_one(
            {"_id": current_user.id},
            {
                "$set": {
                    "openai_key_encrypted": encrypted_key,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        logger.info(f"API key rotated successfully for user {current_user.id}")
        
        return ApiKeyResponse(
            success=True,
            message="API key rotated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to rotate API key: {e}")
        raise HTTPException(status_code=500, detail="Failed to rotate API key")

@router.delete("/api-key", response_model=ApiKeyResponse)
async def delete_api_key(
    current_user: User = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete the user's stored API key"""
    try:
        # Remove the API key from user's record
        await db.users.update_one(
            {"_id": current_user.id},
            {
                "$unset": {"openai_key_encrypted": ""},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        logger.info(f"API key deleted successfully for user {current_user.id}")
        
        return ApiKeyResponse(
            success=True,
            message="API key deleted successfully"
        )
        
    except Exception as e:
        logger.error(f"Failed to delete API key: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete API key")
