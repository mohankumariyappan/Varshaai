"""
VARSHAAI Next-Gen: Automated NDMA CAP v1.2 Alert & Disaster Logistics Dispatcher
Generates official ITU-T X.1303 Common Alerting Protocol (CAP) XML/JSON payloads,
multilingual citizen broadcasts in 6 Indian languages, and NDRF deployment logistics.
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from datetime import datetime, timezone
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml_engine")))
from pipeline import pipeline_instance

router = APIRouter(prefix="/api/alerts", tags=["CAP Emergency Alerts & Dispatch"])

MULTILINGUAL_TEMPLATES = {
    "RED": {
        "en": "URGENT RED FLOOD ALERT: Extreme rainfall of {rain} mm predicted in {district} under {regime} conditions. Flash flooding and severe waterlogging expected. Evacuate low-lying areas. Follow official disaster instructions.",
        "hi": "अति गंभीर लाल चेतावनी: {regime} के तहत {district} में {rain} मिमी की अत्यधिक भारी बारिश का अनुमान है। निचले इलाकों में बाढ़ का खतरा है। सुरक्षित स्थानों पर जाएं और निर्देशों का पालन करें।",
        "ta": "அதிதீவிர சிவப்பு எச்சரிக்கை: {regime} காரணமாக {district} மாவட்டத்தில் {rain} மி.மீ அதீத கனமழை பெய்யக்கூடும். தாழ்வான பகுதிகளில் வெள்ளப்பெருக்கு அபாயம் உள்ளதால் பாதுகாப்பான இடங்களுக்கு செல்லவும்.",
        "ml": "തീവ്ര റെഡ് അലേർട്ട്: {regime} കാരണം {district} ജില്ലയിൽ {rain} മില്ലിമീറ്റർ അതിതീവ്ര മഴയ്ക്ക് സാധ്യത. താഴ്ന്ന പ്രദേശങ്ങളിലുള്ളവർ സുരക്ഷിത സ്ഥാനങ്ങളിലേക്ക് മാറുക.",
        "mr": "अतिदक्षतेचा रेड अलर्ट: {regime} मुळे {district} मध्ये {rain} मिमी मुसळधार पावसाचा अंदाज आहे. सखल भागात पूरस्थिती निर्माण होऊ शकते. त्वरित सुरक्षित स्थळी स्थलांतर करा.",
        "bn": "জরুরি লাল সতর্কতা: {regime}-এর কারণে {district}-এ {rain} মিমি অতি ভারী বৃষ্টির সম্ভাবনা রয়েছে। নিম্নাঞ্চলে প্লাবনের আশঙ্কা। অবিলম্বে নিরাপদ আশ্রয়ে যান।"
    },
    "ORANGE": {
        "en": "ORANGE RAINFALL ADVISORY: Heavy rainfall of {rain} mm expected in {district}. Waterlogging of underpasses and arterial roads likely. Prepare emergency kits.",
        "hi": "नारंगी चेतावनी: {district} में {rain} मिमी भारी बारिश की संभावना है। मुख्य सड़कों और सबवे में जलभराव हो सकता है। आपातकालीन सामग्री तैयार रखें।",
        "ta": "ஆரஞ்சு எச்சரிக்கை: {district} பகுதியில் {rain} மி.மீ கனமழைக்கு வாய்ப்பு உள்ளது. சுரங்கப்பாதைகள் மற்றும் சாலைகளில் நீர் தேங்கக்கூடும். முன்னெச்சரிக்கையுடன் இருக்கவும்.",
        "ml": "ഓറഞ്ച് അലേർട്ട്: {district} പ്രദേശത്ത് {rain} മില്ലിമീറ്റർ ശക്തമായ മഴയ്ക്ക് സാധ്യത. റോഡുകളിലും അണ്ടർപാസുകളിലും വെള്ളക്കെട്ടിന് സാധ്യതയുള്ളതിനാൽ ജാഗ്രത പാലിക്കുക.",
        "mr": "ऑरेंज अलर्ट: {district} मध्ये {rain} मिमी जोरदार पावसाची शक्यता आहे. भुयारी मार्ग आणि रस्त्यांवर पाणी साचण्याची शक्यता. खबरदारी बाळगा.",
        "bn": "কমলা সতর্কতা: {district}-এ {rain} মিমি ভারী বৃষ্টির পূর্বাভাস। আন্ডারপাস ও রাস্তায় জল জমার সম্ভাবনা রয়েছে। প্রস্তুত থাকুন।"
    },
    "YELLOW": {
        "en": "YELLOW WATCH: Moderate rainfall of {rain} mm forecasted in {district}. Localized traffic congestion expected. Stay updated with routine advisories.",
        "hi": "पीली चेतावनी: {district} में {rain} मिमी मध्यम वर्षा का पूर्वानुमान है। यातायात प्रभावित हो सकता है। आधिकारिक अपडेट पर नजर रखें।",
        "ta": "மஞ்சள் எச்சரிக்கை: {district} பகுதியில் {rain} மி.மீ மிதமான மழை பெய்யக்கூடும். போக்குவரத்து நெரிசல் ஏற்படலாம். வானிலை தகவல்களை கவனிக்கவும்.",
        "ml": "യെല്ലോ അലേർട്ട്: {district} പ്രദേശത്ത് {rain} മില്ലിമീറ്റർ മിതമായ മഴ പ്രവചിക്കുന്നു. ഗതാഗത തടസ്സങ്ങൾക്ക് സാധ്യത.",
        "mr": "यलो अलर्ट: {district} मध्ये {rain} मिमी मध्यम पावसाचा अंदाज आहे. हवामान अंदाजावर लक्ष ठेवा.",
        "bn": "হলুদ সতর্কতা: {district}-এ {rain} মিমি মাঝারি বৃষ্টির সম্ভাবনা। আবহাওয়ার খবরের দিকে নজর রাখুন।"
    }
}

@router.get("/cap/{district_id}")
def get_cap_alert_protocol(district_id: str, lead_time: int = 24):
    """
    Generates standard ITU-T X.1303 / NDMA CAP v1.2 XML and JSON payload
    compatible with NDMA SACHET and National Emergency Communication Systems.
    """
    pred = pipeline_instance.predict_single(district_id=district_id, lead_time=lead_time)
    rain = pred["corrected_rainfall"]
    regime = pred["detected_regime"]
    alert_level = pred["risk_assessment"]["alert_level"]
    prob = int(pred["heavy_rain_probability"] * 100)
    lower = pred["uncertainty_interval"]["lower_bound"]
    upper = pred["uncertainty_interval"]["upper_bound"]
    district_name = pred["district_name"]
    state = pred["state"]
    
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00")
    identifier = f"IN-VARSHAAI-{district_id.upper()}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}"
    
    cap_severity = "Extreme" if alert_level == "RED" else ("Severe" if alert_level == "ORANGE" else "Moderate")
    cap_urgency = "Immediate" if alert_level == "RED" else ("Expected" if alert_level == "ORANGE" else "Future")
    cap_certainty = "Observed" if prob > 85 else ("Likely" if prob > 60 else "Possible")
    
    headline = f"IMD/VARSHAAI {alert_level} ALERT: {regime} Heavy Rainfall Trigger for {district_name}"
    description = (
        f"VARSHAAI Regime-Aware Intelligence forecasts {rain} mm rain (80% interval: {lower} - {upper} mm) "
        f"across {district_name}, {state} with {prob}% heavy rain probability under {regime} synoptic steering. "
        f"NWP physics model underestimated risk by {(rain - pred['raw_nwp']):+.1f} mm."
    )
    instruction = pred["risk_assessment"]["action_recommendation"]
    
    # Generate canonical CAP v1.2 XML
    cap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>{identifier}</identifier>
  <sender>varshaai-core@ndma.gov.in</sender>
  <sent>{now_iso}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>Severe Rainfall / Flood Threat</event>
    <urgency>{cap_urgency}</urgency>
    <severity>{cap_severity}</severity>
    <certainty>{cap_certainty}</certainty>
    <eventCode>
      <valueName>IMD_COLOR</valueName>
      <value>{alert_level}</value>
    </eventCode>
    <headline>{headline}</headline>
    <description>{description}</description>
    <instruction>{instruction}</instruction>
    <area>
      <areaDesc>{district_name}, {state}</areaDesc>
      <circle>{pred['lat']},{pred['lon']},25.0</circle>
    </area>
  </info>
</alert>"""

    return {
        "identifier": identifier,
        "format": "CAP-v1.2 / ITU-T X.1303",
        "sent_utc": now_iso,
        "status": "Actual",
        "msgType": "Alert",
        "scope": "Public",
        "event": f"{alert_level} Heavy Rain Hazard",
        "severity": cap_severity,
        "urgency": cap_urgency,
        "certainty": cap_certainty,
        "headline": headline,
        "description": description,
        "instruction": instruction,
        "district": district_name,
        "state": state,
        "coordinates": {"lat": pred["lat"], "lon": pred["lon"]},
        "xml_payload": cap_xml
    }


