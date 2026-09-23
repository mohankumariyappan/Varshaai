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

// Next-Gen Urban Inundation & Dam Twin Types
export interface InundationHotspot {
  location: string;
  type: string;
  depth_cm: number;
  status: 'CLEAR' | 'CAUTION' | 'IMPASSABLE';
  trafficability: string;
  badge_color: 'GREEN' | 'YELLOW' | 'RED';
  submersible_pumps_needed: number;
}

export interface UrbanInundationResponse {
  district_id: string;
  city_name: string;
  lead_time: number;
  corrected_rainfall_mm: number;
  detected_regime: string;
  soil_saturation_pct: number;
  overall_inundation_severity: 'LOW' | 'MODERATE' | 'EXTREME';
  impassable_routes_count: number;
  caution_routes_count: number;
  total_monitored_points: number;
  hotspots: InundationHotspot[];
  recession_estimated_hrs: number;
  de_watering_action: string;
}

export interface ReservoirItem {
  name: string;
  full_capacity_tmc: number;
  current_storage_tmc: number;
  storage_percentage: number;
  current_level_ft: number;
  max_level_ft: number;
  projected_inflow_cumecs: number;
  worst_case_inflow_cumecs: number;
  recommended_discharge_cumecs: number;
  operational_directive: string;
  danger_lead_time_hrs: number;
  alert_level: 'GREEN' | 'ORANGE' | 'RED' | 'HIGH ALERT' | 'WATCH' | 'CRITICAL';
}

export interface ReservoirsResponse {
  district_id: string;
  lead_time: number;
  rainfall_driver_mm: number;
  catchment_regime: string;
  reservoirs: ReservoirItem[];
  downstream_floodplain_warning: string;
}

// Next-Gen NDMA CAP Alert & Logistics Types
export interface CAPAlertResponse {
  identifier: string;
  format: string;
  sent_utc: string;
  status: string;
  msgType: string;
  scope: string;
  event: string;
  severity: string;
  urgency: string;
  certainty: string;
  headline: string;
  description: string;
  instruction: string;
  district: string;
  state: string;
  coordinates: { lat: number; lon: number };
  xml_payload: string;
}

export interface MultilingualBroadcastsResponse {
  district_id: string;
  alert_level: string;
  corrected_rainfall_mm: number;
  detected_regime: string;
  broadcasts: Record<string, { language: string; script: string; text: string }>;
}

export interface DisasterLogisticsResponse {
  district_id: string;
  district_name: string;
  alert_level: string;
  ndrf_battalion: {
    teams_deployed: number;
    personnel_count: number;
    staging_base: string;
    readiness_state: string;
  };
  heavy_equipment: {
    dewatering_pumps_100hp: number;
    inflatable_inundation_boats: number;
    generator_sets_kva: number;
    mobile_medical_vans: number;
  };
  shelter_infrastructure: {
    active_shelters: number;
    total_bed_capacity: number;
    current_occupancy_pct: number;
    food_packets_prepared: number;
  };
}

// Next-Gen AI Meteorologist Copilot
export interface CopilotQueryResponse {
  query: string;
  district_id: string;
  district_name: string;
  lead_time: number;
  category: string;
  answer_markdown: string;
  grounding_telemetry: {
    regime: string;
    corrected_rain_mm: number;
    nwp_bias_mm: number;
    alert_level: string;
    uncertainty_interval: string;
  };
}

