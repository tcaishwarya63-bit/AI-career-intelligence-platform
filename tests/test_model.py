"""
Unit & Integration Tests for ML Career Path Classifier
Verifies Milestone 1 & 2 requirements:
- Baseline Top-1 Accuracy >= 65% target threshold
- Multi-class output distribution integrity (sums to 1.0)
- End-to-end vectorization and inference
"""

import os
import sys
import pytest
import numpy as np
import joblib

# Add ml folder to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml")))

from dataset import generate_career_dataset
from train_baseline import train_and_evaluate
from predict import CareerPredictor

def test_model_accuracy_exceeds_si_target():
    """
    Project Requirement (Page 4 & 5):
    Baseline Logistic Regression model must achieve at least 65.0% Top-1 Accuracy.
    """
    _, _, top1_acc = train_and_evaluate(num_samples=400, test_size=0.25, random_seed=42)
    assert top1_acc >= 0.65, f"Model accuracy {top1_acc * 100:.1f}% failed to meet the >= 65% threshold!"

def test_model_saved_artifacts_exist():
    """Verify joblib model and vectorizer artifacts are persisted on disk."""
    ml_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml"))
    model_path = os.path.join(ml_dir, "model.joblib")
    vec_path = os.path.join(ml_dir, "vectorizer.joblib")
    
    assert os.path.exists(model_path), f"Saved model not found at {model_path}"
    assert os.path.exists(vec_path), f"Saved vectorizer not found at {vec_path}"

def test_predict_probability_distribution():
    """Verify CareerPredictor outputs valid normalized probabilities summing to 100%."""
    predictor = CareerPredictor()
    sample_text = "Proficient in Python, Machine Learning, Deep Learning, SQL, PyTorch and Statistics."
    
    result = predictor.predict_from_text(sample_text)
    
    assert "top_prediction" in result
    assert "confidence_score" in result
    assert "all_ranked_probabilities" in result
    
    # Assert top prediction is Data Scientist for ML skills
    assert result["top_prediction"] == "Data Scientist"
    assert result["confidence_value"] > 50.0
    
    # Check sum of probabilities equals ~100%
    probs = [item["probability"] for item in result["all_ranked_probabilities"]]
    assert abs(sum(probs) - 100.0) < 1.0, "Probabilities do not sum to 100%!"

def test_software_engineer_prediction():
    """Verify prediction for Software Engineer profile."""
    predictor = CareerPredictor()
    sample_text = "Experience with Java, React, Docker, Kubernetes, Data Structures, Algorithms and Git."
    
    result = predictor.predict_from_text(sample_text)
    assert result["top_prediction"] == "Software Engineer"
