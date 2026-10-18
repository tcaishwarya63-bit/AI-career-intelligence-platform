"""
CareerCast Inference & Prediction Engine (Milestone 1)
Integrates SpaCy NER parsing with the trained Logistic Regression model.
Accepts raw resume text or PDF file, extracts entities, and outputs career path probabilities.
"""

import os
import sys
import argparse
import joblib
import json
from resume_parser import ResumeParser

class CareerPredictor:
    def __init__(self):
        ml_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(ml_dir, "model.joblib")
        vec_path = os.path.join(ml_dir, "vectorizer.joblib")
        
        if not os.path.exists(model_path) or not os.path.exists(vec_path):
            raise FileNotFoundError("Trained model or vectorizer not found. Run train_baseline.py first.")
            
        self.model = joblib.load(model_path)
        self.vectorizer = joblib.load(vec_path)
        self.parser = ResumeParser()
        self.classes = list(self.model.classes_)

    def predict_from_text(self, text):
        # 1. SpaCy NER extraction
        extracted = self.parser.parse(text)
        
        # 2. Vectorize extracted skills (or raw text if no skills caught)
        skills_str = ", ".join(extracted["skills"]) if extracted["skills"] else text
        X_vec = self.vectorizer.transform([skills_str])
        
        # 3. Predict probabilities with Logistic Regression
        probs = self.model.predict_proba(X_vec)[0]
        
        # Format ranked predictions
        sorted_indices = probs.argsort()[::-1]
        ranked_predictions = []
        for idx in sorted_indices:
            ranked_predictions.append({
                "role": self.classes[idx],
                "probability": round(float(probs[idx]) * 100, 1)
            })
            
        top_role = ranked_predictions[0]["role"]
        top_prob = ranked_predictions[0]["probability"]
        
        return {
            "top_predicted_role": top_role,
            "confidence_score": f"{top_prob}%",
            "extracted_entities": extracted,
            "all_ranked_probabilities": ranked_predictions
        }

    def predict_from_pdf(self, pdf_path):
        text = self.parser.extract_text_from_pdf(pdf_path)
        return self.predict_from_text(text)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CareerCast: Predict career path from resume.")
    parser.add_argument("--text", type=str, help="Raw resume text")
    parser.add_argument("--pdf", type=str, help="Path to PDF resume")
    args = parser.parse_args()
    
    predictor = CareerPredictor()
    
    if args.pdf:
        print(f"Parsing PDF Resume: {args.pdf}")
        res = predictor.predict_from_pdf(args.pdf)
    elif args.text:
        res = predictor.predict_from_text(args.text)
    else:
        # Default test profile
        sample = """
        Aditya Sharma
        Education: B.Tech in Computer Science from IIT Bombay.
        Experience: Data Scientist Intern at AI Labs.
        Technical Skills: Python, Machine Learning, Deep Learning, SQL, PyTorch, Statistics, Data Visualization.
        """
        print("No input provided. Running on sample candidate profile:")
        res = predictor.predict_from_text(sample)
        
    print("\n" + "=" * 55)
    print("CAREERCAST PREDICTION RESULTS (BASELINE MODEL)")
    print("=" * 55)
    print(f"Top Predicted Career: {res['top_predicted_role']} ({res['confidence_score']})")
    print(f"\nExtracted Skills ({len(res['extracted_entities']['skills'])}):")
    print("  " + ", ".join(res['extracted_entities']['skills']))
    print(f"\nExtracted Roles: {res['extracted_entities']['roles']}")
    print(f"Extracted Education: {res['extracted_entities']['degrees']} from {res['extracted_entities']['institutions']}")
    print("\nFull Ranked Career Probability Distribution:")
    for item in res['all_ranked_probabilities']:
        bar = "#" * int(item['probability'] // 4)
        print(f"  * {item['role']:<26} {item['probability']:>5.1f}% | {bar}")
    print("=" * 55)
