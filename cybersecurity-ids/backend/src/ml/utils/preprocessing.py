import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

def preprocess_data(df):
    """Preprocess network log data for ML model"""
    df = df.copy()
    
    # Drop rows with missing values
    df = df.dropna()
    
    # Identify label column (common names)
    label_col = None
    for col in ['Label', 'label', 'class', 'Class', 'Attack', 'attack']:
        if col in df.columns:
            label_col = col
            break
    
    if label_col is None:
        raise ValueError("No label column found in dataset")
    
    y = (df[label_col] != 'BENIGN').astype(int).values
    
    # Drop non-numeric columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if label_col in numeric_cols:
        numeric_cols.remove(label_col)
    
    X = df[numeric_cols].fillna(0).values
    
    return X, y

def normalize_features(X):
    """Normalize feature scaling"""
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    return scaler.fit_transform(X)