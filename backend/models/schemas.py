"""
Pydantic Schemas for VARSHAAI API
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class WeatherCustomInput(BaseModel):
    pressure_anomaly: Optional[float] = None
    humidity_850: Optional[float] = None
    wind_convergence: Optional[float] = None
    moisture_flux: Optional[float] = None
    cape: Optional[float] = None
    nwp_rainfall: Optional[float] = None
    is_extreme_simulation: Optional[bool] = None

class PredictionRequest(BaseModel):
    district_id: str = "thiruvallur"
    lead_time: int = 24
    custom_weather: Optional[WeatherCustomInput] = None

class AtmosphericMetric(BaseModel):
    value: float
    unit: str
    assessment: str

class AtmosphericProfile(BaseModel):
    pressure_anomaly: AtmosphericMetric
    humidity_850: AtmosphericMetric
    wind_convergence: AtmosphericMetric
    moisture_flux: AtmosphericMetric
    cape: AtmosphericMetric

class UncertaintyInterval(BaseModel):
    lower_bound: float
    upper_bound: float
    confidence_level: str

class RiskAssessment(BaseModel):
    risk_index: int
    alert_level: str
    action_recommendation: str

class FeatureExplanation(BaseModel):
    feature: str
    contribution: float
    description: str

class TimelinePoint(BaseModel):
    lead_time: str
    hours: int
    nwp_rainfall: float
    corrected_rainfall: float
    lower_bound: float
    upper_bound: float
    heavy_rain_probability: float
    regime: str

class DistrictPredictionResponse(BaseModel):
    district_id: str
    district_name: str
    state: str
    subdivision: str
    lat: float
    lon: float
    elevation: int
    is_coastal: bool
    lead_time: int
    detected_regime: str
    regime_confidence: float
    model_selected: str
    atmospheric_profile: AtmosphericProfile
    raw_nwp: float
    corrected_rainfall: float
    change: float
    heavy_rain_probability: float
    uncertainty_interval: UncertaintyInterval
    risk_assessment: RiskAssessment
    explanation: List[FeatureExplanation]
    timeline: List[TimelinePoint]
    last_updated: str
