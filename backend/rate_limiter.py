"""
Rate limiting configuration for the Job Search Assistant API
"""
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
import logging

logger = logging.getLogger(__name__)

# Rate limiting configuration from environment
OCR_RATE_LIMIT_PER_MINUTE = int(os.getenv("OCR_RATE_LIMIT_PER_MINUTE", "5"))
LINKEDIN_RATE_LIMIT_PER_HOUR = int(os.getenv("LINKEDIN_RATE_LIMIT_PER_HOUR", "100"))
API_RATE_LIMIT_PER_MINUTE = int(os.getenv("API_RATE_LIMIT_PER_MINUTE", "60"))

# Create limiter instance
limiter = Limiter(key_func=get_remote_address)

# Rate limit strings
OCR_RATE_LIMIT = f"{OCR_RATE_LIMIT_PER_MINUTE}/minute"
LINKEDIN_RATE_LIMIT = f"{LINKEDIN_RATE_LIMIT_PER_HOUR}/hour"
API_RATE_LIMIT = f"{API_RATE_LIMIT_PER_MINUTE}/minute"

def get_client_ip(request: Request) -> str:
    """
    Get client IP address, considering proxy headers
    """
    # Check for forwarded IP (when behind proxy)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    
    # Check for real IP header
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fall back to client host
    return request.client.host if request.client else "unknown"

def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom rate limit exceeded handler
    """
    client_ip = get_client_ip(request)
    logger.warning(f"Rate limit exceeded for IP {client_ip}: {exc.detail}")
    
    response = _rate_limit_exceeded_handler(request, exc)
    return response
