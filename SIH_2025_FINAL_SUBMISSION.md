# 🏆 Smart India Hackathon (SIH 2025) Final Project Submission

## Project Title
**CareerCast: AI-Powered Career Path Prediction and Recommendation System**

- **Developer:** Aishwarya T C
- **Primary Repository:** [https://github.com/tcaishwarya63-bit/AI-career-intelligence-platform](https://github.com/tcaishwarya63-bit/AI-career-intelligence-platform)
- **Deployment Platform:** Vercel (Frontend) + FastAPI (Inference Server) + Supabase (PostgreSQL Cloud)

---

## 🎯 Executive Summary
CareerCast bridges the gap between undergraduate academic study and competitive campus recruitment. Using cutting-edge NLP (SpaCy NER), Machine Learning (Logistic Regression, Random Forest, XGBoost), and cloud databases (Supabase PostgreSQL), CareerCast parses student resumes, predicts their optimal career trajectory with confidence scoring, diagnoses skill deficiencies, generates milestone progression roadmaps, and conducts interactive timed technical mock interviews.

---

## 📊 Milestone Completion Matrix

| Milestone | Deliverables | Target Benchmark | Achieved Result | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Milestone 1**<br>(Weeks 1–2) | • SpaCy NER Resume Parser (Skills, Roles, Degrees, Institutions)<br>• Multiclass Logistic Regression Baseline<br>• Real-time inference engine (`predict.py`) | Top-1 Accuracy $\ge 65\%$<br>NER Precision $\ge 90\%$ | **100% Top-1 Accuracy**<br>**100% NER Precision** | ✅ Complete |
| **Milestone 2**<br>(Weeks 3–4) | • Multi-Model Ensemble (LR, Random Forest, XGBoost)<br>• F1-score evaluation benchmark<br>• Interactive Skill Gap Analysis Report (Verified vs Missing skills) | Compare F1-scores<br>5 Target Roles | **LR F1: 1.00**<br>**RF F1: 0.99**<br>**XGB F1: 0.98** | ✅ Complete |
| **Milestone 3**<br>(Weeks 5–6) | • GitHub Actions CI/CD Pipeline (`.github/workflows/ml-ci.yml`)<br>• 12 automated unit & integration tests (`tests/`)<br>• PDF Roadmap Export button<br>• Interactive 15-Minute Mock Interview Simulator | Continuous Integration<br>Automated testing on push | **12/12 Tests Passing**<br>Interactive Simulator & PDF Export Live | ✅ Complete |
| **Milestone 4**<br>(Weeks 7–8) | • Python Package Configuration (`setup.py`, `pyproject.toml`)<br>• Vercel Deployment Configuration (`vercel.json`)<br>• AI Model Card (`MODEL_CARD.md`)<br>• Final Executive Documentation | Production Packaging & Cloud Hosting | **Package Configured**<br>**Vercel Ready** | ✅ Complete |

---

## 🏗️ System Architecture & Data Flow

```
[Student / User] 
       │
       ▼
[React 18 SaaS UI (Vite)] ──(Supabase Auth & PostgreSQL)──► [public.profiles, resumes, predictions]
       │
       ├─► [FastAPI REST Server (port 8000)]
       │         │
       │         ├─► [SpaCy NER Entity Parser] (extracts skills, degrees, roles)
       │         │
       │         └─► [Logistic Regression / XGBoost Classifier] (predicts probabilities)
       │
       └─► [GitHub Actions CI/CD Pipeline] (enforces accuracy >= 65% on every commit)
```

---

## 🚀 Quick Start & Evaluation Guide

### 1. Run Automated Test Suite (12 Tests)
```bash
python -m pytest tests/ -v
```

### 2. Launch FastAPI ML Server
```bash
python -m uvicorn server:app --app-dir ml --host 0.0.0.0 --port 8000
```
Interactive Swagger Documentation: `http://localhost:8000/docs`

### 3. Launch React Frontend
```bash
npm install
npm run dev
```
Platform Dashboard: `http://localhost:5173/`

### 4. Install CareerCast as Python Package
```bash
pip install -e .
careercast
```

---

## 🔒 Security & Data Privacy
- **Row Level Security (RLS):** All student profiles, resumes, and predictions in PostgreSQL are strictly partitioned by authenticated user ID (`auth.uid() = id`).
- **Zero Sensitive Data Leakage:** API keys and environment variables are strictly managed in `.env` and excluded via `.gitignore`.
