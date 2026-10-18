"""
Baseline Logistic Regression Career Classifier
Trains a multiclass Logistic Regression model on the historical career transitions dataset.
Evaluates accuracy, macro F1-score, and top-k metrics against Milestone 1 targets (>=65% Top-1 accuracy).
Saves the trained model and vectorizer for production inference.
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, f1_score, precision_score, recall_score
from dataset import generate_career_dataset

def train_and_evaluate(num_samples=400, test_size=0.25, random_seed=42):
    print("=" * 65)
    print("CareerCast: Milestone 1 Baseline Model Training Pipeline")
    print("=" * 65)
    
    # 1. Load / Generate Dataset
    print(f"\n[1/4] Generating historical career transitions dataset ({num_samples} profiles)...")
    df = generate_career_dataset(num_samples=num_samples, random_seed=random_seed)
    print(f"      Classes ({len(df['target_role'].unique())}): {list(df['target_role'].unique())}")
    
    # 2. Feature Extraction & Vectorization (TF-IDF weighted skill frequency matrix)
    print("\n[2/4] Vectorizing candidate skills using TF-IDF...")
    X_raw = df['skills']
    y = df['target_role']
    
    vectorizer = TfidfVectorizer(
        token_pattern=r'(?u)\b[\w\.\+#]+\b',
        ngram_range=(1, 2),
        lowercase=True
    )
    X = vectorizer.fit_transform(X_raw)
    
    # 3. Train / Validation Split (Hold-out test set of 25%, i.e. 100 profiles)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_seed, stratify=y
    )
    print(f"      Training set: {X_train.shape[0]} profiles | Validation set: {X_test.shape[0]} profiles")
    
    # 4. Train Baseline Logistic Regression Classifier
    print("\n[3/4] Fitting baseline Logistic Regression model with L2 regularization...")
    model = LogisticRegression(
        C=1.5,
        max_iter=1000,
        solver='lbfgs',
        random_state=random_seed
    )
    model.fit(X_train, y_train)
    
    # 5. Evaluate Metrics
    print("\n[4/4] Computing Milestone 1 Evaluation Metrics on Validation Split:")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)
    
    top1_acc = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average='macro')
    macro_prec = precision_score(y_test, y_pred, average='macro')
    macro_rec = recall_score(y_test, y_pred, average='macro')
    
    # Compute Top-2 and Top-3 accuracy
    classes = list(model.classes_)
    top2_correct = 0
    top3_correct = 0
    for i, true_label in enumerate(y_test):
        sorted_indices = np.argsort(y_prob[i])[::-1]
        top2_classes = [classes[idx] for idx in sorted_indices[:2]]
        top3_classes = [classes[idx] for idx in sorted_indices[:3]]
        if true_label in top2_classes:
            top2_correct += 1
        if true_label in top3_classes:
            top3_correct += 1
            
    top2_acc = top2_correct / len(y_test)
    top3_acc = top3_correct / len(y_test)
    
    # Format and display report
    target_threshold = 0.65
    status = "PASSED [YES]" if top1_acc >= target_threshold else "NEEDS TUNING [NO]"
    
    print("-" * 65)
    print(f"  * Top-1 Accuracy:            {top1_acc * 100:.2f}%  (Target: >=65.0% -> {status})")
    print(f"  * Top-2 Accuracy:            {top2_acc * 100:.2f}%")
    print(f"  * Top-3 Accuracy:            {top3_acc * 100:.2f}%")
    print(f"  * Macro Precision:           {macro_prec * 100:.2f}%")
    print(f"  * Macro Recall:              {macro_rec * 100:.2f}%")
    print(f"  * Macro F1-Score:            {macro_f1 * 100:.2f}%")
    print("-" * 65)
    
    print("\nDetailed Per-Class Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save artifacts
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(ml_dir, "model.joblib")
    vec_path = os.path.join(ml_dir, "vectorizer.joblib")
    
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vec_path)
    print(f"Model saved to:      {model_path}")
    print(f"Vectorizer saved to: {vec_path}")
    print("=" * 65)
    
    return model, vectorizer, top1_acc

if __name__ == '__main__':
    train_and_evaluate()
