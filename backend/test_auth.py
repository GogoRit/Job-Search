#!/usr/bin/env python3
"""
Test script for authentication system
Run this to verify the authentication implementation works correctly
"""

import asyncio
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from database import connect, disconnect, get_database
from auth import auth_manager, create_user, authenticate_user
from models import UserCreate, UserLogin
from encryption import encryption_manager

async def test_authentication():
    """Test the authentication system"""
    print("🧪 Testing Authentication System...")
    
    try:
        # Connect to database
        await connect()
        db = await get_database()
        
        # Test 1: User Registration
        print("\n1. Testing User Registration...")
        user_create = UserCreate(
            email="test@example.com",
            password="testpassword123",
            name="Test User"
        )
        
        user = await create_user(db, user_create)
        print(f"✅ User created: {user.email} (ID: {user.id})")
        
        # Test 2: Password Hashing
        print("\n2. Testing Password Hashing...")
        hashed_password = auth_manager.get_password_hash("testpassword123")
        is_valid = auth_manager.verify_password("testpassword123", hashed_password)
        print(f"✅ Password hashing works: {is_valid}")
        
        # Test 3: User Authentication
        print("\n3. Testing User Authentication...")
        user_login = UserLogin(
            email="test@example.com",
            password="testpassword123"
        )
        
        authenticated_user = await authenticate_user(db, user_login.email, user_login.password)
        if authenticated_user:
            print(f"✅ User authenticated: {authenticated_user.email}")
        else:
            print("❌ Authentication failed")
            return False
        
        # Test 4: JWT Token Creation
        print("\n4. Testing JWT Token Creation...")
        token = auth_manager.create_access_token(data={"sub": str(authenticated_user.id)})
        print(f"✅ JWT token created: {token[:50]}...")
        
        # Test 5: Token Verification
        print("\n5. Testing Token Verification...")
        token_data = auth_manager.verify_token(token)
        if token_data and token_data.user_id == str(authenticated_user.id):
            print(f"✅ Token verified: {token_data.user_id}")
        else:
            print("❌ Token verification failed")
            return False
        
        # Test 6: API Key Encryption/Decryption
        print("\n6. Testing API Key Encryption...")
        test_api_key = "sk-test123456789012345678901234567890123456789012345678901234567890"
        encrypted_key = encryption_manager.encrypt(test_api_key)
        decrypted_key = encryption_manager.decrypt(encrypted_key)
        
        if decrypted_key == test_api_key:
            print("✅ API key encryption/decryption works")
        else:
            print("❌ API key encryption/decryption failed")
            return False
        
        print("\n🎉 All authentication tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False
    finally:
        await disconnect()

async def main():
    """Main test function"""
    print("🚀 Starting Authentication System Tests")
    print("=" * 50)
    
    success = await test_authentication()
    
    if success:
        print("\n✅ All tests completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 