"""
VARSHAAI Next-Gen: Urban Inundation & Dam Reservoir Digital Twin
Calculates hyperlocal street-level waterlogging depth, road network passability,
and reservoir catchment inflow & proactive sluice-gate discharge optimization.
"""

from fastapi import APIRouter
from typing import Dict, Any, List
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml_engine")))
from pipeline import pipeline_instance

router = APIRouter(prefix="/api/hydro", tags=["Urban Inundation & Dam Twin"])

# District-specific hydrological profiles & reservoirs
HYDRO_PROFILES: Dict[str, Dict[str, Any]] = {
    "thiruvallur": {
        "city_name": "Thiruvallur & Avadi Metro Corridor",
        "soil_saturation_index": 0.88,
        "drainage_capacity_mm_hr": 14.5,
        "reservoirs": [
            {
                "name": "Poondi Reservoir",
                "full_capacity_tmc": 3.23,
                "current_storage_tmc": 2.89,
                "current_level_ft": 137.4,
                "max_level_ft": 140.0,
                "catchment_area_sqkm": 2040,
                "status": "CRITICAL",
                "current_inflow_cumecs": 1450,
                "recommended_outflow_cumecs": 1800,
                "danger_lead_time_hrs": 6
            },
            {
                "name": "Puzhal (Red Hills) Lake",
                "full_capacity_tmc": 3.30,
                "current_storage_tmc": 2.75,
                "current_level_ft": 48.6,
                "max_level_ft": 50.2,
                "catchment_area_sqkm": 850,
                "status": "WATCH",
                "current_inflow_cumecs": 680,
                "recommended_outflow_cumecs": 500,
                "danger_lead_time_hrs": 12
            }
        ],
        "vulnerable_hotspots": [
            {"location": "Pattabiram Railway Underpass", "type": "Underpass", "elevation_deficit_m": -2.4, "critical_threshold_cm": 25},
            {"location": "Avadi Market Road Corridor", "type": "Commercial Corridor", "elevation_deficit_m": -0.8, "critical_threshold_cm": 35},
            {"location": "Thirunindravur Lowland Colony", "type": "Residential Basin", "elevation_deficit_m": -1.6, "critical_threshold_cm": 20},
            {"location": "Kakkalur Industrial Estate Link", "type": "Arterial Road", "elevation_deficit_m": -0.5, "critical_threshold_cm": 30}
        ]
    },
    "chennai": {
        "city_name": "Greater Chennai Metropolitan Area",
        "soil_saturation_index": 0.94,
        "drainage_capacity_mm_hr": 16.0,
        "reservoirs": [
            {
                "name": "Chembarambakkam Lake",
                "full_capacity_tmc": 3.64,
                "current_storage_tmc": 3.28,
                "current_level_ft": 22.1,
                "max_level_ft": 24.0,
                "catchment_area_sqkm": 1720,
                "status": "CRITICAL",
                "current_inflow_cumecs": 2850,
                "recommended_outflow_cumecs": 3200,
                "danger_lead_time_hrs": 4
            },
            {
                "name": "Cholavaram Lake",
                "full_capacity_tmc": 1.08,
                "current_storage_tmc": 0.82,
                "current_level_ft": 59.8,
                "max_level_ft": 64.5,
                "catchment_area_sqkm": 420,
                "status": "WATCH",
                "current_inflow_cumecs": 420,
                "recommended_outflow_cumecs": 300,
                "danger_lead_time_hrs": 14
            }
        ],
        "vulnerable_hotspots": [
            {"location": "Gengu Reddy Subway, Egmore", "type": "Subway Underpass", "elevation_deficit_m": -2.8, "critical_threshold_cm": 20},
            {"location": "Velachery 100 Feet Road", "type": "Arterial Lowland", "elevation_deficit_m": -1.2, "critical_threshold_cm": 25},
            {"location": "T. Nagar Madley Subway", "type": "Subway Underpass", "elevation_deficit_m": -2.5, "critical_threshold_cm": 20},
            {"location": "Mudichur Residential Belt", "type": "River Basin Margin", "elevation_deficit_m": -1.8, "critical_threshold_cm": 25},
            {"location": "Kathipara Junction Underloop", "type": "Transit Interchange", "elevation_deficit_m": -1.0, "critical_threshold_cm": 35}
        ]
    },
    "wayanad": {
        "city_name": "Wayanad Highland District",
        "soil_saturation_index": 0.98,
        "drainage_capacity_mm_hr": 25.0,
        "reservoirs": [
            {
                "name": "Banasura Sagar Dam",
                "full_capacity_tmc": 7.38,
                "current_storage_tmc": 6.84,
                "current_level_ft": 772.4,
                "max_level_ft": 775.6,
                "catchment_area_sqkm": 2840,
                "status": "HIGH ALERT",
                "current_inflow_cumecs": 3400,
                "recommended_outflow_cumecs": 2900,
                "danger_lead_time_hrs": 5
            },
            {
                "name": "Karapuzha Dam",
                "full_capacity_tmc": 2.70,
                "current_storage_tmc": 2.38,
                "current_level_ft": 756.0,
                "max_level_ft": 758.5,
                "catchment_area_sqkm": 920,
                "status": "WATCH",
                "current_inflow_cumecs": 850,
                "recommended_outflow_cumecs": 750,
                "danger_lead_time_hrs": 8
            }
        ],
        "vulnerable_hotspots": [
            {"location": "Chooralmala Valley Road", "type": "Debris Flow Corridor", "elevation_deficit_m": 0.0, "critical_threshold_cm": 20},
            {"location": "Meppadi Bridge Approach", "type": "River Fluvial Zone", "elevation_deficit_m": -1.4, "critical_threshold_cm": 25},
            {"location": "Mundakkai Ridge Crossing", "type": "Hill Torrent Culvert", "elevation_deficit_m": -0.8, "critical_threshold_cm": 30},
            {"location": "Mananthavady Low Bridge", "type": "Causeway", "elevation_deficit_m": -1.9, "critical_threshold_cm": 15}
        ]
    },
    "mumbai": {
        "city_name": "Greater Mumbai Urban Basin",
        "soil_saturation_index": 0.96,
        "drainage_capacity_mm_hr": 22.0,
        "reservoirs": [
            {
                "name": "Tansa & Vaitarna System",
                "full_capacity_tmc": 12.4,
                "current_storage_tmc": 11.8,
                "current_level_ft": 420.5,
                "max_level_ft": 424.0,
                "catchment_area_sqkm": 3400,
                "status": "HIGH ALERT",
                "current_inflow_cumecs": 4100,
                "recommended_outflow_cumecs": 3800,
                "danger_lead_time_hrs": 4
            },
            {
                "name": "Vihar Lake",
                "full_capacity_tmc": 0.98,
                "current_storage_tmc": 0.95,
                "current_level_ft": 80.1,
                "max_level_ft": 80.4,
                "catchment_area_sqkm": 190,
                "status": "OVERFLOWING",
                "current_inflow_cumecs": 310,
                "recommended_outflow_cumecs": 310,
                "danger_lead_time_hrs": 1
            }
        ],
        "vulnerable_hotspots": [
            {"location": "Milan Subway, Santacruz", "type": "Subway Underpass", "elevation_deficit_m": -3.2, "critical_threshold_cm": 20},
            {"location": "Hindmata Junction, Dadar", "type": "Natural Depression", "elevation_deficit_m": -1.5, "critical_threshold_cm": 25},
            {"location": "Andheri Subway", "type": "Subway Underpass", "elevation_deficit_m": -2.9, "critical_threshold_cm": 20},
            {"location": "Gandhi Market, King's Circle", "type": "Commercial Basin", "elevation_deficit_m": -1.3, "critical_threshold_cm": 30},
            {"location": "Kurla LBS Marg Near Mithi River", "type": "Fluvial Margin", "elevation_deficit_m": -1.8, "critical_threshold_cm": 25}
        ]
    }
}

