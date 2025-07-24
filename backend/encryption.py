from cryptography.fernet import Fernet
import os
import base64
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class EncryptionManager:
    def __init__(self):
        self.key = self._get_or_create_key()
        self.cipher = Fernet(self.key)
    
    def _get_or_create_key(self) -> bytes:
        """Get encryption key from environment or create new one"""
        key_str = os.getenv("ENCRYPTION_KEY")
        
        if key_str:
            try:
                return base64.urlsafe_b64decode(key_str.encode())
            except Exception as e:
                logger.warning(f"Invalid encryption key in environment: {e}")
        
        # Generate new key
        key = Fernet.generate_key()
        key_str = base64.urlsafe_b64encode(key).decode()
        
        logger.warning("No valid encryption key found. Generated new key.")
        logger.warning(f"Please set ENCRYPTION_KEY environment variable to: {key_str}")
        
        return key
    
    def encrypt(self, data: str) -> str:
        """Encrypt string data"""
        try:
            encrypted_data = self.cipher.encrypt(data.encode())
            return base64.urlsafe_b64encode(encrypted_data).decode()
        except Exception as e:
            logger.error(f"Encryption failed: {e}")
            raise
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt string data"""
        try:
            decoded_data = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.cipher.decrypt(decoded_data)
            return decrypted_data.decode()
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            raise

# Global encryption manager instance
encryption_manager = EncryptionManager()
