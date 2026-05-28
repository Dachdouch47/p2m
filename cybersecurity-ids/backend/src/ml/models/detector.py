from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
import joblib
import os
from typing import Tuple, Union, Dict

class IntrusionDetector:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.metrics = {}
        # Chemin absolu vers votre modèle .pkl
        self.model_path = os.path.join(os.path.dirname(__file__), "detector_model.pkl")
        self.load_model()  # 👈 CHARGE LE MODELE ICI
    
    def load_model(self):
        """Charge le modèle .pkl s'il existe"""
        try:
            if os.path.exists(self.model_path):
                loaded_data = joblib.load(self.model_path)
                
                # Si votre .pkl contient juste le modèle
                if isinstance(loaded_data, dict):
                    self.model = loaded_data.get('model', self.model)
                    self.scaler = loaded_data.get('scaler', self.scaler)
                    self.is_trained = True
                else:
                    # Si votre .pkl est le modèle directement (votre cas)
                    self.model = loaded_data
                    self.is_trained = True
                
                print(f"✅ Modèle chargé: {self.model_path}")
            else:
                print(f"⚠️ Modèle non trouvé: {self.model_path}")
        except Exception as e:
            print(f"❌ Erreur lors du chargement: {e}")
    
    def predict(self, X: Union[np.ndarray, pd.DataFrame]) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prédiction sur les données
        
        Args:
            X: np.ndarray ou DataFrame préprocessé
            
        Returns:
            Tuple (predictions, probabilities)
        """
        if not self.is_trained:
            raise Exception("Le modèle n'est pas entraîné")
        
        # Conversion DataFrame → numpy si nécessaire
        if isinstance(X, pd.DataFrame):
            X = X.values
        
        # Si le scaler n'est pas fit, on le fit sur les données
        if not hasattr(self.scaler, 'scale_'):
            print("⚠️ Scaler non fit, fitting sur les données actuelles...")
            self.scaler.fit(X)
        
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        probabilities = self.model.predict_proba(X_scaled)
        
        return predictions, probabilities
    
    def predict_single(self, row: Dict) -> Dict:
        """
        Prédiction sur un seul flux réseau
        
        Args:
            row: Dict avec features du flux
            
        Returns:
            Dict avec résultat
        """
        if not self.is_trained:
            raise Exception("Le modèle n'est pas entraîné")
        
        # Conversion en DataFrame
        df = pd.DataFrame([row])
        X = df.values.reshape(1, -1)
        
        # Prédiction
        X_scaled = self.scaler.transform(X)
        prediction = self.model.predict(X_scaled)[0]
        probability = self.model.predict_proba(X_scaled)[0]
        
        return {
            'verdict': 'Attack' if prediction == 1 else 'Benign',
            'confidence': float(probability[1]),  # Probabilité d'attaque
            'prediction_id': prediction
        }