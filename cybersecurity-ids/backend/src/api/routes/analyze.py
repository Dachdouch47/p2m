from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
from src.ml.models.detector import IntrusionDetector
from src.ml.utils.preprocessing import preprocess_data

router = APIRouter()

detector = IntrusionDetector()

class TrainRequest(BaseModel):
    file_path: str

class PredictRequest(BaseModel):
    file_path: str

@router.post("/train")
async def train_model(request: TrainRequest):
    """Train the ML model on the uploaded dataset"""
    try:
        df = pd.read_csv(request.file_path)
        X, y = preprocess_data(df)
        
        metrics = detector.train(X, y)
        
        return {
            "status": "success",
            "message": "Model trained successfully",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict")
async def predict(request: PredictRequest):
    """Run prediction on new data"""
    try:
        df = pd.read_csv(request.file_path)
        X, _ = preprocess_data(df)
        
        predictions = detector.predict(X)
        
        df['prediction'] = predictions
        df['is_attack'] = predictions == 1
        
        attack_count = (predictions == 1).sum()
        normal_count = (predictions == 0).sum()
        
        return {
            "status": "success",
            "total_records": len(df),
            "attacks_detected": int(attack_count),
            "normal_records": int(normal_count),
            "attack_percentage": round((attack_count / len(df)) * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
