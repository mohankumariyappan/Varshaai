import React, { useState } from 'react';
import { Compass, Wind, Droplets, Gauge, Activity, ShieldCheck, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { DistrictForecast, WeatherRegime } from '../types';

interface RegimeIntelligenceProps {
  currentForecast: DistrictForecast | null;
  onSimulateWeather: (customParams: any) => void;
}

export const RegimeIntelligence: React.FC<RegimeIntelligenceProps> = ({
  currentForecast,
  onSimulateWeather
}) => {
  const [pressureSlider, setPressureSlider] = useState<number>(
    currentForecast?.atmospheric_profile.pressure_anomaly.value || -8.5
  );
  const [humiditySlider, setHumiditySlider] = useState<number>(
    currentForecast?.atmospheric_profile.humidity_850.value || 92
  );
  const [windSlider, setWindSlider] = useState<number>(
    currentForecast?.atmospheric_profile.wind_convergence.value || 11.5
  );
  const [moistureSlider, setMoistureSlider] = useState<number>(
    currentForecast?.atmospheric_profile.moisture_flux.value || 52
  );

  const handleApplySimulation = () => {
    onSimulateWeather({
      pressure_anomaly: pressureSlider,
      humidity_850: humiditySlider,
      wind_convergence: windSlider,
      moisture_flux: moistureSlider
    });
  };

  const handleResetDefaults = () => {
    if (currentForecast) {
      setPressureSlider(currentForecast.atmospheric_profile.pressure_anomaly.value);
      setHumiditySlider(currentForecast.atmospheric_profile.humidity_850.value);
      setWindSlider(currentForecast.atmospheric_profile.wind_convergence.value);
      setMoistureSlider(currentForecast.atmospheric_profile.moisture_flux.value);
      onSimulateWeather(null);
    }
  };

  if (!currentForecast) return null;

  const regimesList: Array<{
    name: WeatherRegime;
    biasProfile: string;
    correctionBehavior: string;
    typicalConditions: string;
    model: string;
  }> = [
    {
      name: "Monsoon Depression",
      biasProfile: "NWP severely underpredicts meso-scale torrential core (-32 mm)",
      correctionBehavior: "Strong positive rainfall boost (+30 to +80 mm)",
      typicalConditions: "Deep cyclonic pressure drop (< -7 hPa), extreme moisture flux (> 45 g/kg·m/s), strong convergence",
      model: "Monsoon Depression Specialized Model"
    },
    {
      name: "Active Monsoon",
      biasProfile: "NWP underpredicts heavy sustained convective rainfall (-18 mm)",
      correctionBehavior: "Moderate positive correction (+15 to +35 mm)",
      typicalConditions: "Low pressure trough, 850 hPa RH > 85%, steady monsoon westerlies",
      model: "Active Monsoon Bias Correction Model"
    },
    {
      name: "Break Monsoon",
      biasProfile: "NWP overpredicts rain over central/peninsular basins (+6 mm)",
      correctionBehavior: "Negative suppression correction (-5 to -15 mm)",
      typicalConditions: "Positive pressure anomaly, dry tropospheric air, shift of trough to Himalayan foothills",
      model: "Break Monsoon Correction Model"
    },
    {
      name: "Coastal System",
      biasProfile: "NWP misses low-level coastal convergence bands (-22 mm)",
      correctionBehavior: "Significant coastal enhancement (+20 to +50 mm)",
      typicalConditions: "Land-sea thermal contrast, high marine humidity flux, shoreline shear lines",
      model: "Coastal Convergence Model"
    },
    {
      name: "Orographic Rainfall",
      biasProfile: "Coarse NWP grid blunts steep windward slope precipitation (-28 mm)",
      correctionBehavior: "Elevation-scaled topographic enhancement (+25 to +60 mm)",
      typicalConditions: "Steep windward terrain (Western Ghats / Himalayas), strong barrier perpendicular winds",
      model: "Orographic Topography Model"
    },
    {
      name: "Western Disturbance",
      biasProfile: "NWP misplaces sub-tropical westerly trough rain band (-14 mm)",
      correctionBehavior: "Latitude and jet-stream aligned correction (+10 to +30 mm)",
      typicalConditions: "Mid-latitude upper-tropospheric westerly trough, cold-air advection across NW India",
      model: "Western Disturbance Model"
    },
    {
      name: "Localized Convective",
      biasProfile: "High spatial miss rate in isolated thunderstorm cells (-15 mm)",
      correctionBehavior: "High uncertainty interval with instability scaling (+10 to +40 mm)",
      typicalConditions: "Very high CAPE (> 2500 J/kg), afternoon boundary-layer heating",
      model: "Convective Instability Model"
    }
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-black text-white">REGIME INTELLIGENCE ENGINE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Why one generic AI model fails: NWP error characteristics are fundamentally dependent on synoptic weather regimes.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-800/80 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-purple-300 font-bold uppercase">Detected Regime:</span>
          <span className="font-mono font-black text-white">{currentForecast.detected_regime}</span>
          <span className="text-emerald-400 font-mono font-bold">
            ({Math.round(currentForecast.regime_confidence * 100)}% confidence)
          </span>
        </div>
      </div>

      {/* Atmospheric Sounding Grid & Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Atmospheric Sounding Profile Gauges (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              PHYSICAL SOUNDING TELEMETRY ({currentForecast.district_name})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Real-time IMD / NWP grid analysis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pressure Anomaly */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold">Surface Pressure Anomaly</span>
                <Gauge className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-purple-300">
                  {currentForecast.atmospheric_profile.pressure_anomaly.value}
                </span>
                <span className="text-xs text-slate-400">hPa</span>
              </div>
              <div className="text-[10px] text-purple-400 font-medium mt-1">
                Status: {currentForecast.atmospheric_profile.pressure_anomaly.assessment}
              </div>
            </div>

            {/* Moisture Flux */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold">Total Moisture Flux</span>
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-cyan-300">
                  {currentForecast.atmospheric_profile.moisture_flux.value}
                </span>
                <span className="text-xs text-slate-400">g/kg·m/s</span>
              </div>
              <div className="text-[10px] text-cyan-400 font-medium mt-1">
                Status: {currentForecast.atmospheric_profile.moisture_flux.assessment}
              </div>
            </div>

            {/* Wind Convergence */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold">Low-Level Wind Convergence</span>
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {currentForecast.atmospheric_profile.wind_convergence.value}
                </span>
                <span className="text-xs text-slate-400">× 10⁻⁵ s⁻¹</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-medium mt-1">
                Status: {currentForecast.atmospheric_profile.wind_convergence.assessment}
              </div>
            </div>

            {/* Relative Humidity */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold">850 hPa Relative Humidity</span>
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-blue-400">
                  {currentForecast.atmospheric_profile.humidity_850.value}
                </span>
                <span className="text-xs text-slate-400">%</span>
              </div>
              <div className="text-[10px] text-blue-400 font-medium mt-1">
                Status: {currentForecast.atmospheric_profile.humidity_850.assessment}
              </div>
            </div>
          </div>

          {/* Core Innovation Concept Box */}
          <div className="bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-purple-800/60 p-3.5 rounded-lg text-xs space-y-1.5">
            <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              THE VARSHAAI REGIME CORRECTION FORMULA
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Standard AI systems blindly map <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-400">NWP → Rainfall</code>. 
              VARSHAAI computes <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400">Error = Observed - NWP</code> conditioned 
              specifically on the active weather regime <code className="bg-slate-900 px-1 py-0.5 rounded text-purple-300">k</code>:
            </p>
            <div className="font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800 text-center text-cyan-300 font-bold">
              Corrected Rainfall = NWP + f_regime(Atmospheric Sounding, Topography, Lead Time)
            </div>
          </div>
        </div>

        {/* Right: Interactive Atmospheric Regime Sandbox (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                REGIME TESTING SANDBOX
              </h3>
              <span className="text-[10px] text-amber-400 font-semibold">LIVE RE-CLASSIFICATION</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Adjust atmospheric sounding parameters to observe dynamic regime switching and model selection:
            </p>

            <div className="space-y-3 text-xs">
              {/* Pressure anomaly slider */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Pressure Anomaly:</span>
                  <span className="font-mono font-bold text-purple-300">{pressureSlider.toFixed(1)} hPa</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="8"
                  step="0.5"
                  value={pressureSlider}
                  onChange={(e) => setPressureSlider(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              {/* Humidity slider */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">850 hPa Humidity:</span>
                  <span className="font-mono font-bold text-blue-300">{humiditySlider}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={humiditySlider}
                  onChange={(e) => setHumiditySlider(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
              </div>

              {/* Convergence slider */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Wind Convergence:</span>
                  <span className="font-mono font-bold text-emerald-300">{windSlider.toFixed(1)} × 10⁻⁵ s⁻¹</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="18"
                  step="0.5"
                  value={windSlider}
                  onChange={(e) => setWindSlider(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Moisture Flux slider */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Moisture Flux:</span>
                  <span className="font-mono font-bold text-cyan-300">{moistureSlider.toFixed(1)} g/kg·m/s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="70"
                  step="1"
                  value={moistureSlider}
                  onChange={(e) => setMoistureSlider(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={handleApplySimulation}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all shadow-md"
            >
              RUN REGIME CLASSIFIER &amp; RE-PREDICT
            </button>
            <button
              onClick={handleResetDefaults}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-3 rounded-lg text-xs transition-all"
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {/* 7 Canonical Indian Regimes Reference Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-purple-400" />
          7 CANONICAL INDIAN WEATHER REGIMES &amp; NWP ERROR BEHAVIORS
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Weather Regime</th>
                <th className="py-2.5 px-3">NWP Systematic Error Pattern</th>
                <th className="py-2.5 px-3">VARSHAAI Correction Mechanism</th>
                <th className="py-2.5 px-3">Active Dedicated Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {regimesList.map((r) => {
                const isActive = r.name === currentForecast.detected_regime;
                return (
                  <tr
                    key={r.name}
                    className={`transition-all ${
                      isActive ? 'bg-purple-950/40 font-semibold text-white' : 'text-slate-300 hover:bg-slate-950/40'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
                        <span className={isActive ? 'text-purple-300 font-bold' : 'text-slate-200'}>
                          {r.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{r.biasProfile}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-medium">{r.correctionBehavior}</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">{r.model}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