def get_default_profile(district_id: str, rain_mm: float) -> Dict[str, Any]:
    return {
        "city_name": f"{district_id.title()} Urban Zone",
        "soil_saturation_index": 0.82,
        "drainage_capacity_mm_hr": 18.0,
        "reservoirs": [
            {
                "name": f"{district_id.title()} Municipal Barrage",
                "full_capacity_tmc": 4.5,
                "current_storage_tmc": 3.4,
                "current_level_ft": 88.5,
                "max_level_ft": 95.0,
                "catchment_area_sqkm": 1200,
                "status": "WATCH" if rain_mm > 50 else "NORMAL",
                "current_inflow_cumecs": int(rain_mm * 12.5),
                "recommended_outflow_cumecs": int(rain_mm * 10.2),
                "danger_lead_time_hrs": 10
            }
        ],
        "vulnerable_hotspots": [
            {"location": "Central Bus Stand Subway", "type": "Underpass", "elevation_deficit_m": -2.0, "critical_threshold_cm": 25},
            {"location": "Station Road Low Point", "type": "Arterial Road", "elevation_deficit_m": -0.8, "critical_threshold_cm": 30},
            {"location": "Riverfront Colony", "type": "River Margin", "elevation_deficit_m": -1.2, "critical_threshold_cm": 25}
        ]
    }