@router.get("/multilingual/{district_id}")
def get_multilingual_broadcast(district_id: str, lead_time: int = 24):
    """
    Auto-translates emergency civil alerts into 6 official Indian languages
    ready for cellular cell broadcast (CB), SMS, WhatsApp, and automated IVR sirens.
    """
    pred = pipeline_instance.predict_single(district_id=district_id, lead_time=lead_time)
    alert = pred["risk_assessment"]["alert_level"]
    rain = pred["corrected_rainfall"]
    regime = pred["detected_regime"]
    district = pred["district_name"]
    
    template_set = MULTILINGUAL_TEMPLATES.get(alert, MULTILINGUAL_TEMPLATES["YELLOW"])
    
    broadcasts = {
        "en": {"language": "English", "script": "Latin", "text": template_set["en"].format(rain=rain, district=district, regime=regime)},
        "hi": {"language": "Hindi", "script": "Devanagari", "text": template_set["hi"].format(rain=rain, district=district, regime=regime)},
        "ta": {"language": "Tamil", "script": "Tamil", "text": template_set["ta"].format(rain=rain, district=district, regime=regime)},
        "ml": {"language": "Malayalam", "script": "Malayalam", "text": template_set["ml"].format(rain=rain, district=district, regime=regime)},
        "mr": {"language": "Marathi", "script": "Devanagari", "text": template_set["mr"].format(rain=rain, district=district, regime=regime)},
        "bn": {"language": "Bengali", "script": "Bengali", "text": template_set["bn"].format(rain=rain, district=district, regime=regime)}
    }
    
    return {
        "district_id": district_id,
        "alert_level": alert,
        "corrected_rainfall_mm": rain,
        "detected_regime": regime,
        "broadcasts": broadcasts
    }


