"""
VARSHAAI - Synthetic & Benchmark Meteorological Dataset Generator
Generates physically consistent meteorological variables, NWP forecasts,
observed rainfalls, and weather regimes across key Indian districts.
"""

import numpy as np
import json
import os
from typing import Dict, List, Tuple

# Key Indian Districts representing various meteorological regimes
DISTRICTS = [
    {
        "id": "thiruvallur",
        "name": "Thiruvallur",
        "state": "Tamil Nadu",
        "lat": 13.14,
        "lon": 79.91,
        "elevation": 38,
        "coastal": True,
        "subdivision": "Tamil Nadu & Puducherry",
        "dominant_regimes": ["Coastal System", "Monsoon Depression", "Active Monsoon"]
    },
    {
        "id": "chennai",
        "name": "Chennai",
        "state": "Tamil Nadu",
        "lat": 13.08,
        "lon": 80.27,
        "elevation": 7,
        "coastal": True,
        "subdivision": "Tamil Nadu & Puducherry",
        "dominant_regimes": ["Coastal System", "Monsoon Depression", "Localized Convective"]
    },
    {
        "id": "cuddalore",
        "name": "Cuddalore",
        "state": "Tamil Nadu",
        "lat": 11.75,
        "lon": 79.76,
        "elevation": 6,
        "coastal": True,
        "subdivision": "Tamil Nadu & Puducherry",
        "dominant_regimes": ["Coastal System", "Monsoon Depression"]
    },
    {
        "id": "wayanad",
        "name": "Wayanad",
        "state": "Kerala",
        "lat": 11.68,
        "lon": 76.13,
        "elevation": 950,
        "coastal": False,
        "subdivision": "Kerala & Mahe",
        "dominant_regimes": ["Orographic Rainfall", "Active Monsoon"]
    },
    {
        "id": "mumbai",
        "name": "Mumbai",
        "state": "Maharashtra",
        "lat": 19.07,
        "lon": 72.87,
        "elevation": 14,
        "coastal": True,
        "subdivision": "Konkan & Goa",
        "dominant_regimes": ["Active Monsoon", "Coastal System", "Monsoon Depression"]
    },
    {
        "id": "pune",
        "name": "Pune",
        "state": "Maharashtra",
        "lat": 18.52,
        "lon": 73.85,
        "elevation": 560,
        "coastal": False,
        "subdivision": "Madhya Maharashtra",
        "dominant_regimes": ["Orographic Rainfall", "Active Monsoon", "Break Monsoon"]
    },
    {
        "id": "bhubaneswar",
        "name": "Bhubaneswar",
        "state": "Odisha",
        "lat": 20.29,
        "lon": 85.82,
        "elevation": 45,
        "coastal": True,
        "subdivision": "Odisha",
        "dominant_regimes": ["Monsoon Depression", "Active Monsoon"]
    },
    {
        "id": "kolkata",
        "name": "Kolkata",
        "state": "West Bengal",
        "lat": 22.57,
        "lon": 88.36,
        "elevation": 9,
        "coastal": True,
        "subdivision": "Gangetic West Bengal",
        "dominant_regimes": ["Monsoon Depression", "Active Monsoon", "Localized Convective"]
    },
    {
        "id": "shimla",
        "name": "Shimla",
        "state": "Himachal Pradesh",
        "lat": 31.10,
        "lon": 77.17,
        "elevation": 2206,
        "coastal": False,
        "subdivision": "Himachal Pradesh",
        "dominant_regimes": ["Western Disturbance", "Orographic Rainfall"]
    },
    {
        "id": "srinagar",
        "name": "Srinagar",
        "state": "Jammu & Kashmir",
        "lat": 34.08,
        "lon": 74.79,
        "elevation": 1585,
        "coastal": False,
        "subdivision": "Jammu & Kashmir",
        "dominant_regimes": ["Western Disturbance"]
    },
    {
        "id": "nagpur",
        "name": "Nagpur",
        "state": "Maharashtra",
        "lat": 21.14,
        "lon": 79.08,
        "elevation": 310,
        "coastal": False,
        "subdivision": "Vidarbha",
        "dominant_regimes": ["Active Monsoon", "Break Monsoon", "Monsoon Depression"]
    },
    {
        "id": "bhopal",
        "name": "Bhopal",
        "state": "Madhya Pradesh",
        "lat": 23.25,
        "lon": 77.41,
        "elevation": 527,
        "coastal": False,
        "subdivision": "West Madhya Pradesh",
        "dominant_regimes": ["Active Monsoon", "Break Monsoon", "Monsoon Depression"]
    },
    {
        "id": "bengaluru",
        "name": "Bengaluru Urban",
        "state": "Karnataka",
        "lat": 12.97,
        "lon": 77.59,
        "elevation": 920,
        "coastal": False,
        "subdivision": "South Interior Karnataka",
        "dominant_regimes": ["Localized Convective", "Break Monsoon", "Active Monsoon"]
    },
    {
        "id": "guwahati",
        "name": "Kamrup Metropolitan (Guwahati)",
        "state": "Assam",
        "lat": 26.14,
        "lon": 91.73,
        "elevation": 55,
        "coastal": False,
        "subdivision": "Assam & Meghalaya",
        "dominant_regimes": ["Active Monsoon", "Orographic Rainfall", "Monsoon Depression"]
    },
    {
        "id": "ahmedabad",
        "name": "Ahmedabad",
        "state": "Gujarat",
        "lat": 23.02,
        "lon": 72.57,
        "elevation": 53,
        "coastal": False,
        "subdivision": "Gujarat Region",
        "dominant_regimes": ["Monsoon Depression", "Break Monsoon", "Active Monsoon"]
    },
    {
        "id": "visakhapatnam",
        "name": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "lat": 17.68,
        "lon": 83.21,
        "elevation": 45,
        "coastal": True,
        "subdivision": "Coastal Andhra Pradesh",
        "dominant_regimes": ["Coastal System", "Monsoon Depression"]
    }
]

