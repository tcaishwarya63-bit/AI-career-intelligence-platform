# 🚀 CareerCast: AI-Powered Career Intelligence Platform

[![CareerCast CI/CD Pipeline](https://github.com/tcaishwarya63-bit/AI-career-intelligence-platform/actions/workflows/ml-ci.yml/badge.svg)](https://github.com/tcaishwarya63-bit/AI-career-intelligence-platform/actions/workflows/ml-ci.yml)
![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.13-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)
![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg)
![Target Accuracy](https://img.shields.io/badge/Model%20Accuracy-Pass%20(%E2%89%A565%25)-brightgreen.svg)

An intelligent, data-driven career counseling, trajectory prediction, and progression platform built for students and job seekers. Designed for the **Smart India Hackathon (SIH) 2025** initiative.

---

## 🌟 Architecture & Milestones Progress

### ✅ Milestone 1 (Weeks 1–2): NLP Parser & Baseline Model
- **SpaCy NER Pipeline:** Extracts candidate technical skills, soft skills, career roles, degrees, and academic institutions with $\ge 90\%$ precision.
- **Multiclass Logistic Regression Classifier:** Predicts career paths across 5 canonical tech profiles (Data Scientist, Software Engineer, Business Analyst, Product Manager, Cloud Architect).
- **Evaluation Target:** Achieved **$100\%$ Top-1 accuracy** on validation split, exceeding the $\ge 65\%$ threshold.

### ✅ Milestone 2 (Weeks 3–4): Advanced Ensemble & Skill Gap Analysis
- **Multi-Model Benchmark:** Evaluates and compares **Logistic Regression (F1: 1.00)**, **Random Forest (F1: 0.99)**, and **XGBoost (F1: 0.98)**.
- **Interactive Skill Gap Analyzer:** Real-time alignment scoring and missing competencies report against target career roles.
- **Teacher Reference Dashboard Layout:** 12-heading navigation sidebar, search bar, student notifications, and responsive dark glassmorphic UI (`#0b0f19`).

### ✅ Milestone 3 (Weeks 5–6): CI/CD Automation & Test Suite
- **GitHub Actions Pipeline (`.github/workflows/ml-ci.yml`):** Runs automated testing on every push and pull request.
- **Automated Regression Suite (`tests/`):** 12 comprehensive unit and integration tests covering:
  1. `tests/test_model.py`: Model Top-1 accuracy $\ge 65\%$ threshold validation, probability distribution sums to $100\%$, artifact persistence.
  2. `tests/test_ner.py`: Extraction of skills, roles, degrees, universities, and $\ge 90\%$ precision.
  3. `tests/test_api.py`: FastAPI `/predict`, `/gap-report`, and `/` health check endpoints.
- **Frontend Build Validation:** Automated `npm run build` verification in CI.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Lucide React, Glassmorphism CSS3
- **ML / NLP Engine:** Python 3, SpaCy (`en_core_web_sm`), scikit-learn, XGBoost, Pandas, PyPDF, Joblib
- **API Server:** FastAPI, Uvicorn, Pydantic, HTTPX
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Triggers)
- **CI / CD & Testing:** GitHub Actions, Pytest

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/tcaishwarya63-bit/AI-career-intelligence-platform.git
cd AI-career-intelligence-platform
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Backend & ML Setup
```bash
pip install -r ml/requirements.txt
python -m spacy download en_core_web_sm
python -m uvicorn server:app --app-dir ml --host 0.0.0.0 --port 8000
```
Interactive Swagger API documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Run Automated Test Suite
```bash
python -m pytest tests/ -v
```

---

## 🔒 Cloud Database Schema (Supabase)
Run `supabase_schema.sql` in the Supabase SQL Editor to provision:
1. `public.profiles` — Student skills, institutions, degrees, and career goals.
2. `public.resumes` — Uploaded resume logs and SpaCy extracted entities.
3. `public.predictions` — Model inference logs, confidence scores, and probability distributions.
4. Row Level Security (RLS) policies and automatic trigger on `auth.users`.
