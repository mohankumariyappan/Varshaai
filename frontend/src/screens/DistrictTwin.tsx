import React from 'react';
import { Building2, Compass, Droplets, Wind, Gauge, ShieldAlert, ArrowUpRight, ArrowDownRight, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { DistrictForecast } from '../types';

interface DistrictTwinProps {
  currentForecast: DistrictForecast | null;
  districts: Array<{ id: string; name: string; state: string }>;
  onSelectDistrict: (id: string) => void;
  leadTime: number;
  onLeadTimeChange: (lt: number) => void;
}

export const DistrictTwin: React.FC<DistrictTwinProps> = ({
  currentForecast,
  districts,
  onSelectDistrict,
  leadTime,
  onLeadTimeChange
}) => {
  if (!currentForecast) return null;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Header & District Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">
                DISTRICT DIGITAL WEATHER TWIN
              </h2>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                HIGH RESOLUTION HYDROMET
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Localized atmospheric state, regime-specific debiasing, and lead-time accumulation envelope.
            </p>
          </div>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400 font-medium">Switch Target:</span>
          <select
            value={currentForecast.district_id}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}, {d.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Twin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Current Weather Regime & Confidence */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">
              REGIME CLASSIFICATION
            </span>
            <h3 className="text-2xl font-black text-purple-300 uppercase">
              {currentForecast.detected_regime}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-400">Classifier Confidence:</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {Math.round(currentForecast.regime_confidence * 100)}%
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${currentForecast.regime_confidence * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
            <span className="text-slate-400 block text-[11px]">ACTIVE ML ENGINE:</span>
            <span className="font-mono font-semibold text-cyan-400">{currentForecast.model_selected}</span>
          </div>
        </div>

        {/* Card 2: NWP vs VARSHAAI Forecast */}
        <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span className="font-bold text-cyan-400 uppercase tracking-wider">RAINFALL FORECAST (+{currentForecast.lead_time}h)</span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                CORRECTED
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-black font-mono text-white">
                {currentForecast.corrected_rainfall}
              </span>
              <span className="text-sm font-bold text-slate-400">mm</span>
              <span className="ml-auto text-xs font-mono font-bold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{currentForecast.change} mm
              </span>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded border border-slate-800 mt-2">
              <span className="text-slate-400">Raw NWP Baseline:</span>
              <span className="font-mono font-bold text-amber-400">{currentForecast.raw_nwp} mm</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Uncertainty Range:</span>
              <span className="font-mono font-bold text-slate-200">
                {currentForecast.uncertainty_interval.lower_bound} – {currentForecast.uncertainty_interval.upper_bound} mm
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Heavy Rain Probability & Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span className="font-bold text-rose-400 uppercase tracking-wider">HEAVY RAIN RISK</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                currentForecast.risk_assessment.alert_level === 'RED' ? 'bg-red-950 text-red-400 border border-red-800' :
                currentForecast.risk_assessment.alert_level === 'ORANGE' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                currentForecast.risk_assessment.alert_level === 'YELLOW' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {currentForecast.risk_assessment.alert_level}
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-black font-mono text-rose-400">
                {Math.round(currentForecast.heavy_rain_probability * 100)}%
              </span>
              <span className="text-xs text-slate-400 font-medium">Probability of &gt;64.5 mm</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              {currentForecast.risk_assessment.action_recommendation}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Last Model Update:</span>
            <span className="font-mono text-slate-300 font-semibold">{currentForecast.last_updated}</span>
          </div>
        </div>
      </div>

      {/* Forecast Timeline Progression (06h - 48h) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              {currentForecast.district_name} ACCUMULATED HYDROLOGICAL TIMELINE
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Lead times: 06h, 12h, 18h, 24h, 36h, 48h</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {currentForecast.timeline.map((point) => (
            <div
              key={point.lead_time}
              onClick={() => onLeadTimeChange(point.hours)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                leadTime === point.hours
                  ? 'bg-cyan-950/70 border-cyan-500 shadow-lg ring-1 ring-cyan-500'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400">+{point.lead_time}</span>
                <span className="text-[10px] text-rose-400 font-mono font-bold">
                  {Math.round(point.heavy_rain_probability * 100)}%
                </span>
              </div>

              <div className="text-xl font-black font-mono text-white mt-1">
                {point.corrected_rainfall} <span className="text-xs text-slate-400 font-normal">mm</span>
              </div>

              <div className="text-[11px] text-amber-400 font-mono mt-1">
                NWP: {point.nwp_rainfall} mm
              </div>

              <div className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
                Range: {point.lower_bound}–{point.upper_bound} mm
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Sounding Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
          ATMOSPHERIC SOUNDING INDICES &amp; GEOGRAPHICAL CONTEXT
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Surface Pressure Anomaly</span>
            <span className="text-lg font-black font-mono text-purple-300">
              {currentForecast.atmospheric_profile.pressure_anomaly.value} hPa
            </span>
            <span className="text-[10px] text-purple-400 block mt-0.5">
              {currentForecast.atmospheric_profile.pressure_anomaly.assessment}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Total Moisture Flux</span>
            <span className="text-lg font-black font-mono text-cyan-300">
              {currentForecast.atmospheric_profile.moisture_flux.value} g/kg·m/s
            </span>
            <span className="text-[10px] text-cyan-400 block mt-0.5">
              {currentForecast.atmospheric_profile.moisture_flux.assessment}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Wind Convergence</span>
            <span className="text-lg font-black font-mono text-emerald-400">
              {currentForecast.atmospheric_profile.wind_convergence.value} × 10⁻⁵ s⁻¹
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              {currentForecast.atmospheric_profile.wind_convergence.assessment}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">850 hPa Humidity</span>
            <span className="text-lg font-black font-mono text-blue-400">
              {currentForecast.atmospheric_profile.humidity_850.value}%
            </span>
            <span className="text-[10px] text-blue-400 block mt-0.5">
              {currentForecast.atmospheric_profile.humidity_850.assessment}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
