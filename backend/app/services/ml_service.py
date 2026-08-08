import datetime
import math
import random
from typing import Dict, List, Any

# Try to import ML libraries; if unavailable in environment (e.g., due to Python 3.14 missing wheels), fallback
try:
    import pandas as pd
    import numpy as np
    from sklearn.ensemble import RandomForestRegressor
    import xgboost as xgb
    from prophet import Prophet
    import shap
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("Warning: ML libraries (pandas, scikit-learn, xgboost, prophet, shap) are not fully installed. Using fallback pipeline.")

class MLService:
    def __init__(self):
        self.models = {}

    def prepare_time_series_data(self, skill_name: str, historical_data: List[Dict[str, Any]]):
        """Prepare data for Prophet time-series forecasting."""
        if not ML_AVAILABLE:
            return None
        
        # historical_data: [{"ds": "2023-01-01", "y": 45.0}, ...]
        df = pd.DataFrame(historical_data)
        return df

    def train_demand_forecast_model(self, skill_name: str, historical_data: List[Dict[str, Any]]):
        """Train Prophet model for skill demand."""
        if not ML_AVAILABLE:
            return None
            
        df = self.prepare_time_series_data(skill_name, historical_data)
        model = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=False)
        model.fit(df)
        self.models[f"prophet_{skill_name}"] = model
        return model

    def predict_skill_demand(self, skill_name: str, months_ahead: int) -> List[Dict[str, Any]]:
        """Predict future skill demand using Prophet or Fallback."""
        if ML_AVAILABLE and f"prophet_{skill_name}" in self.models:
            model = self.models[f"prophet_{skill_name}"]
            future = model.make_future_dataframe(periods=months_ahead * 30, freq='D')
            forecast = model.predict(future)
            # Extract just the monthly points for simplicity
            monthly = forecast[forecast['ds'].dt.is_month_end]
            return [{"date": row['ds'].strftime("%Y-%m-%d"), "demand": round(row['yhat'], 2)} for _, row in monthly.iterrows()][-months_ahead:]
        
        # Fallback simulation
        results = []
        base = random.uniform(50, 90)
        trend = random.uniform(-2, 5)
        for i in range(1, months_ahead + 1):
            date = datetime.date.today() + datetime.timedelta(days=30*i)
            # Add some sine wave seasonality
            seasonality = math.sin(i) * 5
            base += trend
            results.append({
                "date": date.strftime("%Y-%m-%d"),
                "demand": max(0.0, min(100.0, round(base + seasonality, 2)))
            })
        return results

    def train_readiness_model(self, X_train, y_train):
        """Train XGBoost model to predict employee readiness."""
        if not ML_AVAILABLE:
            return None
            
        model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100)
        model.fit(X_train, y_train)
        self.models["xgb_readiness"] = model
        return model

    def explain_prediction(self, model, X):
        """Generate SHAP values for model explainability."""
        if not ML_AVAILABLE:
            return {"feature_importance": {"skill_gap": 0.45, "learning_velocity": 0.35, "certifications": 0.20}}
            
        explainer = shap.Explainer(model)
        shap_values = explainer(X)
        
        # Mock aggregation for return format
        return {"shap_values_mean": np.abs(shap_values.values).mean(axis=0).tolist()}

ml_service = MLService()