@router.get("/inundation/{district_id}")
def get_urban_inundation(district_id: str, lead_time: int = 24):
    """
    Computes street-level waterlogging depth, road trafficability status,
    and flood recession forecasts derived from VARSHAAI regime-corrected rainfall.
    """
    pred = pipeline_instance.predict_single(district_id=district_id, lead_time=lead_time)
    rain = pred["corrected_rainfall"]
    regime = pred["detected_regime"]
    
    profile = HYDRO_PROFILES.get(district_id, get_default_profile(district_id, rain))
    soil_sat = profile["soil_saturation_index"]
    drain_cap = profile["drainage_capacity_mm_hr"]
    
    # Calculate effective runoff (Rational Method approximation scaled by regime)
    runoff_coeff = 0.72 if district_id in ["chennai", "mumbai"] else 0.58
    effective_rain_hr = rain / 6.0 # peak 6h concentration
    excess_water_mm = max(0.0, (effective_rain_hr * runoff_coeff) - drain_cap)
    
    hotspots_evaluated = []
    impassable_count = 0
    caution_count = 0
    
    for h in profile["vulnerable_hotspots"]:
        # Depth in centimetres = excess water + deficit ponding factor
        deficit_factor = abs(h["elevation_deficit_m"]) * 22.0
        depth_cm = round(max(0.0, (excess_water_mm * 1.8) + (deficit_factor * (rain / 90.0))), 1)
        
        if depth_cm >= h["critical_threshold_cm"] * 1.4:
            status = "IMPASSABLE"
            trafficability = "Submerged / Road Blocked"
            badge_color = "RED"
            impassable_count += 1
        elif depth_cm >= h["critical_threshold_cm"] * 0.7:
            status = "CAUTION"
            trafficability = "High-Clearance Vehicles Only"
            badge_color = "YELLOW"
            caution_count += 1
        else:
            status = "CLEAR"
            trafficability = "Passable / Normal Traffic"
            badge_color = "GREEN"
            
        hotspots_evaluated.append({
            "location": h["location"],
            "type": h["type"],
            "depth_cm": depth_cm,
            "status": status,
            "trafficability": trafficability,
            "badge_color": badge_color,
            "submersible_pumps_needed": max(1, int(depth_cm / 15))
        })
        
    return {
        "district_id": district_id,
        "city_name": profile["city_name"],
        "lead_time": lead_time,
        "corrected_rainfall_mm": rain,
        "detected_regime": regime,
        "soil_saturation_pct": int(soil_sat * 100),
        "overall_inundation_severity": "EXTREME" if impassable_count >= 2 else ("MODERATE" if caution_count >= 1 else "LOW"),
        "impassable_routes_count": impassable_count,
        "caution_routes_count": caution_count,
        "total_monitored_points": len(hotspots_evaluated),
        "hotspots": hotspots_evaluated,
        "recession_estimated_hrs": round(max(2.0, (rain / 25.0) * (1.2 if soil_sat > 0.9 else 0.8)), 1),
        "de_watering_action": "Emergency heavy pumping (100 HP) units deployed" if impassable_count > 0 else "Continuous gravity drainage active"
    }


@router.get("/reservoirs/{district_id}")
def get_reservoir_inflows(district_id: str, lead_time: int = 24):
    """
    Computes upstream catchment runoff, predicted dam reservoir inflow (cumecs),
    and proactive gate discharge optimization to prevent emergency flash flooding.
    """
    pred = pipeline_instance.predict_single(district_id=district_id, lead_time=lead_time)
    rain = pred["corrected_rainfall"]
    upper_bound = pred["uncertainty_interval"]["upper_bound"]
    
    profile = HYDRO_PROFILES.get(district_id, get_default_profile(district_id, rain))
    reservoirs_data = []
    
    for r in profile["reservoirs"]:
        # Inflow scaling based on rainfall and 90th percentile uncertainty ceiling
        scale = max(0.5, rain / 65.0)
        proj_inflow = round(r["current_inflow_cumecs"] * scale, 0)
        proj_surge_inflow = round(proj_inflow * (upper_bound / max(1.0, rain)), 0)
        
        # Calculate optimal controlled release
        storage_pct = round((r["current_storage_tmc"] / r["full_capacity_tmc"]) * 100, 1)
        if storage_pct >= 90 or rain > 90:
            action = "PROACTIVE DISCHARGE RECOMMENDED"
            rec_release = int(proj_inflow * 1.05)
            alert = "RED"
        elif storage_pct >= 75 or rain > 50:
            action = "STAGE-1 REGULATED DISCHARGE"
            rec_release = int(proj_inflow * 0.85)
            alert = "ORANGE"
        else:
            action = "ROUTINE RETENTION / RECHARGE"
            rec_release = int(proj_inflow * 0.40)
            alert = "GREEN"
            
        reservoirs_data.append({
            "name": r["name"],
            "full_capacity_tmc": r["full_capacity_tmc"],
            "current_storage_tmc": r["current_storage_tmc"],
            "storage_percentage": storage_pct,
            "current_level_ft": r["current_level_ft"],
            "max_level_ft": r["max_level_ft"],
            "projected_inflow_cumecs": proj_inflow,
            "worst_case_inflow_cumecs": proj_surge_inflow,
            "recommended_discharge_cumecs": rec_release,
            "operational_directive": action,
            "danger_lead_time_hrs": r["danger_lead_time_hrs"],
            "alert_level": alert
        })
        
    return {
        "district_id": district_id,
        "lead_time": lead_time,
        "rainfall_driver_mm": rain,
        "catchment_regime": pred["detected_regime"],
        "reservoirs": reservoirs_data,
        "downstream_floodplain_warning": "High risk of riverine overflow if gate releases exceed 3,000 cumecs" if any(r["storage_percentage"] > 88 for r in reservoirs_data) else "River conveyance capacity stable"
    }
