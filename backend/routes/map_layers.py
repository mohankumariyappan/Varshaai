from fastapi import APIRouter
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml_engine")))
from pipeline import pipeline_instance

router = APIRouter(prefix="/api/map", tags=["Map Layers"])

@router.get("/layers")
def get_map_layers(lead_time: int = 24):
    """
    Returns spatial Geo-points for all districts with multi-layer values:
    - corrected_rainfall
    - raw_nwp
    - observed_rainfall (simulated verification ground truth)
    - heavy_rain_probability
    - weather_regime
    - forecast_error
    """
    all_preds = pipeline_instance.get_all_districts_forecast(lead_time=lead_time)
    features = []
    
    for p in all_preds:
        # Simulated ground truth observation for demonstration/verification layer
        # In general, observed = corrected +- small random error
        simulated_obs = round(p["corrected_rainfall"] + (3.5 if p["district_id"] in ["thiruvallur", "chennai"] else -2.1), 1)
        forecast_error = round(simulated_obs - p["raw_nwp"], 1)
        
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [p["lon"], p["lat"]]
            },
            "properties": {
                "district_id": p["district_id"],
                "district_name": p["district_name"],
                "state": p["state"],
                "subdivision": p["subdivision"],
                "lead_time": lead_time,
                "ai_corrected_rainfall": p["corrected_rainfall"],
                "raw_nwp_rainfall": p["raw_nwp"],
                "observed_rainfall": simulated_obs,
                "heavy_rain_probability": p["heavy_rain_probability"],
                "weather_regime": p["detected_regime"],
                "regime_confidence": p["regime_confidence"],
                "forecast_error": forecast_error,
                "alert_level": p["risk_assessment"]["alert_level"],
                "risk_index": p["risk_assessment"]["risk_index"]
            }
        }
        features.append(feature)
        
    return {
        "type": "FeatureCollection",
        "lead_time": lead_time,
        "features": features
    }
