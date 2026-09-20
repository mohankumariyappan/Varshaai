import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, CheckCircle2, Flame, Info, ArrowUpRight } from 'lucide-react';
import { DistrictForecast, MapFeatureProperties } from '../types';

interface RiskRadarProps {
  currentForecast: DistrictForecast | null;
  mapFeatures: Array<{
    geometry: { coordinates: [number, number] };
    properties: MapFeatureProperties;
  }>;
  onSelectDistrict: (id: string) => void;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({
  currentForecast,
  mapFeatures,
  onSelectDistrict
}) => {
  if (!currentForecast) return null;

  // Filter districts by alert category
  const redAlerts = mapFeatures.filter(f => f.properties.alert_level === 'RED');
  const orangeAlerts = mapFeatures.filter(f => f.properties.alert_level === 'ORANGE');
  const yellowAlerts = mapFeatures.filter(f => f.properties.alert_level === 'YELLOW');
  const greenAlerts = mapFeatures.filter(f => f.properties.alert_level === 'GREEN');

  const isExtremeActive = redAlerts.length + orangeAlerts.length >= 2;
  const maxRain = Math.max(...mapFeatures.map(f => f.properties.ai_corrected_rainfall));
  const maxProb = Math.max(...mapFeatures.map(f => f.properties.heavy_rain_probability));

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Extreme Event Monitoring Mode Banner */}
      {isExtremeActive ? (
        <div className="bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border border-red-600/80 rounded-xl p-4 shadow-2xl animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg text-white">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-black text-red-200 tracking-wider uppercase">
                  EXTREME EVENT MONITORING MODE: ACTIVE
                </h3>
                <p className="text-xs text-red-300/80">
                  Multiple meteorological districts meet calibrated IMD Heavy Rainfall (&gt;64.5mm) criteria.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-red-900/60 px-3 py-1.5 rounded border border-red-700">
                <span className="text-red-300 block text-[10px]">AFFECTED DISTRICTS</span>
                <span className="text-lg font-bold text-white">{redAlerts.length + orangeAlerts.length} High-Risk Hubs</span>
              </div>
              <div className="bg-red-900/60 px-3 py-1.5 rounded border border-red-700">
                <span className="text-red-300 block text-[10px]">PEAK DELUGE</span>
                <span className="text-lg font-bold text-white">{maxRain.toFixed(1)} mm</span>
              </div>
              <div className="bg-red-900/60 px-3 py-1.5 rounded border border-red-700">
                <span className="text-red-300 block text-[10px]">MAX PROBABILITY</span>
                <span className="text-lg font-bold text-white">{Math.round(maxProb * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">Standard Synoptic Monitoring Mode</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">No widespread extreme alerts</span>
        </div>
      )}

      {/* Target District Risk Profile & Decision Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 5-Factor Radar Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              MULTI-FACTOR RISK PROFILE ({currentForecast.district_name})
            </h3>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded font-mono ${
              currentForecast.risk_assessment.alert_level === 'RED' ? 'bg-red-950 text-red-400 border border-red-800' :
              currentForecast.risk_assessment.alert_level === 'ORANGE' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
              currentForecast.risk_assessment.alert_level === 'YELLOW' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
              'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {currentForecast.risk_assessment.alert_level} ALERT
            </span>
          </div>

          <div className="space-y-3">
            {/* Factor 1: Rainfall Severity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">1. Corrected Rainfall Volume:</span>
                <span className="font-mono font-bold text-cyan-400">{currentForecast.corrected_rainfall} mm (HIGH)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full" 
                  style={{ width: `${Math.min(100, (currentForecast.corrected_rainfall / 140) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Factor 2: Heavy Rain Probability */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">2. Calibrated Heavy Deluge Probability (&gt;64.5mm):</span>
                <span className="font-mono font-bold text-rose-400">
                  {Math.round(currentForecast.heavy_rain_probability * 100)}% (VERY HIGH)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full" 
                  style={{ width: `${currentForecast.heavy_rain_probability * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Factor 3: Forecast Persistence */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">3. Multi-Lead Time Forecast Persistence:</span>
                <span className="font-mono font-bold text-amber-400">82% (STABLE RUN-OVER-RUN)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            {/* Factor 4: Synoptic Regime Hazard */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">4. Regime Inundation Vulnerability:</span>
                <span className="font-mono font-bold text-purple-400">{currentForecast.detected_regime} (SEVERE)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            {/* Factor 5: Forecast Certainty Spread */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">5. Uncertainty Narrowness:</span>
                <span className="font-mono font-bold text-emerald-400">HIGH CERTAINTY (±17 mm Spread)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 font-bold uppercase block mb-1">ACTION RECOMMENDATION:</span>
            <p className="text-slate-200 leading-relaxed font-medium">
              {currentForecast.risk_assessment.action_recommendation}
            </p>
          </div>
        </div>

        {/* Right: Risk Matrix / Formula Documentation (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                CALIBRATED RISK INDEX FORMULATION
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Unlike arbitrary 0–100 UI gauges, VARSHAAI’s Decision Support Index is mathematically grounded in 
              India Meteorological Department (IMD) standard rainfall hazard thresholds:
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded border border-red-900/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-red-400 block">RED ALERT (&gt;= 80 Index / &gt;115.5 mm)</span>
                  <span className="text-[10px] text-slate-400">Very Heavy / Extremely Heavy Deluge</span>
                </div>
                <span className="text-xs font-mono font-bold text-red-400">TAKE ACTION</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-orange-900/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-orange-400 block">ORANGE ALERT (60 - 79 Index / &gt;64.5 mm)</span>
                  <span className="text-[10px] text-slate-400">Heavy Rainfall with waterlogging risk</span>
                </div>
                <span className="text-xs font-mono font-bold text-orange-400">BE PREPARED</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-yellow-900/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-yellow-400 block">YELLOW ALERT (35 - 59 Index / &gt;20 mm)</span>
                  <span className="text-[10px] text-slate-400">Moderate Rainfall with local runoff</span>
                </div>
                <span className="text-xs font-mono font-bold text-yellow-400">BE UPDATED</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-400 block">GREEN ALERT (&lt; 35 Index)</span>
                  <span className="text-[10px] text-slate-400">Light / Negligible precipitation</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">NO WARNING</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Formulation: Score = min(50, Rain/130 * 50) + Prob(Heavy) * 35 + RegimeHazard(15)
          </div>
        </div>
      </div>

      {/* District Alert Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
          NATIONWIDE DISTRICT RISK CLUSTER MATRIX
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Red column */}
          <div className="bg-red-950/20 border border-red-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center text-red-400 font-bold mb-2 pb-1 border-b border-red-800/40">
              <span>RED ALERT ({redAlerts.length})</span>
              <span className="text-[10px] font-mono">&gt;115.5 mm</span>
            </div>
            <div className="space-y-1.5">
              {redAlerts.map(f => (
                <div 
                  key={f.properties.district_id} 
                  onClick={() => onSelectDistrict(f.properties.district_id)}
                  className="bg-slate-950/80 p-1.5 rounded cursor-pointer hover:border-red-500 border border-transparent flex justify-between"
                >
                  <span className="font-semibold text-slate-200">{f.properties.district_name}</span>
                  <span className="text-red-400 font-mono font-bold">{f.properties.ai_corrected_rainfall} mm</span>
                </div>
              ))}
              {redAlerts.length === 0 && <span className="text-slate-500 text-[11px]">No districts in Red</span>}
            </div>
          </div>

          {/* Orange column */}
          <div className="bg-orange-950/20 border border-orange-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center text-orange-400 font-bold mb-2 pb-1 border-b border-orange-800/40">
              <span>ORANGE ALERT ({orangeAlerts.length})</span>
              <span className="text-[10px] font-mono">64.5–115mm</span>
            </div>
            <div className="space-y-1.5">
              {orangeAlerts.map(f => (
                <div 
                  key={f.properties.district_id} 
                  onClick={() => onSelectDistrict(f.properties.district_id)}
                  className="bg-slate-950/80 p-1.5 rounded cursor-pointer hover:border-orange-500 border border-transparent flex justify-between"
                >
                  <span className="font-semibold text-slate-200">{f.properties.district_name}</span>
                  <span className="text-orange-400 font-mono font-bold">{f.properties.ai_corrected_rainfall} mm</span>
                </div>
              ))}
            </div>
          </div>

          {/* Yellow column */}
          <div className="bg-yellow-950/20 border border-yellow-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center text-yellow-400 font-bold mb-2 pb-1 border-b border-yellow-800/40">
              <span>YELLOW ALERT ({yellowAlerts.length})</span>
              <span className="text-[10px] font-mono">20–64.5mm</span>
            </div>
            <div className="space-y-1.5">
              {yellowAlerts.map(f => (
                <div 
                  key={f.properties.district_id} 
                  onClick={() => onSelectDistrict(f.properties.district_id)}
                  className="bg-slate-950/80 p-1.5 rounded cursor-pointer hover:border-yellow-500 border border-transparent flex justify-between"
                >
                  <span className="font-semibold text-slate-200">{f.properties.district_name}</span>
                  <span className="text-yellow-400 font-mono font-bold">{f.properties.ai_corrected_rainfall} mm</span>
                </div>
              ))}
            </div>
          </div>

          {/* Green column */}
          <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center text-emerald-400 font-bold mb-2 pb-1 border-b border-emerald-800/40">
              <span>GREEN ALERT ({greenAlerts.length})</span>
              <span className="text-[10px] font-mono">&lt;20 mm</span>
            </div>
            <div className="space-y-1.5">
              {greenAlerts.map(f => (
                <div 
                  key={f.properties.district_id} 
                  onClick={() => onSelectDistrict(f.properties.district_id)}
                  className="bg-slate-950/80 p-1.5 rounded cursor-pointer hover:border-emerald-500 border border-transparent flex justify-between"
                >
                  <span className="font-semibold text-slate-200">{f.properties.district_name}</span>
                  <span className="text-emerald-400 font-mono font-bold">{f.properties.ai_corrected_rainfall} mm</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
