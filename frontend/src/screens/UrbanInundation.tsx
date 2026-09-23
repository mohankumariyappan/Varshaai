import React, { useEffect, useState } from 'react';
import { 
  Waves, 
  AlertTriangle, 
  CheckCircle2, 
  Car, 
  Dam, 
  Gauge, 
  TrendingUp, 
  Clock, 
  Droplet,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { UrbanInundationResponse, ReservoirsResponse } from '../types';

interface UrbanInundationProps {
  districtId: string;
  leadTime: number;
}

export const UrbanInundation: React.FC<UrbanInundationProps> = ({ districtId, leadTime }) => {
  const [inundation, setInundation] = useState<UrbanInundationResponse | null>(null);
  const [reservoirs, setReservoirs] = useState<ReservoirsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getUrbanInundation(districtId, leadTime),
      api.getReservoirs(districtId, leadTime)
    ])
      .then(([inundData, resData]) => {
        setInundation(inundData);
        setReservoirs(resData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [districtId, leadTime]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="animate-spin mr-3 text-cyan-400">●</div> Simulating hydrodynamic runoff and catchment inflows...
      </div>
    );
  }

  if (!inundation || !reservoirs) {
    return <div className="p-4 text-center text-slate-400">Hydrological telemetry unavailable.</div>;
  }

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Hydrological Situation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-black text-white tracking-wide">
              URBAN INUNDATION &amp; DAM DIGITAL TWIN
            </h2>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-mono font-bold">
              +{leadTime}h FORECAST HORIZON
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Coupling VARSHAAI regime-corrected rainfall with hydrological runoff depth and dam inflow optimization for {inundation.city_name}.
          </p>
        </div>

        {/* Severity Banner */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Soil Saturation</span>
            <span className="text-base font-black text-cyan-400 font-mono">{inundation.soil_saturation_pct}%</span>
          </div>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-bold text-xs ${
            inundation.overall_inundation_severity === 'EXTREME'
              ? 'bg-red-950/80 border-red-600 text-red-300'
              : inundation.overall_inundation_severity === 'MODERATE'
              ? 'bg-amber-950/80 border-amber-600 text-amber-300'
              : 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
          }`}>
            <ShieldAlert className="w-4 h-4" />
            <span>INUNDATION RISK: {inundation.overall_inundation_severity}</span>
          </div>
        </div>
      </div>

      {/* Grid: Street-Level Waterlogging vs Dam Catchment Twin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Section 1: Hyperlocal Street Waterlogging & Underpasses */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Street-Level Waterlogging &amp; Trafficability
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Impassable: <span className="text-rose-400 font-bold">{inundation.impassable_routes_count}</span> | Caution: <span className="text-amber-400 font-bold">{inundation.caution_routes_count}</span>
            </span>
          </div>

          {/* Hotspots List */}
          <div className="space-y-2.5">
            {inundation.hotspots.map((h, i) => (
              <div 
                key={i} 
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3 rounded-lg flex items-center justify-between gap-3 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{h.location}</span>
                    <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      {h.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span>Traffic: <strong className={h.status === 'IMPASSABLE' ? 'text-rose-400' : (h.status === 'CAUTION' ? 'text-amber-400' : 'text-emerald-400')}>{h.trafficability}</strong></span>
                    <span>Pumps Needed: <strong className="text-cyan-400 font-mono">{h.submersible_pumps_needed}x</strong></span>
                  </div>
                </div>

                {/* Depth Badge */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Flood Depth</span>
                  <span className={`text-base font-black font-mono ${
                    h.depth_cm > 40 ? 'text-rose-400' : (h.depth_cm > 20 ? 'text-amber-400' : 'text-emerald-400')
                  }`}>
                    {h.depth_cm} cm
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recession & Dewatering Action */}
          <div className="bg-cyan-950/30 border border-cyan-800/40 p-3 rounded-lg flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Est. Flood Recession: <strong className="text-cyan-300 font-mono">{inundation.recession_estimated_hrs} Hours</strong></span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{inundation.de_watering_action}</span>
          </div>
        </div>

        {/* Section 2: Reservoir Catchment Inflows & Sluice Gate Release Optimizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Dam className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Reservoir Inflow &amp; Gate Optimization
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Driven by <strong className="text-cyan-400">{reservoirs.rainfall_driver_mm} mm</strong> ({reservoirs.catchment_regime})
            </span>
          </div>

          {/* Reservoirs Cards */}
          <div className="space-y-3">
            {reservoirs.reservoirs.map((r, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 p-3 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      {r.name}
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono font-bold ${
                        r.alert_level === 'CRITICAL' || r.alert_level === 'RED'
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : (r.alert_level === 'HIGH ALERT' || r.alert_level === 'WATCH'
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700')
                      }`}>
                        {r.alert_level}
                      </span>
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Level: {r.current_level_ft} ft / {r.max_level_ft} ft (Full Tank)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {r.current_storage_tmc} / {r.full_capacity_tmc} TMC
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">({r.storage_percentage}%)</span>
                  </div>
                </div>

                {/* Storage Percentage Bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      r.storage_percentage > 90 ? 'bg-rose-500' : (r.storage_percentage > 75 ? 'bg-amber-500' : 'bg-cyan-500')
                    }`}
                    style={{ width: `${Math.min(100, r.storage_percentage)}%` }}
                  />
                </div>

                {/* Inflow vs Controlled Release Stats */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2 rounded border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Predicted Catchment Inflow</span>
                    <span className="font-bold text-sky-400 font-mono text-xs">{r.projected_inflow_cumecs.toLocaleString()} cumecs</span>
                    <span className="text-[9px] text-slate-500 block">Peak Surge: {r.worst_case_inflow_cumecs.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Recommended Gate Release</span>
                    <span className="font-bold text-amber-400 font-mono text-xs">{r.recommended_discharge_cumecs.toLocaleString()} cumecs</span>
                    <span className="text-[9px] text-slate-500 block">Lead-time to Full: {r.danger_lead_time_hrs}h</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-300 font-semibold flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>Directive: <strong className="text-cyan-300">{r.operational_directive}</strong></span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Downstream Alert Banner */}
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-center gap-2 text-xs text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px]">{reservoirs.downstream_floodplain_warning}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
