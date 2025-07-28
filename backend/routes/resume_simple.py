from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Request, Query
from models import ResumeUploadResponse, ParsedResumeData, Resume, WorkExperience
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
import os
from pathlib import Path
from bson import ObjectId
from datetime import datetime

# Import simplified resume parser
try:
    from simple_resume_parser import SimpleResumeParser, ResumeData, WorkExperience as SimpleWorkExperience
    PARSER_AVAILABLE = True
    parser = SimpleResumeParser()
    logger = logging.getLogger(__name__)
    logger.info("Simplified resume parser initialized successfully")
except ImportError as e:
    logging.warning(f"Simple parser not available: {e}")
    PARSER_AVAILABLE = False
    parser = None

router = APIRouter()
logger = logging.getLogger(__name__)

def convert_simple_to_api_format(simple_data: ResumeData) -> ParsedResumeData:
    """Convert SimpleResumeParser output to API format"""
    # Convert SimpleWorkExperience to API WorkExperience format
    api_experience = []
    for exp in simple_data.experience:
        api_exp = WorkExperience(
            company=exp.company,
            title=exp.title,
            location=exp.location,
            start_date=exp.start_date,
            end_date=exp.end_date,
            description=exp.description,
            duration=exp.duration
        )
        api_experience.append(api_exp)
    
    return ParsedResumeData(
        name=simple_data.name,
        email=simple_data.email,
        phone=simple_data.phone,
        title=simple_data.title,
        summary=simple_data.summary,
        skills=simple_data.skills,
        experience=api_experience,
        education=simple_data.education,
        location=simple_data.location,
        linkedin_url=simple_data.linkedin_url,
        github_url=simple_data.github_url,
        years_experience=simple_data.years_experience
    )

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    request: Request = None,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Upload and parse resume file using simplified OCR parser
    """
    if not PARSER_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Resume parsing service is not available"
        )
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file type
    allowed_extensions = {'.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'}
    file_extension = Path(file.filename).suffix.lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_extension}. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Validate file size (10MB limit)
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    file_content = await file.read()
    
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 10MB limit"
        )
    
    if len(file_content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    
    try:
        logger.info(f"Processing resume with simplified parser: {file.filename}")
        
        # Parse resume using simplified parser
        parsed_resume = parser.parse_resume_file(file_content, file.filename)
        
        # Convert to API format
        api_data = convert_simple_to_api_format(parsed_resume)
        
        logger.info(f"Successfully parsed resume for: {api_data.name}")
        
        # Create resume document for database
        resume_doc = {
            "filename": file.filename,
            "file_size": len(file_content),
            "upload_timestamp": datetime.utcnow(),
            "parsed_data": {
                "name": api_data.name,
                "email": api_data.email,
                "phone": api_data.phone,
                "title": api_data.title,
                "summary": api_data.summary,
                "skills": api_data.skills,
                "experience": [
                    {
                        "company": exp.company,
                        "title": exp.title,
                        "location": exp.location,
                        "start_date": exp.start_date,
                        "end_date": exp.end_date,
                        "description": exp.description,
                        "duration": exp.duration
                    } for exp in api_data.experience
                ],
                "education": api_data.education,
                "location": api_data.location,
                "linkedin_url": api_data.linkedin_url,
                "github_url": api_data.github_url,
                "years_experience": api_data.years_experience
            },
            "processing_metadata": {
                "parser_version": "simplified_v1.0",
                "file_type": file_extension,
                "processing_time_ms": None,  # Could add timing if needed
                "extraction_method": "paddleocr_spacy"
            }
        }
        
        # Save to database
        result = await db.resumes.insert_one(resume_doc)
        resume_id = str(result.inserted_id)
        
        logger.info(f"Resume saved to database with ID: {resume_id}")
        
        return ResumeUploadResponse(
            success=True,
            message="Resume uploaded and parsed successfully using simplified OCR",
            resume_id=resume_id,
            parsed_data=api_data
        )
        
    except Exception as e:
        logger.error(f"Failed to process resume {file.filename}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process resume: {str(e)}"
        )

@router.get("/list")
async def list_resumes(
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    """List all uploaded resumes"""
    try:
        cursor = db.resumes.find().sort("upload_timestamp", -1).skip(skip).limit(limit)
        resumes = []
        
        async for doc in cursor:
            resumes.append({
                "id": str(doc["_id"]),
                "filename": doc["filename"],
                "upload_timestamp": doc["upload_timestamp"],
                "name": doc["parsed_data"]["name"],
                "email": doc["parsed_data"]["email"],
                "title": doc["parsed_data"]["title"]
            })
        
        total_count = await db.resumes.count_documents({})
        
        return {
            "resumes": resumes,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"Failed to list resumes: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve resumes")

@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get specific resume by ID"""
    try:
        resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Convert to API format
        parsed_data = resume["parsed_data"]
        api_experience = [
            WorkExperience(**exp) for exp in parsed_data.get("experience", [])
        ]
        
        api_data = ParsedResumeData(
            name=parsed_data["name"],
            email=parsed_data["email"],
            phone=parsed_data["phone"],
            title=parsed_data["title"],
            summary=parsed_data["summary"],
            skills=parsed_data["skills"],
            experience=api_experience,
            education=parsed_data["education"],
            location=parsed_data["location"],
            linkedin_url=parsed_data.get("linkedin_url"),
            github_url=parsed_data.get("github_url"),
            years_experience=parsed_data.get("years_experience")
        )
        
        return {
            "id": str(resume["_id"]),
            "filename": resume["filename"],
            "upload_timestamp": resume["upload_timestamp"],
            "parsed_data": api_data,
            "processing_metadata": resume.get("processing_metadata", {})
        }
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid resume ID format")
    except Exception as e:
        logger.error(f"Failed to get resume {resume_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve resume")

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete resume by ID"""
    try:
        result = await db.resumes.delete_one({"_id": ObjectId(resume_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return {"message": "Resume deleted successfully"}
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid resume ID format")
    except Exception as e:
        logger.error(f"Failed to delete resume {resume_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete resume")
