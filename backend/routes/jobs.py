from fastapi import APIRouter, HTTPException, Depends
from models import JobRequest, JobResponse, JobData, OutreachRequest, OutreachResponse, JobSave, Job, User
from database import get_database
from auth import get_current_active_user
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging
import re
from urllib.parse import urlparse
import asyncio
from bson import ObjectId
import os

router = APIRouter()
logger = logging.getLogger(__name__)

async def scrape_linkedin_job(url: str) -> JobData:
    """Simulate LinkedIn job scraping - returns mock data"""
    # In production, you'd use browser automation (Selenium/Playwright)
    # For demo, return mock data based on URL
    
    await asyncio.sleep(1)  # Simulate scraping delay
    
    # Extract some info from URL if possible
    company_name = "TechCorp Inc."
    job_title = "Senior Frontend Engineer"
    
    # Simple URL parsing for demo
    if "microsoft" in url.lower():
        company_name = "Microsoft"
        job_title = "Software Engineer"
    elif "google" in url.lower():
        company_name = "Google"
        job_title = "Software Developer"
    elif "meta" in url.lower():
        company_name = "Meta"
        job_title = "Frontend Engineer"
    
    return JobData(
        title=job_title,
        company=company_name,
        location="San Francisco, CA (Remote)",
        salary="$140k - $180k",
        description=f"Join {company_name} as a {job_title} and help build amazing products that impact millions of users. We're looking for passionate developers with strong technical skills and a collaborative mindset.",
        requirements=["React", "TypeScript", "5+ years experience", "System design", "Testing"],
        url=url,
        posted_date="2 days ago"
    )

async def generate_outreach_content(job_title: str, company: str, job_description: str) -> OutreachResponse:
    """Generate AI-powered outreach content using OpenAI API"""
    # For demo, return mock generated content
    # In production, you'd use OpenAI API here
    
    await asyncio.sleep(2)  # Simulate AI generation delay
    
    cold_email = f"""Subject: Excited about the {job_title} opportunity at {company}

Hi [Hiring Manager],

I hope this email finds you well. I came across the {job_title} position at {company} and I'm genuinely excited about the opportunity to contribute to your team.

With my background in frontend development and experience with React and TypeScript, I believe I would be a strong fit for this role. I'm particularly drawn to {company}'s mission and innovative approach to technology.

I would love to discuss how my skills and passion could help drive your team's objectives forward. Would you be available for a brief conversation about this position?

Thank you for your time and consideration.

Best regards,
[Your Name]"""

    linkedin_message = f"""Hi [Name],

I noticed the {job_title} opening at {company} and was impressed by the role's focus on cutting-edge technology. My experience with React and TypeScript aligns well with your requirements.

Would you be open to a brief chat about the position and {company}'s engineering culture?

Best,
[Your Name]"""

    resume_suggestions = [
        f"Highlight experience relevant to {job_title} role",
        "Emphasize React and TypeScript projects prominently",
        "Include specific metrics and achievements",
        f"Mention any experience with {company}'s tech stack",
        "Add system design and scalability examples"
    ]
    
    return OutreachResponse(
        cold_email=cold_email,
        linkedin_message=linkedin_message,
        resume_suggestions=resume_suggestions
    )

@router.post("/job", response_model=JobResponse)
async def parse_job_url(
    job_request: JobRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Parse job URL and extract job details"""
    try:
        # Validate URL
        parsed_url = urlparse(job_request.url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise HTTPException(status_code=400, detail="Invalid URL format")
        
        # For demo, support LinkedIn URLs primarily
        if "linkedin.com" not in job_request.url.lower():
            logger.warning(f"Non-LinkedIn URL submitted: {job_request.url}")
        
        # Scrape job data
        job_data = await scrape_linkedin_job(job_request.url)
        
        logger.info(f"Successfully parsed job: {job_data.title} at {job_data.company}")
        
        return JobResponse(
            success=True,
            job_data=job_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to parse job URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse job URL")

@router.post("/generate-outreach", response_model=OutreachResponse)
async def generate_outreach(
    outreach_request: OutreachRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Generate AI-powered outreach content"""
    try:
        # Generate content using AI
        content = await generate_outreach_content(
            outreach_request.job_title,
            outreach_request.company,
            outreach_request.job_description
        )
        
        logger.info(f"Generated outreach content for {outreach_request.job_title} at {outreach_request.company}")
        
        return content
        
    except Exception as e:
        logger.error(f"Failed to generate outreach content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate outreach content")

@router.post("/job/save")
async def save_job(
    job_save: JobSave,
    current_user: User = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Save job to user's dashboard"""
    try:
        job = Job(
            user_id=current_user.id,
            title=job_save.title,
            company=job_save.company,
            location=job_save.location,
            salary=job_save.salary,
            description=job_save.description,
            requirements=job_save.requirements,
            url=job_save.url,
            stage=job_save.stage,
            generated_content=job_save.generated_content
        )
        
        result = await db.jobs.insert_one(job.dict(by_alias=True))
        
        logger.info(f"Saved job {job.title} at {job.company} for user {current_user.id}")
        
        return {
            "success": True,
            "message": "Job saved successfully",
            "job_id": str(result.inserted_id)
        }
        
    except Exception as e:
        logger.error(f"Failed to save job: {e}")
        raise HTTPException(status_code=500, detail="Failed to save job")

@router.get("/jobs")
async def get_user_jobs(
    stage: str = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get user's saved jobs"""
    try:
        # Get jobs for current user only
        query = {"user_id": current_user.id}
        if stage:
            query["stage"] = stage
        
        jobs_cursor = db.jobs.find(query).sort("created_at", -1)
        jobs = await jobs_cursor.to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for job in jobs:
            job["_id"] = str(job["_id"])
            job["user_id"] = str(job["user_id"])
        
        return {
            "success": True,
            "jobs": jobs
        }
        
    except Exception as e:
        logger.error(f"Failed to get jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to get jobs")
