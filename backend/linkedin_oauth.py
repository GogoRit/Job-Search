import os
import secrets
import logging
from typing import Optional, Dict, Any
from urllib.parse import urlencode, parse_qs
import httpx
from cryptography.fernet import Fernet
import base64

logger = logging.getLogger(__name__)

class LinkedInOAuth:
    def __init__(self):
        self.client_id = os.getenv("LINKEDIN_CLIENT_ID")
        self.client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
        self.redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:3000/auth/linkedin/callback")
        
        # OAuth endpoints
        self.auth_url = "https://www.linkedin.com/oauth/v2/authorization"
        self.token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        self.profile_url = "https://api.linkedin.com/v2/people/~"
        self.email_url = "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))"
        
        # Encryption for token storage
        self.encryption_key = os.getenv("ENCRYPTION_KEY")
        if self.encryption_key:
            try:
                key_bytes = base64.urlsafe_b64decode(self.encryption_key.encode())
                self.cipher = Fernet(key_bytes)
            except Exception as e:
                logger.error(f"Failed to initialize encryption: {e}")
                self.cipher = None
        else:
            self.cipher = None
            
        # Check if OAuth is properly configured
        self.is_configured = bool(self.client_id and self.client_secret)
        
        if not self.is_configured:
            logger.warning("LinkedIn OAuth not configured. Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET")
    
    def generate_auth_url(self, state: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate LinkedIn OAuth authorization URL
        """
        if not self.is_configured:
            return {
                "success": False,
                "error": "LinkedIn OAuth not configured",
                "auth_url": None,
                "state": None
            }
        
        # Generate secure state parameter
        if not state:
            state = secrets.token_urlsafe(32)
        
        # OAuth scopes - requesting basic profile and email
        scopes = [
            "r_liteprofile",  # Basic profile info
            "r_emailaddress"  # Email address
        ]
        
        # Build authorization URL
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "state": state,
            "scope": " ".join(scopes)
        }
        
        auth_url = f"{self.auth_url}?{urlencode(params)}"
        
        return {
            "success": True,
            "auth_url": auth_url,
            "state": state,
            "redirect_uri": self.redirect_uri
        }
    
    async def handle_oauth_callback(self, code: str, state: str) -> Dict[str, Any]:
        """
        Handle OAuth callback and exchange code for access token
        """
        if not self.is_configured:
            return {
                "success": False,
                "error": "LinkedIn OAuth not configured"
            }
        
        try:
            # Exchange authorization code for access token
            token_data = await self._exchange_code_for_token(code)
            
            if not token_data.get("access_token"):
                return {
                    "success": False,
                    "error": "Failed to obtain access token"
                }
            
            # Fetch user profile data
            user_data = await self._fetch_user_profile(token_data["access_token"])
            
            # Encrypt and store the access token
            encrypted_token = self._encrypt_token(token_data["access_token"]) if self.cipher else None
            
            return {
                "success": True,
                "access_token": encrypted_token,
                "user_data": user_data,
                "expires_in": token_data.get("expires_in", 3600)
            }
            
        except Exception as e:
            logger.error(f"OAuth callback failed: {e}")
            return {
                "success": False,
                "error": f"OAuth process failed: {str(e)}"
            }
    
    async def _exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for access token"""
        
        token_data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.token_url,
                data=token_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            response.raise_for_status()
            return response.json()
    
    async def _fetch_user_profile(self, access_token: str) -> Dict[str, Any]:
        """Fetch user profile data from LinkedIn API"""
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "cache-control": "no-cache",
            "X-Restli-Protocol-Version": "2.0.0"
        }
        
        async with httpx.AsyncClient() as client:
            # Get basic profile
            profile_response = await client.get(self.profile_url, headers=headers)
            profile_response.raise_for_status()
            profile_data = profile_response.json()
            
            # Get email address
            try:
                email_response = await client.get(self.email_url, headers=headers)
                email_response.raise_for_status()
                email_data = email_response.json()
                
                # Extract email from response
                email = None
                if "elements" in email_data and len(email_data["elements"]) > 0:
                    email_element = email_data["elements"][0]
                    if "handle~" in email_element:
                        email = email_element["handle~"].get("emailAddress")
                        
            except Exception as e:
                logger.warning(f"Failed to fetch email: {e}")
                email = None
            
            # Extract and format user data
            user_data = {
                "id": profile_data.get("id"),
                "first_name": profile_data.get("localizedFirstName", ""),
                "last_name": profile_data.get("localizedLastName", ""), 
                "email": email,
                "profile_picture": None,
                "headline": None
            }
            
            # Extract profile picture if available
            if "profilePicture" in profile_data:
                picture_data = profile_data["profilePicture"]
                if "displayImage~" in picture_data:
                    images = picture_data["displayImage~"].get("elements", [])
                    if images:
                        # Get the largest image
                        largest_image = max(images, key=lambda x: x.get("data", {}).get("com.linkedin.digitalmedia.mediaartifact.StillImage", {}).get("storageSize", {}).get("width", 0))
                        user_data["profile_picture"] = largest_image.get("identifiers", [{}])[0].get("identifier")
            
            return user_data
    
    def _encrypt_token(self, token: str) -> Optional[str]:
        """Encrypt access token for secure storage"""
        if not self.cipher:
            logger.warning("No encryption key available for token storage")
            return None
        
        try:
            encrypted = self.cipher.encrypt(token.encode())
            return base64.urlsafe_b64encode(encrypted).decode()
        except Exception as e:
            logger.error(f"Failed to encrypt token: {e}")
            return None
    
    def decrypt_token(self, encrypted_token: str) -> Optional[str]:
        """Decrypt stored access token"""
        if not self.cipher:
            return None
            
        try:
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_token.encode())
            decrypted = self.cipher.decrypt(encrypted_bytes)
            return decrypted.decode()
        except Exception as e:
            logger.error(f"Failed to decrypt token: {e}")
            return None
    
    async def verify_token(self, encrypted_token: str) -> Dict[str, Any]:
        """Verify if stored token is still valid"""
        token = self.decrypt_token(encrypted_token)
        if not token:
            return {"valid": False, "error": "Failed to decrypt token"}
        
        try:
            headers = {"Authorization": f"Bearer {token}"}
            async with httpx.AsyncClient() as client:
                response = await client.get(self.profile_url, headers=headers)
                
                if response.status_code == 200:
                    return {"valid": True, "user_data": response.json()}
                else:
                    return {"valid": False, "error": "Token expired or invalid"}
                    
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return {"valid": False, "error": str(e)}

# Global LinkedIn OAuth instance
linkedin_oauth = LinkedInOAuth()
