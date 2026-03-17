from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import numpy as np
import joblib
import os

class IntrusionDetector:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.metrics = {}
        self.model_path = "models/detector_model.pkl"
        self.load_model()
    
    def train(self, X, y):
        """Train the intrusion detection model"""
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        # Calculate metrics
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        
        predictions = self.model.predict(X_scaled)
        self.metrics = {
            "accuracy": float(accuracy_score(y, predictions)),
            "precision": float(precision_score(y, predictions, zero_division=0)),
            "recall": float(recall_score(y, predictions, zero_division=0)),
            "f1_score": float(f1_score(y, predictions, zero_division=0))
        }
        
        self.save_model()
        return self.metrics
    
    def predict(self, X):
        """Make predictions on new data"""
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)
    
    def get_metrics(self):
        """Get model metrics"""
        return self.metrics
    
    def save_model(self):
        """Save model to disk"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, "models/scaler.pkl")
    
    def load_model(self):
        """Load model from disk if exists"""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load("models/scaler.pkl")
            self.is_trained = True