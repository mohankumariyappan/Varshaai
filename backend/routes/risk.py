from fastapi import APIRouter
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml_engine")))
from pipeline import pipeline_instance

router = APIRouter(prefix="/api/risk", tags=["Risk Radar"])

@router.get("/radar")
def get_risk_radar(lead_time: int = 24):
    all_preds = pipeline_instance.get_all_districts_forecast(lead_time=lead_time)
    
    # Categorize districts by alert level
    alerts = {"RED": [], "ORANGE": [], "YELLOW": [], "GREEN": []}
    
    for p in all_preds:
        level = p["risk_assessment"]["alert_level"]
        alerts[level].append({
            "district_id": p["district_id"],
            "district_name": p["district_name"],
            "state": p["state"],
            "rainfall": p["corrected_rainfall"],
            "heavy_prob": p["heavy_rain_probability"],
            "regime": p["detected_regime"],
            "risk_index": p["risk_assessment"]["risk_index"]
        })
        
    # High risk summary
    high_risk_count = len(alerts["RED"]) + len(alerts["ORANGE"])
    max_rainfall = max(p["corrected_rainfall"] for p in all_preds)
    max_prob = max(p["heavy_rain_probability"] for p in all_preds)
    
    return {
        "lead_time": lead_time,
        "summary": {
            "high_risk_districts_count": high_risk_count,
            "max_corrected_rainfall": max_rainfall,
            "max_heavy_probability": max_prob,
            "extreme_event_mode": high_risk_count >= 2
        },
        "radar_components": [
            {"dimension": "Rainfall Severity", "score": 88, "status": "HIGH"},
            {"dimension": "Heavy Rain Probability", "score": 89, "status": "HIGH"},
            {"dimension": "Forecast Persistence", "score": 75, "status": "MODERATE"},
            {"dimension": "Regime Threat Level", "score": 92, "status": "CRITICAL"},
            {"dimension": "Forecast Certainty", "score": 84, "status": "HIGH (LOW SPREAD)"}
        ],
        "district_alerts": alerts
    }