REGIMES = [
    "Active Monsoon",
    "Break Monsoon",
    "Monsoon Depression",
    "Coastal System",
    "Orographic Rainfall",
    "Western Disturbance",
    "Localized Convective"
]

# Atmospheric profile distributions per regime
REGIME_PROFILES = {
    "Active Monsoon": {
        "pressure_anomaly": (-4.0, 1.5),      # mean, std (hPa)
        "humidity_850": (88.0, 4.0),           # %
        "wind_convergence": (7.5, 1.5),        # 10^-5 s^-1
        "moisture_flux": (38.0, 5.0),          # g/kg * m/s
        "cape": (1800.0, 400.0),               # J/kg
        "nwp_bias_mean": -18.0,                # NWP tends to underestimate active heavy spells
        "nwp_bias_std": 12.0
    },
    "Break Monsoon": {
        "pressure_anomaly": (3.5, 1.2),
        "humidity_850": (55.0, 6.0),
        "wind_convergence": (-2.0, 1.0),
        "moisture_flux": (14.0, 3.0),
        "cape": (600.0, 200.0),
        "nwp_bias_mean": 6.0,                  # NWP often overestimates rainfall in dry break
        "nwp_bias_std": 4.0
    },
    "Monsoon Depression": {
        "pressure_anomaly": (-9.0, 2.5),       # Deep negative anomaly
        "humidity_850": (94.0, 3.0),
        "wind_convergence": (12.0, 2.5),       # Very high convergence
        "moisture_flux": (52.0, 6.0),          # Extremely strong moisture influx
        "cape": (2400.0, 500.0),
        "nwp_bias_mean": -32.0,                # NWP severely underpredicts localized torrential cores
        "nwp_bias_std": 16.0
    },
    "Coastal System": {
        "pressure_anomaly": (-3.0, 1.8),
        "humidity_850": (86.0, 5.0),
        "wind_convergence": (8.0, 2.0),
        "moisture_flux": (44.0, 5.0),
        "cape": (2100.0, 450.0),
        "nwp_bias_mean": -22.0,                # Coastal convergence bands often underforecast
        "nwp_bias_std": 14.0
    },
    "Orographic Rainfall": {
        "pressure_anomaly": (-1.5, 1.5),
        "humidity_850": (90.0, 4.0),
        "wind_convergence": (6.0, 1.8),
        "moisture_flux": (40.0, 6.0),
        "cape": (1400.0, 350.0),
        "nwp_bias_mean": -28.0,                # Orographic enhancement on windward slopes missed by coarse NWP
        "nwp_bias_std": 15.0
    },
    "Western Disturbance": {
        "pressure_anomaly": (-6.5, 2.0),
        "humidity_850": (72.0, 7.0),
        "wind_convergence": (5.5, 1.6),
        "moisture_flux": (26.0, 4.0),
        "cape": (1100.0, 300.0),
        "nwp_bias_mean": -14.0,
        "nwp_bias_std": 10.0
    },
    "Localized Convective": {
        "pressure_anomaly": (0.0, 2.0),
        "humidity_850": (70.0, 8.0),
        "wind_convergence": (4.0, 2.0),
        "moisture_flux": (22.0, 5.0),
        "cape": (3200.0, 600.0),               # High CAPE, thunderstorm potential
        "nwp_bias_mean": -15.0,                # High spatial miss rate
        "nwp_bias_std": 18.0
    }
}


