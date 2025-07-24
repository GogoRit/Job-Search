from fastapi import APIRouter, HTTPException, Depends
from models import ApiKeyStore, ApiKeyResponse, User
from database import get_database
from encryption import encryption_manager
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
from datetime import datetime
from bson import ObjectId

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/store-api-key", response_model=ApiKeyResponse)
async def store_api_key(
    api_key_data: ApiKeyStore,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Store encrypted OpenAI API key"""
    try:
        # Validate API key format (basic check)
        if not api_key_data.api_key.startswith('sk-'):
            raise HTTPException(status_code=400, detail="Invalid OpenAI API key format")
        
        # Encrypt the API key
        encrypted_key = encryption_manager.encrypt(api_key_data.api_key)
        
        # For demo purposes, we'll use a default user
        # In production, you'd get the user_id from authentication
        user_id = ObjectId()
        
        # Check if user exists, if not create one
        user_doc = await db.users.find_one({"_id": user_id})
        
        if not user_doc:
            # Create new user
            user = User(
                _id=user_id,
                openai_key_encrypted=encrypted_key,
                linkedin_enabled=False
            )
            await db.users.insert_one(user.dict(by_alias=True))
        else:
            # Update existing user
            await db.users.update_one(
                {"_id": user_id},
                {
                    "$set": {
                        "openai_key_encrypted": encrypted_key,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        
        logger.info(f"API key stored successfully for user {user_id}")
        
        return ApiKeyResponse(
            success=True,
            message="API key stored securely"
        )
        
    except Exception as e:
        logger.error(f"Failed to store API key: {e}")
        raise HTTPException(status_code=500, detail="Failed to store API key")

@router.get("/api-key-status")
async def get_api_key_status(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Check if user has API key stored"""
    try:
        # For demo purposes, check if any user has an API key
        user_count = await db.users.count_documents({"openai_key_encrypted": {"$exists": True}})
        
        return {
            "has_api_key": user_count > 0,
            "message": "API key status retrieved"
        }
        
    except Exception as e:
        logger.error(f"Failed to get API key status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get API key status")
