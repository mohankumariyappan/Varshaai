export type WeatherRegime = 
  | "Active Monsoon"
  | "Break Monsoon"
  | "Monsoon Depression"
  | "Coastal System"
  | "Orographic Rainfall"
  | "Western Disturbance"
  | "Localized Convective";

export type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

export interface AtmosphericMetric {
  value: number;
  unit: string;
  assessment: string;
}

export interface AtmosphericProfile {
  pressure_anomaly: AtmosphericMetric;
  humidity_850: AtmosphericMetric;
  wind_convergence: AtmosphericMetric;
  moisture_flux: AtmosphericMetric;
  cape: AtmosphericMetric;
}

export interface UncertaintyInterval {
  lower_bound: number;
  upper_bound: number;
  confidence_level: string;
}

export interface RiskAssessment {
  risk_index: number;
  alert_level: AlertLevel;
  action_recommendation: string;
}

export interface FeatureExplanation {
  feature: string;
  contribution: number;
  description: string;
}

export interface TimelinePoint {
  lead_time: string;
  hours: number;
  nwp_rainfall: number;
  corrected_rainfall: number;
  lower_bound: number;
  upper_bound: number;
  heavy_rain_probability: number;
  regime: string;
}

export interface DistrictForecast {
  district_id: string;
  district_name: string;
  state: string;
  subdivision: string;
  lat: number;
  lon: number;
  elevation: number;
  is_coastal: boolean;
  lead_time: number;
  detected_regime: WeatherRegime;
  regime_confidence: number;
  model_selected: string;
  atmospheric_profile: AtmosphericProfile;
  raw_nwp: number;
  corrected_rainfall: number;
  change: number;
  heavy_rain_probability: number;
  uncertainty_interval: UncertaintyInterval;
  risk_assessment: RiskAssessment;
  explanation: FeatureExplanation[];
  timeline: TimelinePoint[];
  last_updated: string;
}

export interface MapFeatureProperties {
  district_id: string;
  district_name: string;
  state: string;
  subdivision: string;
  lead_time: number;
  ai_corrected_rainfall: number;
  raw_nwp_rainfall: number;
  observed_rainfall: number;
  heavy_rain_probability: number;
  weather_regime: WeatherRegime;
  regime_confidence: number;
  forecast_error: number;
  alert_level: AlertLevel;
  risk_index: number;
}

export interface MapFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
  properties: MapFeatureProperties;
}

export interface MapLayersResponse {
  type: string;
  lead_time: number;
  features: MapFeature[];
}

export interface HistoricalEvent {
  id: string;
  title: string;
  date: string;
  region: string;
  regime: string;
  nwp_rainfall: number;
  varshaai_rainfall: number;
  observed_rainfall: number;
  heavy_rain_prob: number;
  nwp_error: number;
  varshaai_error: number;
  description: string;
}

export interface ReplayStage {
  stage_number: number;
  stage_title: string;
  timestamp: string;
  status: string;
  details: Record<string, any>;
}

export interface ReplayResponse {
  event: HistoricalEvent;
  stages: ReplayStage[];
}

export interface VerificationSkillsResponse {
  status: string;
  dataset_split: {
    training_samples: number;
    validation_samples: number;
    unseen_test_samples: number;
    split_ratio: string;
  };
  metrics: {
    continuous: {
      rmse: { nwp: number; varshaai: number; unit: string };
      mae: { nwp: number; varshaai: number; unit: string };
      bias: { nwp: number; varshaai: number; unit: string };
      correlation: { nwp: number; varshaai: number; unit: string };
    };
    categorical: {
      csi: { nwp: number; varshaai: number; unit: string };
      pod: { nwp: number; varshaai: number; unit: string };
      far: { nwp: number; varshaai: number; unit: string };
    };
    probabilistic: {
      brier_score: { nwp: number; varshaai: number };
      fss: { nwp: number; varshaai: number };
    };
    test_sample_count: number;
    regime_classifier_accuracy: number;
  };
  lead_time_degradation: Array<{
    lead_time: string;
    nwp_rmse: number;
    varshaai_rmse: number;
    improvement: number;
  }>;
  calibration_curve: Array<{
    forecast_bin: string;
    observed_frequency: number;
    nwp_frequency: number;
  }>;
}

export interface ModelHealthResponse {
  status: string;
  last_updated: string;
  system_status: {
    data_pipeline: string;
    nwp_ingestion: string;
    ai_inference_engine: string;
    database: string;
  };
  models: Array<{
    name: string;
    type: string;
    version: string;
    status: string;
    accuracy?: string;
    rmse_test?: string;
    brier_score?: string;
    coverage?: string;
    latency_ms: number;
    last_validated: string;
  }>;
  data_quality: {
    freshness: string;
    missing_values_rate: string;
    ingestion_frequency: string;
    average_pipeline_latency_ms: number;
    feature_drift_status: string;
    drift_score_p_value: number;
  };
}
