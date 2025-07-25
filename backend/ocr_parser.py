import pytesseract
from PIL import Image
import pdf2image
import re
import logging
from typing import Optional, List, Dict, Any
import io
from pathlib import Path
import PyPDF2
import docx
import spacy
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class ExtractedResumeData:
    name: str
    email: str
    phone: str
    title: str
    summary: str
    skills: List[str]
    experience: str
    education: str
    location: str

class ResumeOCRParser:
    def __init__(self):
        # Try to load spacy model, fallback gracefully if not available
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            logger.warning("spaCy English model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
    
    async def parse_resume_file(self, file_content: bytes, filename: str) -> ExtractedResumeData:
        """
        Parse resume from uploaded file using OCR and text extraction
        """
        try:
            # Determine file type and extract text
            if filename.lower().endswith('.pdf'):
                text = await self._extract_text_from_pdf(file_content)
            elif filename.lower().endswith(('.docx', '.doc')):
                text = await self._extract_text_from_docx(file_content)
            elif filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
                text = await self._extract_text_from_image(file_content)
            else:
                raise ValueError(f"Unsupported file type: {filename}")
            
            # Parse structured data from extracted text
            return self._parse_resume_text(text)
            
        except Exception as e:
            logger.error(f"Failed to parse resume {filename}: {e}")
            raise
    
    async def _extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF using PyPDF2 + OCR fallback"""
        text = ""
        
        try:
            # First try direct text extraction
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text.strip():
                    text += page_text + "\n"
            
            # If we got good text, return it
            if len(text.strip()) > 100:
                return text
                
        except Exception as e:
            logger.warning(f"PyPDF2 extraction failed: {e}")
        
        # Fallback to OCR if direct extraction failed or returned little text
        try:
            logger.info("Falling back to OCR for PDF")
            images = pdf2image.convert_from_bytes(file_content)
            
            ocr_text = ""
            for image in images:
                page_text = pytesseract.image_to_string(image)
                ocr_text += page_text + "\n"
            
            return ocr_text if ocr_text.strip() else text
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return text  # Return whatever we got from PyPDF2
    
    async def _extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(io.BytesIO(file_content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            logger.error(f"DOCX extraction failed: {e}")
            raise
    
    async def _extract_text_from_image(self, file_content: bytes) -> str:
        """Extract text from image using OCR"""
        try:
            image = Image.open(io.BytesIO(file_content))
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            logger.error(f"Image OCR failed: {e}")
            raise
    
    def _parse_resume_text(self, text: str) -> ExtractedResumeData:
        """Parse structured data from resume text using regex and NLP"""
        
        # Clean the text
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Extract email
        email = self._extract_email(text)
        
        # Extract phone
        phone = self._extract_phone(text)
        
        # Extract name (using multiple strategies)
        name = self._extract_name(text)
        
        # Extract title/position
        title = self._extract_title(text)
        
        # Extract skills
        skills = self._extract_skills(text)
        
        # Extract summary/objective
        summary = self._extract_summary(text)
        
        # Extract experience section
        experience = self._extract_experience(text)
        
        # Extract education
        education = self._extract_education(text)
        
        # Extract location
        location = self._extract_location(text)
        
        return ExtractedResumeData(
            name=name,
            email=email,
            phone=phone,
            title=title,
            summary=summary,
            skills=skills,
            experience=experience,
            education=education,
            location=location
        )
    
    def _extract_email(self, text: str) -> str:
        """Extract email address"""
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(pattern, text)
        return matches[0] if matches else ""
    
    def _extract_phone(self, text: str) -> str:
        """Extract phone number"""
        # Multiple phone patterns
        patterns = [
            r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
            r'\+\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
            r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                return matches[0]
        return ""
    
    def _extract_name(self, text: str) -> str:
        """Extract name from resume"""
        lines = text.split('\n')
        
        # Strategy 1: First line that looks like a name
        for line in lines[:5]:  # Check first 5 lines
            line = line.strip()
            if len(line) > 0 and len(line) < 50:
                # Check if it looks like a name (2-4 words, mostly letters)
                words = line.split()
                if 2 <= len(words) <= 4:
                    if all(word.replace('-', '').replace("'", '').isalpha() for word in words):
                        return line
        
        # Strategy 2: Look for name patterns with titles
        name_patterns = [
            r'^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)',
            r'Name[:\s]+([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)',
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, text, re.MULTILINE)
            if match:
                return match.group(1)
        
        return "Unknown"
    
    def _extract_title(self, text: str) -> str:
        """Extract job title/position"""
        # Common title patterns
        title_patterns = [
            r'(?:Title|Position|Role)[:\s]+([^\n]+)',
            r'(?:Senior|Junior|Lead|Principal|Staff)?\s*(?:Software Engineer|Developer|Manager|Analyst|Designer|Consultant|Director|Coordinator|Specialist|Administrator)[^\n]*',
            r'\b(Chief\s+\w+\s+Officer)\b',
            r'\b(\w+\s+(?:Engineer|Developer|Manager|Analyst|Designer|Consultant|Director|Specialist))\b'
        ]
        
        lines = text.split('\n')
        
        # Look in first few lines after name
        for i, line in enumerate(lines[:10]):
            line = line.strip()
            if line and not any(char in line for char in '@.()0123456789'):
                # Check if it matches common title patterns
                for pattern in title_patterns:
                    match = re.search(pattern, line, re.IGNORECASE)
                    if match:
                        return match.group(1) if match.groups() else match.group(0)
                
                # If it's a short line that might be a title
                if 10 < len(line) < 100 and not line.lower().startswith(('email', 'phone', 'address')):
                    return line
        
        return ""
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills section"""
        skills = []
        
        # Find skills section
        skills_patterns = [
            r'(?:Skills|Technical Skills|Key Skills|Core Competencies)[:\s]*\n?([^\n]*(?:\n[^\n]*){0,10})',
            r'(?:Technologies|Programming Languages|Languages|Tools)[:\s]*\n?([^\n]*(?:\n[^\n]*){0,5})'
        ]
        
        for pattern in skills_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if match:
                skills_text = match.group(1)
                # Split by common delimiters
                skill_list = re.split(r'[,•\n\|;]', skills_text)
                skills.extend([skill.strip() for skill in skill_list if skill.strip()])
        
        # Common technical skills to look for
        common_skills = [
            'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'AWS', 'Docker',
            'Kubernetes', 'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'Linux', 'Azure',
            'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Spring', 'REST API'
        ]
        
        for skill in common_skills:
            if skill.lower() in text.lower() and skill not in skills:
                skills.append(skill)
        
        return skills[:20]  # Limit to 20 skills
    
    def _extract_summary(self, text: str) -> str:
        """Extract summary/objective section"""
        summary_patterns = [
            r'(?:Summary|Professional Summary|Objective|Profile|About)[:\s]*\n?([^\n]*(?:\n[^\n]*){0,5})',
            r'(?:Career Objective|Personal Statement)[:\s]*\n?([^\n]*(?:\n[^\n]*){0,3})'
        ]
        
        for pattern in summary_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if match:
                summary = match.group(1).strip()
                if len(summary) > 50:  # Only return if substantial
                    return summary
        
        return ""
    
    def _extract_experience(self, text: str) -> str:
        """Extract work experience section"""
        exp_patterns = [
            r'(?:Experience|Work Experience|Professional Experience|Employment)[:\s]*\n?(.*?)(?=Education|Skills|Projects|$)',
        ]
        
        for pattern in exp_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE | re.DOTALL)
            if match:
                experience = match.group(1).strip()
                if len(experience) > 100:  # Only return if substantial
                    return experience[:1000]  # Limit length
        
        return ""
    
    def _extract_education(self, text: str) -> str:
        """Extract education section"""
        edu_patterns = [
            r'(?:Education|Academic Background|Qualifications)[:\s]*\n?(.*?)(?=Experience|Skills|Projects|$)',
        ]
        
        for pattern in edu_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE | re.DOTALL)
            if match:
                education = match.group(1).strip()
                if len(education) > 20:
                    return education[:500]  # Limit length
        
        return ""
    
    def _extract_location(self, text: str) -> str:
        """Extract location/address"""
        # Look for city, state patterns
        location_patterns = [
            r'([A-Za-z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)',  # City, ST or City, ST 12345
            r'([A-Za-z\s]+,\s*[A-Za-z\s]+)',  # City, Country
        ]
        
        for pattern in location_patterns:
            matches = re.findall(pattern, text)
            if matches:
                return matches[0]
        
        return ""

# Global parser instance
ocr_parser = ResumeOCRParser()
