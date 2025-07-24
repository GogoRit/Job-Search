from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from models import ResumeUploadResponse, ParsedResumeData, Resume
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
import aiofiles
import os
from pathlib import Path
import PyPDF2
import docx
from io import BytesIO
import re
from bson import ObjectId

router = APIRouter()
logger = logging.getLogger(__name__)

async def parse_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.error(f"Failed to parse PDF: {e}")
        raise

async def parse_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        logger.error(f"Failed to parse DOCX: {e}")
        raise

def extract_resume_data(text: str) -> ParsedResumeData:
    """Extract structured data from resume text using regex patterns"""
    # Simple regex patterns for demo - in production, use NLP models
    
    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_pattern, text)
    email = email_match.group() if email_match else "contact@example.com"
    
    # Extract name (assume first line or before email)
    lines = text.split('\n')
    name = "John Doe"  # Default
    for line in lines[:5]:  # Check first 5 lines
        if line.strip() and not '@' in line and len(line.strip()) < 50:
            name = line.strip()
            break
    
    # Extract skills (look for common tech keywords)
    skills_keywords = [
        'React', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Node.js',
        'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Kubernetes',
        'HTML', 'CSS', 'Vue', 'Angular', 'Django', 'Flask', 'Express',
        'Git', 'API', 'REST', 'GraphQL', 'Machine Learning', 'AI'
    ]
    
    found_skills = []
    text_upper = text.upper()
    for skill in skills_keywords:
        if skill.upper() in text_upper:
            found_skills.append(skill)
    
    # Extract title (look for common job titles)
    title_keywords = [
        'Software Engineer', 'Developer', 'Data Scientist', 'Product Manager',
        'Designer', 'Analyst', 'Consultant', 'Manager', 'Director', 'Lead'
    ]
    
    title = "Software Engineer"  # Default
    for keyword in title_keywords:
        if keyword.lower() in text.lower():
            title = keyword
            break
    
    # Extract experience (simplified - just use the text)
    experience = text[:500] + "..." if len(text) > 500 else text
    
    return ParsedResumeData(
        name=name,
        email=email,
        title=title,
        skills=found_skills[:10],  # Limit to 10 skills
        experience=experience,
        location="Remote",  # Default for demo
    )

@router.post("/resume", response_model=ResumeUploadResponse)
async def upload_resume(
    resume: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Upload and parse resume file"""
    try:
        # Validate file type
        if not resume.content_type in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
        
        # Read file content
        file_content = await resume.read()
        
        # Parse based on file type
        if resume.content_type == 'application/pdf':
            text = await parse_pdf(file_content)
        else:  # DOCX
            text = await parse_docx(file_content)
        
        # Extract structured data
        parsed_data = extract_resume_data(text)
        
        # Store in database
        user_id = ObjectId()  # For demo - in production, get from auth
        
        resume_doc = Resume(
            user_id=user_id,
            parsed_data=parsed_data,
            original_filename=resume.filename or "resume.pdf"
        )
        
        await db.resumes.insert_one(resume_doc.dict(by_alias=True))
        
        logger.info(f"Resume parsed and stored for user {user_id}")
        
        return ResumeUploadResponse(
            success=True,
            parsed_data=parsed_data,
            message="Resume parsed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to process resume: {e}")
        raise HTTPException(status_code=500, detail="Failed to process resume")

@router.get("/resume/latest")
async def get_latest_resume(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get the latest resume for the user"""
    try:
        # For demo - get any resume
        resume_doc = await db.resumes.find_one(
            {},
            sort=[("created_at", -1)]
        )
        
        if not resume_doc:
            raise HTTPException(status_code=404, detail="No resume found")
        
        return {
            "success": True,
            "parsed_data": resume_doc["parsed_data"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get resume: {e}")
        raise HTTPException(status_code=500, detail="Failed to get resume")
