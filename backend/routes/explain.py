from fastapi import APIRouter, HTTPException
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml_engine")))
from pipeline import pipeline_instance

router = APIRouter(prefix="/api/explain", tags=["Explainability"])

@router.get("/{district_id}")
def explain_district_forecast(district_id: str):
    if district_id not in pipeline_instance.districts_by_id:
        raise HTTPException(status_code=404, detail="District not found")
        
    pred = pipeline_instance.predict_single(district_id)
    
    return {
        "district_id": district_id,
        "district_name": pred["district_name"],
        "detected_regime": pred["detected_regime"],
        "raw_nwp": pred["raw_nwp"],
        "corrected_rainfall": pred["corrected_rainfall"],
        "total_change": pred["change"],
        "model_selected": pred["model_selected"],
        "explanation_factors": pred["explanation"],
        "meteorological_rationale": (
            f"The prevailing synoptic environment over {pred['district_name']} is categorized into the "
            f"'{pred['detected_regime']}' regime with {int(pred['regime_confidence']*100)}% confidence. "
            f"Global NWP models typically under-represent meso-convective precipitation cores under these conditions. "
            f"VARSHAAI applied the {pred['model_selected']}, adjusting the raw {pred['raw_nwp']} mm forecast by "
            f"{'+' if pred['change'] >= 0 else ''}{pred['change']} mm to {pred['corrected_rainfall']} mm based on "
            f"elevated moisture transport and low-level wind convergence."
        )
    }