@router.get("/logistics/{district_id}")
def get_disaster_logistics(district_id: str, lead_time: int = 24):
    """
    Recommends proactive resource dispatch coordinates:
    NDRF battalions, heavy dewatering pump stations, relief shelters, and boat squads.
    """
    pred = pipeline_instance.predict_single(district_id=district_id, lead_time=lead_time)
    alert = pred["risk_assessment"]["alert_level"]
    district_name = pred["district_name"]
    
    # Calculate required logistics based on severity
    ndrf_teams = 4 if alert == "RED" else (2 if alert == "ORANGE" else 1)
    pumps_allocated = 24 if alert == "RED" else (12 if alert == "ORANGE" else 4)
    boats_ready = 18 if alert == "RED" else (8 if alert == "ORANGE" else 2)
    shelters_count = 12 if alert == "RED" else (6 if alert == "ORANGE" else 2)
    
    return {
        "district_id": district_id,
        "district_name": district_name,
        "alert_level": alert,
        "ndrf_battalion": {
            "teams_deployed": ndrf_teams,
            "personnel_count": ndrf_teams * 45,
            "staging_base": f"{district_name} District Collectorate Staging Hub",
            "readiness_state": "STANDBY TO ROLL" if alert == "RED" else "ALERT LEVEL-2"
        },
        "heavy_equipment": {
            "dewatering_pumps_100hp": pumps_allocated,
            "inflatable_inundation_boats": boats_ready,
            "generator_sets_kva": pumps_allocated // 2,
            "mobile_medical_vans": 6 if alert == "RED" else 3
        },
        "shelter_infrastructure": {
            "active_shelters": shelters_count,
            "total_bed_capacity": shelters_count * 350,
            "current_occupancy_pct": 18 if alert == "RED" else 5,
            "food_packets_prepared": shelters_count * 2500
        }
    }
