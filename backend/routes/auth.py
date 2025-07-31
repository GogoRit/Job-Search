from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from models import UserCreate, UserLogin, Token, User
from auth import auth_manager, authenticate_user, create_user, get_current_active_user
from datetime import timedelta
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=Token)
async def register(
    user_create: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Register a new user"""
    try:
        # Create new user
        user = await create_user(db, user_create)
        
        # Create access token
        access_token_expires = timedelta(minutes=auth_manager.access_token_expire_minutes)
        access_token = auth_manager.create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        
        logger.info(f"User registered successfully: {user.email}")
        
        return Token(
            access_token=access_token,
            token_type="bearer"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=Token)
async def login(
    user_login: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Login user and return access token"""
    try:
        # Authenticate user
        user = await authenticate_user(db, user_login.email, user_login.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=auth_manager.access_token_expire_minutes)
        access_token = auth_manager.create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        
        logger.info(f"User logged in successfully: {user.email}")
        
        return Token(
            access_token=access_token,
            token_type="bearer"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "linkedin_enabled": current_user.linkedin_enabled,
        "has_api_key": current_user.openai_key_encrypted is not None
    } 