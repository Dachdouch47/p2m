from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
from src.ml.models.detector import IntrusionDetector

router = APIRouter()

detector = IntrusionDetector()

class StatsRequest(BaseModel):
    file_path: str

@router.get("/metrics")
async def get_metrics():
    """Get model performance metrics"""
    try:
        metrics = detector.get_metrics()
        return {
            "status": "success",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/statistics")
async def get_statistics(request: StatsRequest):
    """Get statistics about detected attacks"""
    try:
        df = pd.read_csv(request.file_path)
        
        if 'prediction' not in df.columns:
            raise HTTPException(status_code=400, detail="Data has not been analyzed yet")
        
        attack_types = {}
        if 'Label' in df.columns:
            attack_types = df[df['prediction'] == 1].groupby('Label').size().to_dict()
        
        return {
            "status": "success",
            "total_records": len(df),
            "attacks_detected": int((df['prediction'] == 1).sum()),
            "attack_types": attack_types,
            "detection_rate": round((df['prediction'] == 1).sum() / len(df) * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
