from pydantic import BaseModel, Field, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema
from typing import List, Optional, Dict, Any, Annotated
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls, schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        return handler(core_schema.str_schema())

# Authentication Models
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

# API Key Models
class ApiKeyStore(BaseModel):
    api_key: str

class ApiKeyResponse(BaseModel):
    success: bool
    message: str

# Resume Models
class WorkExperience(BaseModel):
    """Structured work experience entry"""
    company: str
    title: str  # Job title/position
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None  # "Present" for current positions
    description: Optional[str] = None
    duration: Optional[str] = None  # e.g., "2 years 3 months"

class ParsedResumeData(BaseModel):
    # Core Identity Fields (Required for most job applications)
    name: str
    email: str
    phone: Optional[str] = None
    
    # Professional Information
    title: str  # Current job title or desired position
    summary: Optional[str] = None  # Professional summary/objective
    
    # Experience & Skills
    skills: List[str] = []
    experience: List[WorkExperience] = []  # Structured work experience list
    education: Optional[str] = None  # Education background
    
    # Additional Standard Fields
    location: Optional[str] = None  # Current location or preferred work location
    linkedin_url: Optional[str] = None  # LinkedIn profile
    portfolio_url: Optional[str] = None  # Portfolio or personal website
    github_url: Optional[str] = None  # GitHub profile
    years_experience: Optional[int] = None  # Total years of experience
    
    # Optional Enhancement Fields
    certifications: Optional[List[str]] = None
    languages: Optional[List[str]] = None  # Programming/spoken languages
    availability: Optional[str] = None  # Notice period or availability

class ResumeUploadResponse(BaseModel):
    success: bool
    parsed_data: ParsedResumeData
    message: str

# Job Models
class JobRequest(BaseModel):
    url: str

class JobData(BaseModel):
    title: str
    company: str
    location: str
    salary: Optional[str] = None
    description: str
    requirements: List[str]
    url: str
    posted_date: Optional[str] = None

class JobResponse(BaseModel):
    success: bool
    job_data: JobData

class GeneratedContent(BaseModel):
    cold_email: str
    linkedin_message: str
    resume_suggestions: List[str]

class OutreachRequest(BaseModel):
    job_title: str
    company: str
    job_description: str

class OutreachResponse(BaseModel):
    cold_email: str
    linkedin_message: str
    resume_suggestions: List[str]

class JobSave(BaseModel):
    title: str
    company: str
    location: str
    salary: Optional[str] = None
    description: str
    requirements: List[str]
    url: str
    stage: str = "saved"
    generated_content: Optional[GeneratedContent] = None

# LinkedIn Models
class LinkedInSettings(BaseModel):
    linkedin_enabled: bool

class LinkedInResponse(BaseModel):
    success: bool
    message: str

# Database Models
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: str
    password_hash: str
    name: str
    openai_key_encrypted: Optional[str] = None
    linkedin_enabled: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Resume(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    parsed_data: ParsedResumeData
    original_filename: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Job(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    title: str
    company: str
    location: str
    salary: Optional[str] = None
    description: str
    requirements: List[str]
    url: str
    stage: str = "saved"  # saved, applied, interview, offer, rejected
    notes: Optional[str] = None
    generated_content: Optional[GeneratedContent] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    job_id: PyObjectId
    user_id: PyObjectId
    cold_email: str
    linkedin_dm: str
    sent_status: Dict[str, Any] = {}  # {"email": {"sent": True, "date": "..."}, "linkedin": {...}}
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Feature Response
class FeaturesResponse(BaseModel):
    ai: bool
    email: bool
    linkedin: bool
    database: bool
    version: str
    environment: str
