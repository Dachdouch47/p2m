import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import os
from typing import Tuple, Union

class DataPreprocessor:
    """
    Applique le MÊME preprocessing que lors de l'entraînement
    ⚠️ CRITICAL: Preprocessing identique = prédictions cohérentes
    """
    
    # Colonnes à supprimer (comme dans entraînement)
    COLUMNS_TO_DROP = [
        'Label',           # Colonne cible
        'FlowID',          # Identifiants
        'SourceIP',        # Trop spécifiques
        'DestinationIP',
        'Timestamp',
        'Source_IP',
        'Dest_IP',
        'SrcIP',
        'DstIP'
    ]
    
    @staticmethod
    def clean_data(df: pd.DataFrame) -> pd.DataFrame:
        """
        Nettoyage données - IDENTICAL à entraînement
        """
        df_clean = df.copy()
        
        print(f"📊 Avant: {df_clean.shape}")
        
        # 1. Suppression colonnes
        cols_to_drop = [col for col in DataPreprocessor.COLUMNS_TO_DROP 
                       if col in df_clean.columns]
        if cols_to_drop:
            df_clean = df_clean.drop(columns=cols_to_drop, errors='ignore')
            print(f"   ✅ {len(cols_to_drop)} colonnes supprimées")
        
        # 2. Suppression NaN
        initial_rows = len(df_clean)
        df_clean = df_clean.dropna()
        print(f"   ✅ {initial_rows - len(df_clean)} NaN supprimés")
        
        # 3. Suppression doublons
        initial_rows = len(df_clean)
        df_clean = df_clean.drop_duplicates()
        print(f"   ✅ {initial_rows - len(df_clean)} doublons supprimés")
        
        # 4. String → Numeric
        for col in df_clean.columns:
            if df_clean[col].dtype == 'object':
                try:
                    df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
                except:
                    pass
        
        # 5. Remplissage NaN
        df_clean = df_clean.fillna(0)
        
        # 6. Suppression infinites
        df_clean = df_clean.replace([np.inf, -np.inf], 0)
        
        print(f"📊 Après: {df_clean.shape}\n")
        return df_clean


def preprocess_prediction(df: pd.DataFrame) -> np.ndarray:
    """
    Préprocesse données pour PRÉDICTION (sans Label)
    
    Utilisé pour:
    - capture_network()
    - upload_analyze()
    """
    df_clean = DataPreprocessor.clean_data(df)
    X = df_clean.values
    return X


def load_dataset(file_path):
    """Charge dataset depuis CSV ou Parquet"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    if file_path.endswith('.parquet'):
        return pd.read_parquet(file_path)
    elif file_path.endswith('.csv'):
        return pd.read_csv(file_path)
    else:
        raise ValueError("Format non supporté. Utilisez CSV ou Parquet.")


def normalize_features(X):
    """Normalise les features"""
    scaler = StandardScaler()
    return scaler.fit_transform(X)