"""
FastAPI REST API Server for CareerCast
Exposes REST endpoints for:
- /predict: Predict career trajectories from skills & text
- /upload-resume: Parse PDF/DOCX resumes and predict career paths
- /gap-report: Compare candidate skills against target career requirements
Swagger Docs: http://localhost:8000/docs (as specified in PDF Page 6)
"""

import os
import shutil
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import CareerPredictor
from resume_parser import ResumeParser

app = FastAPI(
    title="CareerCast AI Engine API",
    description="NLP-Powered Career Path Prediction & Recommendation System (SIH 2025)",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor and parser
predictor = CareerPredictor()
parser = ResumeParser()

class PredictRequest(BaseModel):
    skills: Optional[str] = ""
    experience_role: Optional[str] = ""
    degree: Optional[str] = ""
    raw_text: Optional[str] = ""

class GapReportRequest(BaseModel):
    target_role: str
    current_skills: List[str]

@app.get("/")
def health_check():
    return {
        "status": "online",
        "system": "CareerCast AI Intelligence Engine",
        "model": "Multiclass Logistic Regression (Baseline)",
        "nlp_parser": "SpaCy Named Entity Recognition",
        "docs_url": "http://localhost:8000/docs"
    }

@app.post("/predict")
def predict_career(req: PredictRequest):
    """Predicts career trajectories from candidate skills or raw text profile."""
    query = req.raw_text or f"Skills: {req.skills}. Role: {req.experience_role}. Degree: {req.degree}"
    if not query.strip():
        raise HTTPException(status_code=400, detail="Please provide skills or raw resume text.")
        
    result = predictor.predict_from_text(query)
    return result

@app.post("/upload-resume")
async def upload_and_parse_resume(file: UploadFile = File(...)):
    """Uploads a PDF/DOCX/TXT resume, extracts SpaCy entities, and returns predictions."""
    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        if file.filename.lower().endswith(".pdf"):
            result = predictor.predict_from_pdf(temp_path)
        else:
            with open(temp_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
            result = predictor.predict_from_text(text)
            
        return {
            "filename": file.filename,
            "status": "success",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/gap-report")
def generate_gap_report(req: GapReportRequest):
    """Computes missing skills against target role taxonomy (Page 6)."""
    canonical_requirements = {
        "Data Scientist": ["Python", "Machine Learning", "SQL", "Statistics", "Deep Learning", "PyTorch", "MLOps"],
        "Software Engineer": ["Data Structures", "Algorithms", "Java", "Python", "Git", "Docker", "System Design"],
        "Business Analyst": ["SQL", "Power BI", "Tableau", "Excel", "Data Analysis", "Agile"],
        "Product Manager": ["Product Strategy", "Roadmapping", "Agile", "User Research", "A/B Testing", "KPIs"],
        "DevOps / Cloud Architect": ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Cloud Security"]
    }
    
    target = req.target_role.strip()
    required = canonical_requirements.get(target, ["Python", "SQL", "Git", "Problem Solving"])
    
    user_skills_lower = [s.strip().lower() for s in req.current_skills]
    missing = [req_skill for req_skill in required if req_skill.lower() not in user_skills_lower]
    matching = [req_skill for req_skill in required if req_skill.lower() in user_skills_lower]
    
    alignment = round((len(matching) / len(required)) * 100) if required else 100
    
    return {
        "target_role": target,
        "skill_alignment_percentage": f"{alignment}%",
        "matching_skills": matching,
        "missing_competencies": missing
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting CareerCast FastAPI server on http://localhost:8000 ...")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
