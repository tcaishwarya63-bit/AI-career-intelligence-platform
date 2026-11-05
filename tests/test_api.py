"""
Integration Tests for FastAPI REST Endpoints
Verifies:
- GET /: Health check status
- POST /predict: Inference pipeline with valid JSON payloads
- POST /gap-report: Skill alignment and missing competencies
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add ml folder to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml")))

from server import app

client = TestClient(app)

def test_health_check_endpoint():
    """Verify API root returns online status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "CareerCast" in data["system"]

def test_predict_endpoint_valid_payload():
    """Verify /predict returns ranked probabilities for skills input."""
    payload = {
        "skills": "Python, Machine Learning, Deep Learning, SQL, Statistics",
        "experience_role": "Data Scientist Intern",
        "degree": "B.Tech Computer Science"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "top_prediction" in data
    assert data["top_prediction"] == "Data Scientist"
    assert len(data["all_ranked_probabilities"]) > 0

def test_predict_endpoint_empty_payload_fails():
    """Verify /predict rejects empty payload with HTTP 400."""
    payload = {"skills": "", "experience_role": "", "degree": "", "raw_text": ""}
    response = client.post("/predict", json=payload)
    assert response.status_code == 400

def test_gap_report_endpoint():
    """Verify /gap-report calculates alignment and identifies missing skills."""
    payload = {
        "target_role": "Data Scientist",
        "current_skills": ["Python", "SQL", "Statistics"]
    }
    response = client.post("/gap-report", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["target_role"] == "Data Scientist"
    assert "skill_alignment_percentage" in data
    assert "missing_competencies" in data
    assert "Deep Learning" in data["missing_competencies"]
