# VARSHAAI — Regime-Aware Rainfall Intelligence & Forecast Correction Platform

VARSHAAI is a domain-specific meteorological AI system engineered to improve Numerical Weather Prediction (NWP) rainfall forecasts by dynamically classifying atmospheric synoptic regimes (Active Monsoon, Break Monsoon, Monsoon Depression, Coastal System, Orographic Rainfall, Western Disturbance, Localized Convection) and applying regime-specific bias-correction models.

---

## 🌧️ Core Architecture & Innovation

Instead of generic single-model AI:
$$\text{NWP Forecast} \longrightarrow \text{Generic AI} \longrightarrow \text{Corrected Rainfall}$$

VARSHAAI uses a multi-stage meteorological pipeline:
$$\text{Weather Data} \longrightarrow \text{Regime Detection} \longrightarrow \text{Regime-Specific Correction} \longrightarrow \text{Corrected Rainfall} \longrightarrow \text{Heavy-Rain Probability} \longrightarrow \text{Uncertainty Bounds} \longrightarrow \text{Explainability} \longrightarrow \text{Verification}$$

### 7 Canonical Weather Regimes
1. **Monsoon Depression**: Deep cyclonic pressure anomaly ($< -7\text{ hPa}$), high low-level convergence, extreme moisture flux. NWP severely underestimates torrential cores ($-32\text{ mm}$ systematic bias).
2. **Active Monsoon**: Sustained monsoon westerlies, high tropospheric humidity ($850\text{ hPa } RH > 85\%$). NWP underestimates sustained rainfall ($-18\text{ mm}$ bias).
3. **Break Monsoon**: Synoptic trough shifted to Himalayan foothills, dry mid-level air. NWP overestimates central peninsular rainfall ($+6\text{ mm}$ bias).
4. **Coastal System**: Land-sea thermal contrast, marine moisture plume, coastal convergence lines. NWP misses shear confluence ($-22\text{ mm}$ bias).
5. **Orographic Rainfall**: Steep terrain barriers (Western Ghats / Himalayas) causing intense windward ascent blunted by coarse NWP grids ($-28\text{ mm}$ bias).
6. **Western Disturbance**: Mid-latitude westerly trough with sub-tropical jet interaction ($-14\text{ mm}$ bias).
7. **Localized Convective**: High CAPE ($> 2500\text{ J/kg}$), afternoon diurnal heating with high spatial miss rate ($-15\text{ mm}$ bias).

---

## 🖥️ 10 Complete Application Modules

1. **Command Center**: Real-time meteorological dashboard, telemetry indicators (Data, NWP, AI, DB), interactive India map preview, detected regime card, NWP vs VARSHAAI comparison, decision risk radar, and $06\text{h} \to 48\text{h}$ accumulation timeline.
2. **Rainfall Intelligence Map**: High-resolution multi-layer geospatial visualization supporting 6 meteorological layers:
   - Layer 1: AI Corrected Rainfall ($0-10$, $10-25$, $25-50$, $50-100$, $100+\text{ mm}$)
   - Layer 2: Raw NWP Rainfall
   - Layer 3: Ground Truth Observed Rainfall
   - Layer 4: Heavy Rain Exceedance Probability ($>64.5\text{ mm}$)
   - Layer 5: Weather Regime Classification
   - Layer 6: NWP Error Matrix ($\text{Observed} - \text{NWP}$)
   - **Functional Forecast Slider**: Real-time spatial wipe slider comparing Raw NWP with AI Corrected output across Indian longitudes.
