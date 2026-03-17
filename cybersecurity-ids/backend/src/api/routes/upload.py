from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import os
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload a CSV dataset for analysis"""
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
        # Save file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{file.filename}")
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Validate CSV
        df = pd.read_csv(file_path)
        
        return {
            "status": "success",
            "message": "Dataset uploaded successfully",
            "file_path": file_path,
            "file_name": file.filename,
            "rows": len(df),
            "columns": list(df.columns)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datasets")
async def list_datasets():
    """List all uploaded datasets"""
    try:
        files = os.listdir(UPLOAD_DIR)
        return {"status": "success", "datasets": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
