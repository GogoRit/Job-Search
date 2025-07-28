#!/usr/bin/env python3
"""
Test script for the SimpleResumeParser
"""

import sys
import json
from pathlib import Path
from simple_resume_parser import SimpleResumeParser, ResumeData

def test_parser():
    """Test the simplified resume parser"""
    parser = SimpleResumeParser()
    
    # Test with sample text (since we don't have actual files to test)
    sample_resume_text = """
    John Smith
    Software Engineer
    john.smith@email.com
    (555) 123-4567
    San Francisco, CA
    https://linkedin.com/in/johnsmith
    https://github.com/johnsmith
    
    Professional Summary
    Experienced Software Engineer with 5 years of experience in full-stack development.
    Passionate about building scalable web applications and working with modern technologies.
    
    Technical Skills
    Python, JavaScript, React, Node.js, Django, PostgreSQL, AWS, Docker, Git
    
    Work Experience
    
    Tech Corp Inc
    Senior Software Engineer
    January 2020 - Present
    San Francisco, CA
    • Developed and maintained web applications using React and Django
    • Led a team of 3 junior developers
    • Implemented CI/CD pipelines using Docker and AWS
    
    StartupXYZ
    Software Developer
    June 2018 - December 2019
    • Built REST APIs using Python and Flask
    • Worked with PostgreSQL databases
    • Collaborated with cross-functional teams
    
    Education
    Bachelor of Science in Computer Science
    University of California, Berkeley
    2014 - 2018
    """
    
    # Create a mock ResumeData object from sample text
    resume_data = parser._parse_resume_text(sample_resume_text)
    
    print("=== Simplified Resume Parser Test ===")
    print(f"Name: {resume_data.name}")
    print(f"Email: {resume_data.email}")
    print(f"Phone: {resume_data.phone}")
    print(f"Title: {resume_data.title}")
    print(f"Location: {resume_data.location}")
    print(f"LinkedIn: {resume_data.linkedin_url}")
    print(f"GitHub: {resume_data.github_url}")
    print(f"Years Experience: {resume_data.years_experience}")
    print(f"Skills: {', '.join(resume_data.skills[:10])}")  # Show first 10 skills
    print(f"Summary: {resume_data.summary[:100]}...")  # Show first 100 chars
    print(f"Education: {resume_data.education[:100]}...")  # Show first 100 chars
    print(f"Experience Entries: {len(resume_data.experience)}")
    
    # Show experience details
    for i, exp in enumerate(resume_data.experience[:2]):  # Show first 2 experiences
        print(f"\nExperience {i+1}:")
        print(f"  Company: {exp.company}")
        print(f"  Title: {exp.title}")
        print(f"  Dates: {exp.start_date} - {exp.end_date}")
        print(f"  Location: {exp.location}")
        if exp.description:
            print(f"  Description: {exp.description[:100]}...")
    
    # Convert to JSON for API response
    resume_dict = {
        'name': resume_data.name,
        'email': resume_data.email,
        'phone': resume_data.phone,
        'title': resume_data.title,
        'summary': resume_data.summary,
        'skills': resume_data.skills,
        'experience': [
            {
                'company': exp.company,
                'title': exp.title,
                'location': exp.location,
                'start_date': exp.start_date,
                'end_date': exp.end_date,
                'description': exp.description,
                'duration': exp.duration
            }
            for exp in resume_data.experience
        ],
        'education': resume_data.education,
        'location': resume_data.location,
        'linkedin_url': resume_data.linkedin_url,
        'github_url': resume_data.github_url,
        'years_experience': resume_data.years_experience
    }
    
    print("\n=== JSON Output ===")
    print(json.dumps(resume_dict, indent=2))

if __name__ == "__main__":
    test_parser()