3. **Regime Intelligence**: Deep dive into the detected synoptic regime, confidence level, atmospheric soundings (pressure anomaly, $850\text{ hPa}$ humidity, wind convergence, moisture flux, CAPE), and an **Interactive Sandbox** allowing users to adjust sliders and watch the regime classifier dynamically switch.
4. **Forecast Comparison**: Head-to-head 3-way empirical comparison between Raw NWP, VARSHAAI AI, and Ground Truth observations with an interactive continuous blend slider and multi-district comparison table.
5. **Risk Radar**: 5-factor Decision Support Index combining rainfall amount, heavy-rain probability ($>64.5\text{ mm}$), forecast persistence, regime hazard level, and quantile uncertainty spread with calibrated IMD alert levels (**Green**, **Yellow**, **Orange**, **Red**).
6. **District Digital Weather Twin**: High-resolution localized digital twin for selected districts (e.g. Thiruvallur, Chennai, Wayanad, Mumbai, Pune, Kolkata, Bhubaneswar) with $6\text{h}/12\text{h}/24\text{h}/36\text{h}/48\text{h}$ timelines, sounding profiles, and uncertainty envelopes.
7. **Why Did Forecast Change? (Explainable AI)**: Feature attribution breakdown (SHAP-style) showing the exact $\text{mm}$ contribution of each meteorological variable (Regime baseline, Moisture flux, Humidity, Wind convergence, Pressure anomaly, Topography).
8. **Forecast Skill Center (Verification)**: Rigorous scientific evaluation on an **unseen test dataset** ($1,050$ samples):
   - Continuous: RMSE, MAE, Systematic Bias, Pearson Correlation ($r$).
   - Categorical ($>64.5\text{ mm}$): Critical Success Index (CSI), Probability of Detection (POD), False Alarm Ratio (FAR).
   - Probabilistic & Spatial: Brier Score, Fractions Skill Score (FSS).
   - Lead-time degradation curves from $+06\text{h}$ to $+48\text{h}$.
9. **Historical Event Replay**: Interactive 7-stage state machine reconstructing major historical deluge events:
   - Chennai 2015 Historic Deluge
   - Cyclone Michaung Coastal Inundation (2023)
   - Wayanad Extreme Orographic Burst (2024)
   - Central India Monsoon Depression (2025)
   - Features Play, Pause, Step-by-Step, and Reset controls across all 7 stages.
10. **Model Health & MLOps**: Runtime monitoring tracking the health of the Regime Classifier, Regime Correction Models, Heavy Rain Probability Model, Data Ingestion Pipeline, SQLite/Cache database, inference latencies ($\sim 2\text{ ms}$), and Kolmogorov-Smirnov feature drift status.

---

## 📊 Scientific Verification Benchmark Results

Evaluated on an unseen test partition of $1,050$ samples:

| Verification Metric | Raw NWP Baseline | VARSHAAI Platform | Improvement |
| :--- | :--- | :--- | :--- |
| **Root Mean Square Error (RMSE)** | $27.27\text{ mm}$ | **$14.35\text{ mm}$** | **$47.4\%$ Error Reduction** |
| **Mean Absolute Error (MAE)** | $21.30\text{ mm}$ | **$10.28\text{ mm}$** | **$51.8\%$ Improvement** |
| **Systematic Bias** | $+19.42\text{ mm}$ | **$-0.18\text{ mm}$** | **Debiased ($\sim 0\text{ mm}$)** |
| **Critical Success Index (CSI $>64\text{mm}$)** | $0.714$ | **$0.782$** | **$+0.068$ Skill Boost** |
| **False Alarm Ratio (FAR)** | $0.282$ | **$0.117$** | **$>58\%$ Reduction in False Alarms** |
| **Brier Score (Probabilistic)** | $0.285$ | **$0.069$** | **Well-Calibrated Uncertainty** |
| **Regime Classifier Accuracy** | — | **$93.24\%$** | **7-Class Balanced Accuracy** |

---

## 🚀 Quickstart & Running the Application

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1-Click Launch (Windows)
Double-click `start_platform.bat` or run:
```powershell
.\start_platform.bat
```

### Manual Setup
#### 1. Backend
```bash
# In project root
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- API is running at: `http://127.0.0.1:8000`
- Interactive Swagger documentation: `http://127.0.0.1:8000/docs`

#### 2. Frontend
```bash
cd frontend
npm run dev
```
- Web Application is running at: `http://localhost:5173`

---

## 🧪 Running Automated Tests
```bash
# ML Engine Unit Tests
.\.venv\Scripts\python.exe -m unittest ml_engine/tests/test_models.py

# Backend FastAPI Integration Tests
.\.venv\Scripts\python.exe -m unittest backend/tests/test_api.py

# Frontend TypeScript & React Build Verification
cd frontend && npm run build
```
