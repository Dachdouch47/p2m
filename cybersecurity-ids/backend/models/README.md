# Place your trained model files here

## Required files:
1. **detector_model.pkl** - Your trained ML model (scikit-learn compatible)
2. **scaler.pkl** - Your StandardScaler object for feature normalization

## How to save your model:

```python
import joblib

# After training your model
joblib.dump(your_model, 'detector_model.pkl')
joblib.dump(your_scaler, 'scaler.pkl')
```

## Expected model interface:
```python
# The model should support:
predictions = model.predict(X_scaled)  # Returns binary predictions (0 or 1)

# The scaler should support:
X_scaled = scaler.transform(X)  # Normalizes input features
```

For detailed integration instructions, see: `../MODEL_INTEGRATION_GUIDE.md`
