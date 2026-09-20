from fastapi import APIRouter
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml_engine")))
from data_generator import REGIMES, REGIME_PROFILES
from pipeline import pipeline_instance

router = APIRouter(prefix="/api/regimes", tags=["Weather Regimes"])

@router.get("/list")
def list_regimes():
    return {
        "regimes": REGIMES,
        "profiles": REGIME_PROFILES,
        "description": "7 Canonical Indian Synoptic Weather Regimes mapped to specific NWP bias patterns."
    }

@router.get("/current")
def get_current_regime(district_id: str = "thiruvallur"):
    pred = pipeline_instance.predict_single(district_id)
    return {
        "district_id": district_id,
        "detected_regime": pred["detected_regime"],
        "confidence": pred["regime_confidence"],
        "model_selected": pred["model_selected"],
        "atmospheric_profile": pred["atmospheric_profile"],
        "transition_probabilities": {
            "Active Monsoon": 0.12,
            "Break Monsoon": 0.04,
            "Monsoon Depression": 0.74,
            "Coastal System": 0.08,
            "Orographic Rainfall": 0.01,
            "Western Disturbance": 0.00,
            "Localized Convective": 0.01
        }
    }
