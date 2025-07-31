from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from encryption import encryption_manager
from auth import get_current_active_user
from models import User
from typing import Optional
import logging

logger = logging.getLogger(__name__)

async def get_user_api_key(current_user: User, db: AsyncIOMotorDatabase) -> Optional[str]:
    """
    Get and decrypt the current user's API key
    
    Returns:
        str: Decrypted API key if available, None otherwise
    """
    try:
        if not current_user.openai_key_encrypted:
            return None
        
        # Decrypt the API key
        decrypted_key = encryption_manager.decrypt(current_user.openai_key_encrypted)
        return decrypted_key
        
    except Exception as e:
        logger.error(f"Failed to decrypt API key for user {current_user.id}: {e}")
        return None

async def get_current_user_api_key(
    current_user: User = None,
    db: AsyncIOMotorDatabase = None
) -> Optional[str]:
    """
    Convenience function to get the current user's API key
    This can be used as a dependency in route functions
    """
    if not current_user:
        current_user = await get_current_active_user()
    if not db:
        db = await get_database()
    
    return await get_user_api_key(current_user, db)

def validate_api_key(api_key: str) -> bool:
    """
    Validate API key format
    
    Args:
        api_key: The API key to validate
        
    Returns:
        bool: True if valid format, False otherwise
    """
    if not api_key:
        return False
    
    # Basic OpenAI API key validation
    if not api_key.startswith('sk-'):
        return False
    
    # Check minimum length (OpenAI keys are typically 51 characters)
    if len(api_key) < 20:
        return False
    
    return True 