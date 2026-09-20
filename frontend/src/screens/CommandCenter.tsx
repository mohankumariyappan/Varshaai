import React from 'react';
import { 
  CloudRain, 
  Compass, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Info,
  Clock
} from 'lucide-react';
import { DistrictForecast, MapFeatureProperties } from '../types';
import { InteractiveMap, getRainfallColor } from '../components/map/InteractiveMap';
import { ScreenId } from '../components/layout/NavigationTabs';

interface CommandCenterProps {
  currentForecast: DistrictForecast | null;
  mapFeatures: Array<{
    geometry: { coordinates: [number, number] };
    properties: MapFeatureProperties;
  }>;
  selectedDistrict: string;
  onSelectDistrict: (id: string) => void;
  leadTime: number;
  onLeadTimeChange: (lt: number) => void;
  onNavigateScreen: (screen: ScreenId) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  currentForecast,
  mapFeatures,
  selectedDistrict,
  onSelectDistrict,
  leadTime,
  onLeadTimeChange,
  onNavigateScreen
}) => {
  if (!currentForecast) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="animate-spin mr-3 text-cyan-400">●</div> Loading meteorological command center...
      </div>
    );
  }

  const confidencePct = Math.round(currentForecast.regime_confidence * 100);
  const changeIsPositive = currentForecast.change >= 0;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top 4 Meteorological Intelligence Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Detected Weather Regime */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-400" />
              CURRENT WEATHER REGIME
            </span>
            <span className="bg-purple-950 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-800 text-[10px]">
              SYNOPTIC
            </span>
          </div>

          <h3 className="text-xl font-black text-purple-300 uppercase tracking-wide">
            {currentForecast.detected_regime}
          </h3>

          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Confidence:</span>
              <span className="font-mono font-bold text-emerald-400">{confidencePct}%</span>
            </div>
            {/* Visual confidence bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${confidencePct}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Moisture:</span>
                <span className="font-semibold text-slate-200">{currentForecast.atmospheric_profile.moisture_flux.assessment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pressure:</span>
                <span className="font-semibold text-slate-200">{currentForecast.atmospheric_profile.pressure_anomaly.assessment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Convergence:</span>
                <span className="font-semibold text-slate-200">{currentForecast.atmospheric_profile.wind_convergence.assessment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NWP Baseline:</span>
                <span className="font-semibold text-amber-400">{currentForecast.raw_nwp} mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: AI Corrected Rainfall */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold tracking-wider uppercase flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              AI CORRECTED RAINFALL
            </span>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              +{currentForecast.lead_time}h
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">
              {currentForecast.corrected_rainfall}
            </span>
            <span className="text-sm font-bold text-slate-400">mm</span>
            <span className={`text-xs font-mono font-bold flex items-center ml-auto ${
              changeIsPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {changeIsPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {changeIsPositive ? `+${currentForecast.change}` : currentForecast.change} mm
            </span>
          </div>

          <div className="mt-3 space-y-1 text-xs border-t border-slate-800/80 pt-2">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Quantile Uncertainty Range:</span>
              <span className="font-mono font-bold text-slate-200">
                {currentForecast.uncertainty_interval.lower_bound} – {currentForecast.uncertainty_interval.upper_bound} mm
              </span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Heavy Rain Probability (&gt;64.5mm):</span>
              <span className="font-mono font-bold text-rose-400">
                {Math.round(currentForecast.heavy_rain_probability * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Correction Model Applied:</span>
              <span className="font-medium text-cyan-300 truncate max-w-[140px]">
                {currentForecast.model_selected}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: RAW NWP vs VARSHAAI Comparison */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold tracking-wider uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              RAW NWP VS VARSHAAI
            </span>
            <button
              onClick={() => onNavigateScreen('forecast-comparison')}
              className="text-[10px] text-cyan-400 hover:underline font-semibold"
            >
              DETAILS →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">RAW NWP</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-amber-400">{currentForecast.raw_nwp}</span>
                <span className="text-[10px] text-slate-400">mm</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Global Ensemble</span>
            </div>

            <div className="bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/40">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">VARSHAAI AI</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black font-mono text-cyan-400">{currentForecast.corrected_rainfall}</span>
                <span className="text-[10px] text-slate-400">mm</span>
              </div>
              <span className="text-[9px] text-cyan-300/80 block mt-1">Debiased &amp; Calibrated</span>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-300 bg-slate-950/80 p-1.5 rounded border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">NWP Model Bias Corrected:</span>
            <span className="font-mono font-bold text-emerald-400">
              {currentForecast.change >= 0 ? `+${currentForecast.change}` : currentForecast.change} mm
            </span>
          </div>
        </div>

        {/* Card 4: Risk Radar / Action Advisory */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold tracking-wider uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              DECISION RISK RADAR
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
              currentForecast.risk_assessment.alert_level === 'RED' ? 'bg-red-950 text-red-400 border-red-800' :
              currentForecast.risk_assessment.alert_level === 'ORANGE' ? 'bg-orange-950 text-orange-400 border-orange-800' :
              currentForecast.risk_assessment.alert_level === 'YELLOW' ? 'bg-yellow-950 text-yellow-400 border-yellow-800' :
              'bg-emerald-950 text-emerald-400 border-emerald-800'
            }`}>
              {currentForecast.risk_assessment.alert_level} ALERT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-2xl font-black font-mono text-slate-100">
              {currentForecast.risk_assessment.risk_index}
              <span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    currentForecast.risk_assessment.risk_index >= 80 ? 'bg-red-500' :
                    currentForecast.risk_assessment.risk_index >= 60 ? 'bg-orange-500' :
                    currentForecast.risk_assessment.risk_index >= 35 ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${currentForecast.risk_assessment.risk_index}%` }}
                ></div>
              </div>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
            {currentForecast.risk_assessment.action_recommendation}
          </p>

          <button
            onClick={() => onNavigateScreen('explainability')}
            className="mt-2 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            WHY DID FORECAST CHANGE? →
          </button>
        </div>
      </div>

      {/* Main Map & District Twin Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Map: 8 Cols */}
        <div className="lg:col-span-8 flex flex-col h-[520px]">
          <InteractiveMap
            features={mapFeatures}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={onSelectDistrict}
            leadTime={leadTime}
            onLeadTimeChange={onLeadTimeChange}
            enableSplitSlider={true}
          />
        </div>

        {/* Right District Weather Twin Card: 4 Cols */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                  DISTRICT WEATHER TWIN
                </span>
                <h3 className="text-xl font-black text-white">{currentForecast.district_name}</h3>
                <span className="text-xs text-slate-400">{currentForecast.state} • {currentForecast.subdivision}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border font-mono ${
                currentForecast.risk_assessment.alert_level === 'RED' ? 'bg-red-950 text-red-400 border-red-800' :
                currentForecast.risk_assessment.alert_level === 'ORANGE' ? 'bg-orange-950 text-orange-400 border-orange-800' :
                currentForecast.risk_assessment.alert_level === 'YELLOW' ? 'bg-yellow-950 text-yellow-400 border-yellow-800' :
                'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}>
                {currentForecast.risk_assessment.alert_level}
              </span>
            </div>

            {/* Geographical Attributes */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Elevation</span>
                <span className="font-mono font-bold text-slate-200">{currentForecast.elevation} m</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Coastal</span>
                <span className="font-mono font-bold text-slate-200">{currentForecast.is_coastal ? 'YES' : 'NO'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Coordinates</span>
                <span className="font-mono text-[10px] text-slate-200">{currentForecast.lat}°N, {currentForecast.lon}°E</span>
              </div>
            </div>

            {/* Atmospheric Soundings Quick View */}
            <div className="space-y-1.5 text-xs mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                ATMOSPHERIC SOUNDING INDICES:
              </span>
              <div className="flex justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400">850 hPa Moisture Flux:</span>
                <span className="font-mono font-semibold text-cyan-300">
                  {currentForecast.atmospheric_profile.moisture_flux.value} g/kg·m/s ({currentForecast.atmospheric_profile.moisture_flux.assessment})
                </span>
              </div>
              <div className="flex justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400">Surface Pressure Anomaly:</span>
                <span className="font-mono font-semibold text-purple-300">
                  {currentForecast.atmospheric_profile.pressure_anomaly.value} hPa
                </span>
              </div>
              <div className="flex justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400">Wind Confluence / Convergence:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {currentForecast.atmospheric_profile.wind_convergence.value} × 10⁻⁵ s⁻¹
                </span>
              </div>
              <div className="flex justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400">Convective Instability (CAPE):</span>
                <span className="font-mono font-semibold text-amber-400">
                  {currentForecast.atmospheric_profile.cape.value} J/kg
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => onNavigateScreen('district-twin')}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>INSPECT FULL DIGITAL TWIN</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateScreen('historical-replay')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>REPLAY HISTORICAL EXTREME EVENTS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forecast Progression Timeline (06h -> 48h) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase">
              ACCUMULATED RAINFALL FORECAST TIMELINE ({currentForecast.district_name})
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Lead times: 06h — 48h</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {currentForecast.timeline.map((point) => (
            <div
              key={point.lead_time}
              onClick={() => onLeadTimeChange(point.hours)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                leadTime === point.hours
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono font-bold mb-1">
                <span className={leadTime === point.hours ? 'text-cyan-400' : 'text-slate-400'}>
                  +{point.lead_time}
                </span>
                <span className="text-[10px] text-slate-400">
                  {Math.round(point.heavy_rain_probability * 100)}% prob
                </span>
              </div>

              <div className="text-lg font-black font-mono text-white">
                {point.corrected_rainfall} <span className="text-[10px] font-normal text-slate-400">mm</span>
              </div>

              <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                <span>NWP:</span>
                <span className="text-amber-400 font-mono">{point.nwp_rainfall} mm</span>
              </div>

              <div className="text-[9px] text-slate-400 mt-0.5">
                Interval: {point.lower_bound}–{point.upper_bound} mm
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
