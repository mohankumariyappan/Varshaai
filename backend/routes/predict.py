from fastapi import APIRouter, HTTPException
from typing import List, Optional
import sys
import os

# Add ml_engine to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml_engine")))
from pipeline import pipeline_instance
from models.schemas import PredictionRequest, DistrictPredictionResponse

router = APIRouter(prefix="/api", tags=["Prediction"])

@router.post("/predict", response_model=DistrictPredictionResponse)
def predict_district(req: PredictionRequest):
    custom = req.custom_weather.dict() if req.custom_weather else None
    result = pipeline_instance.predict_single(
        district_id=req.district_id,
        lead_time=req.lead_time,
        custom_weather=custom
    )
    return result

@router.get("/districts")
def get_districts():
    return list(pipeline_instance.districts_by_id.values())

@router.get("/district/{district_id}", response_model=DistrictPredictionResponse)
def get_district_prediction(district_id: str, lead_time: int = 24):
    if district_id not in pipeline_instance.districts_by_id:
        raise HTTPException(status_code=404, detail="District not found")
    return pipeline_instance.predict_single(district_id=district_id, lead_time=lead_time)

@router.get("/predictions/all")
def get_all_predictions(lead_time: int = 24):
    return pipeline_instance.get_all_districts_forecast(lead_time=lead_time)
