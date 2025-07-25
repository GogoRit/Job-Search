"""
File validation utilities for the Job Search Assistant
"""
import os
import mimetypes
from typing import List, Tuple
from fastapi import HTTPException, UploadFile
import logging

logger = logging.getLogger(__name__)

# Configuration from environment variables
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
ALLOWED_FILE_TYPES = os.getenv("ALLOWED_FILE_TYPES", "pdf,doc,docx,jpg,jpeg,png").split(",")
OCR_TIMEOUT_SECONDS = int(os.getenv("OCR_TIMEOUT_SECONDS", "30"))

# Convert MB to bytes
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

# MIME type mappings for allowed file types
ALLOWED_MIME_TYPES = {
    "pdf": ["application/pdf"],
    "doc": ["application/msword"],
    "docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    "jpg": ["image/jpeg"],
    "jpeg": ["image/jpeg"],
    "png": ["image/png"],
}

def get_allowed_mime_types() -> List[str]:
    """
    Get list of allowed MIME types based on configuration
    """
    allowed_mimes = []
    for file_type in ALLOWED_FILE_TYPES:
        file_type = file_type.strip().lower()
        if file_type in ALLOWED_MIME_TYPES:
            allowed_mimes.extend(ALLOWED_MIME_TYPES[file_type])
    return allowed_mimes

def validate_file_size(file: UploadFile) -> None:
    """
    Validate file size against configured limit
    
    Args:
        file: The uploaded file to validate
        
    Raises:
        HTTPException: If file size exceeds limit
    """
    # Read file content to check size
    content = file.file.read()
    file_size = len(content)
    
    # Reset file pointer for later use
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE_BYTES:
        size_mb = file_size / (1024 * 1024)
        logger.warning(f"File size validation failed: {size_mb:.2f}MB > {MAX_FILE_SIZE_MB}MB for file {file.filename}")
        raise HTTPException(
            status_code=413,
            detail=f"File size ({size_mb:.2f}MB) exceeds maximum allowed size ({MAX_FILE_SIZE_MB}MB)"
        )
    
    logger.info(f"File size validation passed: {file_size / (1024 * 1024):.2f}MB for file {file.filename}")

def validate_file_type(file: UploadFile) -> None:
    """
    Validate file type against allowed types
    
    Args:
        file: The uploaded file to validate
        
    Raises:
        HTTPException: If file type is not allowed
    """
    allowed_mimes = get_allowed_mime_types()
    
    # Check MIME type
    if file.content_type not in allowed_mimes:
        logger.warning(f"File type validation failed: {file.content_type} not in {allowed_mimes} for file {file.filename}")
        raise HTTPException(
            status_code=415,
            detail=f"File type '{file.content_type}' not supported. Allowed types: {', '.join(ALLOWED_FILE_TYPES)}"
        )
    
    # Additional validation based on file extension
    if file.filename:
        extension = file.filename.split(".")[-1].lower()
        if extension not in ALLOWED_FILE_TYPES:
            logger.warning(f"File extension validation failed: .{extension} not in {ALLOWED_FILE_TYPES} for file {file.filename}")
            raise HTTPException(
                status_code=415,
                detail=f"File extension '.{extension}' not supported. Allowed extensions: {', '.join(ALLOWED_FILE_TYPES)}"
            )
    
    logger.info(f"File type validation passed: {file.content_type} for file {file.filename}")

def validate_filename(filename: str) -> None:
    """
    Validate filename for security
    
    Args:
        filename: The filename to validate
        
    Raises:
        HTTPException: If filename contains dangerous characters
    """
    if not filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    # Check for dangerous characters
    dangerous_chars = ["../", "..\\", "/", "\\", ":", "*", "?", "\"", "<", ">", "|"]
    for char in dangerous_chars:
        if char in filename:
            logger.warning(f"Filename validation failed: dangerous character '{char}' in {filename}")
            raise HTTPException(
                status_code=400,
                detail=f"Filename contains invalid character: '{char}'"
            )
    
    # Check filename length
    if len(filename) > 255:
        logger.warning(f"Filename validation failed: too long ({len(filename)} chars) for {filename}")
        raise HTTPException(
            status_code=400,
            detail="Filename too long (maximum 255 characters)"
        )
    
    logger.info(f"Filename validation passed: {filename}")

def validate_upload_file(file: UploadFile) -> Tuple[bool, str]:
    """
    Comprehensive file validation
    
    Args:
        file: The uploaded file to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        # Validate filename
        if file.filename:
            validate_filename(file.filename)
        
        # Validate file type
        validate_file_type(file)
        
        # Validate file size
        validate_file_size(file)
        
        logger.info(f"File validation passed for: {file.filename}")
        return True, ""
        
    except HTTPException as e:
        logger.error(f"File validation failed for {file.filename}: {e.detail}")
        return False, str(e.detail)
    except Exception as e:
        logger.error(f"Unexpected error during file validation for {file.filename}: {e}")
        return False, f"File validation error: {str(e)}"

def get_file_info(file: UploadFile) -> dict:
    """
    Get information about uploaded file
    
    Args:
        file: The uploaded file
        
    Returns:
        Dictionary with file information
    """
    # Get file size
    content = file.file.read()
    file_size = len(content)
    file.file.seek(0)  # Reset file pointer
    
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": file_size,
        "size_mb": round(file_size / (1024 * 1024), 2),
        "extension": file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else None,
        "max_allowed_size_mb": MAX_FILE_SIZE_MB,
        "allowed_types": ALLOWED_FILE_TYPES
    }
