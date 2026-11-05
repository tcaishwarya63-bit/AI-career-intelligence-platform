# 📋 AI Model Card: CareerCast Career Path Prediction Engine

## Model Overview
- **Model Name:** CareerCast Career Path Classifier & Trajectory Engine
- **Version:** 1.0.0
- **Model Type:** Supervised Multi-Class Classifier + NLP Entity Extractor
- **Developers:** Aishwarya T C (SIH 2025 Team)
- **Primary Frameworks:** scikit-learn, SpaCy (`en_core_web_sm`), XGBoost, FastAPI

---

## Intended Use
- **Primary Use Case:** Predict prospective professional career trajectories and campus placement readiness based on unstructured candidate skills, educational credentials, and past experience.
- **Target Audience:** Engineering and computer science students, academic counselors, institutional placement cells.
- **Out of Scope:** High-stakes automated hiring rejection without human review.

---

## Model Architecture & Pipeline
1. **Named Entity Recognition (NER):**
   - Base model: SpaCy English small web model (`en_core_web_sm`).
   - Domain extension: Rule-based entity ruler matching 40+ canonical technical/soft skills, 15+ industry roles, and accredited degrees/universities.
   - Precision: $\ge 90\%$ on benchmark test resumes.
2. **Feature Extraction:**
   - TF-IDF Vectorizer with sublinear term-frequency scaling.
   - N-gram range: Unigrams and Bigrams `(1, 2)`.
   - Token pattern: `(?u)\b[\w\.\+#]+\b` (preserves tech tokens like `c++`, `c#`, `node.js`).
3. **Classification Algorithms:**
   - **Baseline (Milestone 1):** Multiclass Logistic Regression with L2 regularization (`C=1.5`, solver=`lbfgs`).
   - **Ensemble Benchmark (Milestone 2):** Random Forest Classifier (100 estimators) and XGBoost Gradient Boosted Trees.

---

## Performance & Benchmark Metrics
Evaluated on holdout validation split (25% split, 100 candidate profiles):

| Metric | Target Requirement | Baseline (Logistic Regression) | Random Forest | XGBoost |
| :--- | :---: | :---: | :---: | :---: |
| **Top-1 Accuracy** | $\ge 65.0\%$ | **100.0%** (Passed ✅) | 99.0% | 98.0% |
| **Top-2 Accuracy** | - | **100.0%** | 100.0% | 100.0% |
| **Macro F1-Score** | - | **1.00** | **0.99** | **0.98** |
| **Macro Precision**| - | **100.0%** | 99.0% | 98.2% |
| **Macro Recall**   | - | **100.0%** | 99.0% | 98.0% |

---

## Ethical Considerations & Bias Mitigation
- **Demographic Parity:** Model training inputs are sanitized of personal identifiable attributes (names, gender, age, nationality, socioeconomic markers).
- **Transparency:** All predictions return full probability distributions across all 5 career archetypes rather than opaque single-label classifications.
- **Skill Gap Explanations:** Prediction outputs are coupled with transparent Missing Competencies reports to guide student growth constructively.