def generate_meteorological_dataset(n_samples: int = 5000, random_seed: int = 42) -> Tuple[dict, dict]:
    """
    Generates realistic atmospheric features, NWP forecasts, and ground truth observations
    stratified by district characteristics and prevailing weather regimes.
    """
    np.random.seed(random_seed)
    
    records = []
    
    for i in range(n_samples):
        # Pick a district
        district = DISTRICTS[np.random.randint(0, len(DISTRICTS))]
        
        # Decide regime: 75% chance one of its dominant regimes, 25% chance general
        if np.random.rand() < 0.75:
            regime = np.random.choice(district["dominant_regimes"])
        else:
            regime = np.random.choice(REGIMES)
            
        profile = REGIME_PROFILES[regime]
        
        # Atmospheric features
        pressure_anomaly = float(np.random.normal(profile["pressure_anomaly"][0], profile["pressure_anomaly"][1]))
        humidity_850 = float(np.clip(np.random.normal(profile["humidity_850"][0], profile["humidity_850"][1]), 30.0, 100.0))
        wind_convergence = float(np.random.normal(profile["wind_convergence"][0], profile["wind_convergence"][1]))
        moisture_flux = float(np.clip(np.random.normal(profile["moisture_flux"][0], profile["moisture_flux"][1]), 2.0, 70.0))
        cape = float(np.clip(np.random.normal(profile["cape"][0], profile["cape"][1]), 100.0, 5000.0))
        
        # Lead time in hours (6, 12, 18, 24, 36, 48)
        lead_time = int(np.random.choice([6, 12, 18, 24, 36, 48]))
        
        # Base true rainfall generation depending on regime, elevation, coastal, and moisture
        if regime == "Break Monsoon":
            base_rain = np.random.exponential(scale=3.0)
        elif regime == "Monsoon Depression":
            base_rain = np.random.gamma(shape=3.5, scale=28.0) + (15.0 if district["coastal"] else 0.0)
        elif regime == "Orographic Rainfall":
            orographic_boost = (district["elevation"] / 1000.0) * 25.0
            base_rain = np.random.gamma(shape=3.0, scale=22.0) + orographic_boost
        elif regime == "Coastal System":
            base_rain = np.random.gamma(shape=3.0, scale=24.0) + (20.0 if district["coastal"] else 5.0)
        elif regime == "Active Monsoon":
            base_rain = np.random.gamma(shape=2.8, scale=18.0)
        elif regime == "Western Disturbance":
            base_rain = np.random.gamma(shape=2.5, scale=14.0) + (district["lat"] - 20) * 1.5
        else: # Localized Convective
            base_rain = np.random.exponential(scale=20.0) if np.random.rand() < 0.4 else np.random.exponential(scale=2.0)
            
        observed_rainfall = max(0.0, float(base_rain))
        
        # Simulate NWP forecast with regime-specific bias and lead-time dispersion
        # Lead-time factor: longer lead time = larger variance
        lead_factor = 1.0 + (lead_time / 48.0) * 0.4
        
        # Error = Observed - NWP  =>  NWP = Observed - Error
        # In reality, NWP = Observed - (bias + noise)
        bias_mean = profile["nwp_bias_mean"]
        bias_std = profile["nwp_bias_std"] * lead_factor
        
        simulated_error = float(np.random.normal(bias_mean, bias_std))
        
        # NWP forecast cannot be negative
        nwp_rainfall = max(0.0, observed_rainfall - simulated_error)
        
        # Actual error is Observed - NWP
        true_error = observed_rainfall - nwp_rainfall
        
        # Heavy rain label (> 64.5 mm IMD standard)
        is_heavy_rain = int(observed_rainfall >= 64.5)
        
        records.append({
            "district_id": district["id"],
            "district_name": district["name"],
            "state": district["state"],
            "lat": district["lat"],
            "lon": district["lon"],
            "elevation": district["elevation"],
            "is_coastal": int(district["coastal"]),
            "lead_time": lead_time,
            "pressure_anomaly": round(pressure_anomaly, 2),
            "humidity_850": round(humidity_850, 1),
            "wind_convergence": round(wind_convergence, 2),
            "moisture_flux": round(moisture_flux, 2),
            "cape": round(cape, 1),
            "nwp_rainfall": round(nwp_rainfall, 1),
            "observed_rainfall": round(observed_rainfall, 1),
            "true_error": round(true_error, 1),
            "regime": regime,
            "is_heavy_rain": is_heavy_rain
        })
        
    # Split into 70% Train, 15% Validation, 15% Test
    np.random.shuffle(records)
    n_train = int(0.70 * n_samples)
    n_val = int(0.15 * n_samples)
    
    train_data = records[:n_train]
    val_data = records[n_train:n_train+n_val]
    test_data = records[n_train+n_val:]
    
    return {
        "train": train_data,
        "val": val_data,
        "test": test_data,
        "districts": DISTRICTS,
        "regimes": REGIMES
    }


if __name__ == "__main__":
    os.makedirs("ml_engine/data", exist_ok=True)
    dataset = generate_meteorological_dataset(n_samples=6000)
    
    with open("ml_engine/data/meteorological_benchmark.json", "w") as f:
        json.dump(dataset, f, indent=2)
        
    print(f"Generated benchmark dataset with {len(dataset['train'])} train, "
          f"{len(dataset['val'])} val, {len(dataset['test'])} test samples across {len(DISTRICTS)} districts.")
