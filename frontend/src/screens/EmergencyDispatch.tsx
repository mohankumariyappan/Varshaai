import React, { useEffect, useState } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  FileCode2, 
  Globe2, 
  Truck, 
  Copy, 
  Check, 
  Volume2, 
  Users, 
  Anchor, 
  Building 
} from 'lucide-react';
import { api } from '../services/api';
import { CAPAlertResponse, MultilingualBroadcastsResponse, DisasterLogisticsResponse } from '../types';

interface EmergencyDispatchProps {
  districtId: string;
  leadTime: number;
}

export const EmergencyDispatch: React.FC<EmergencyDispatchProps> = ({ districtId, leadTime }) => {
  const [capData, setCapData] = useState<CAPAlertResponse | null>(null);
  const [multilingual, setMultilingual] = useState<MultilingualBroadcastsResponse | null>(null);
  const [logistics, setLogistics] = useState<DisasterLogisticsResponse | null>(null);
  const [activeLang, setActiveLang] = useState<string>('en');
  const [viewFormat, setViewFormat] = useState<'visual' | 'xml' | 'json'>('visual');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCAPAlert(districtId, leadTime),
      api.getMultilingualBroadcasts(districtId, leadTime),
      api.getDisasterLogistics(districtId, leadTime)
    ])
      .then(([cap, multi, log]) => {
        setCapData(cap);
        setMultilingual(multi);
        setLogistics(log);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [districtId, leadTime]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="animate-spin mr-3 text-cyan-400">●</div> Generating ITU-T X.1303 CAP alerts and dispatching disaster logistics...
      </div>
    );
  }

  if (!capData || !multilingual || !logistics) {
    return <div className="p-4 text-center text-slate-400">Emergency dispatch telemetry unavailable.</div>;
  }

  const currentBroadcast = multilingual.broadcasts[activeLang] || multilingual.broadcasts['en'];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Protocol Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h2 className="text-xl font-black text-white tracking-wide">
              NDMA CAP v1.2 EMERGENCY ALERT &amp; DISPATCHER
            </h2>
            <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-600/40 px-2 py-0.5 rounded font-mono font-bold">
              PROTOCOL: ITU-T X.1303 / OASIS CAP-1.2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized machine-readable Common Alerting Protocol generation with autonomous multilingual citizen warning broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">ALERT ID:</span>
          <span className="text-cyan-400 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {capData.identifier}
          </span>
        </div>
      </div>

      {/* Grid: CAP Protocol & Multilingual Citizen Broadcasts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Multilingual Citizen Broadcast Center */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Multilingual Citizen Broadcast Network
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">
              6 LANGUAGES ACTIVE
            </span>
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'हिन्दी (Hindi)' },
              { id: 'ta', label: 'தமிழ் (Tamil)' },
              { id: 'ml', label: 'മലയാളം (Malayalam)' },
              { id: 'mr', label: 'मराठी (Marathi)' },
              { id: 'bn', label: 'বাংলা (Bengali)' }
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => setActiveLang(lang.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all border ${
                  activeLang === lang.id
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Broadcast Content Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Cellular Broadcast Payload ({currentBroadcast.language})
                </span>
              </div>
              <button
                onClick={() => handleCopy(currentBroadcast.text)}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-700 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Alert'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-sm leading-relaxed text-slate-200 font-medium">
              "{currentBroadcast.text}"
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Text-to-Speech IVR Siren: <strong className="text-emerald-400">READY</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cell Broadcast (CB): <strong className="text-emerald-400">SYNCHRONIZED</strong></span>
              </div>
            </div>
          </div>

          {/* Proactive Taskforce Logistics */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Proactive Disaster Taskforce Allocation
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-mono">NDRF Teams</span>
                <span className="text-sm font-black text-white font-mono">{logistics.ndrf_battalion.teams_deployed} Units</span>
                <span className="text-[9px] text-slate-500 block">({logistics.ndrf_battalion.personnel_count} Rescuers)</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <Anchor className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-mono">Flood Boats</span>
                <span className="text-sm font-black text-sky-400 font-mono">{logistics.heavy_equipment.inflatable_inundation_boats} Boats</span>
                <span className="text-[9px] text-slate-500 block">Motorized Inflatable</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <Building className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-mono">Relief Shelters</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{logistics.shelter_infrastructure.active_shelters} Active</span>
                <span className="text-[9px] text-slate-500 block">Cap: {logistics.shelter_infrastructure.total_bed_capacity}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Staging Hub: <strong className="text-white">{logistics.ndrf_battalion.staging_base}</strong></span>
              <span className="text-rose-400 font-bold font-mono">STATUS: {logistics.ndrf_battalion.readiness_state}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Standardized CAP v1.2 Protocol Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                ITU-T X.1303 CAP Protocol Inspector
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-[10px] font-bold">
              <button
                onClick={() => setViewFormat('visual')}
                className={`px-2 py-0.5 rounded transition-all ${viewFormat === 'visual' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewFormat('xml')}
                className={`px-2 py-0.5 rounded transition-all ${viewFormat === 'xml' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                CAP XML
              </button>
              <button
                onClick={() => setViewFormat('json')}
                className={`px-2 py-0.5 rounded transition-all ${viewFormat === 'json' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                CAP JSON
              </button>
            </div>
          </div>

          {viewFormat === 'visual' ? (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Headline:</span>
                  <span className="text-white font-bold">{capData.headline}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Severity</span>
                    <span className="font-bold text-rose-400 font-mono">{capData.severity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Urgency</span>
                    <span className="font-bold text-amber-400 font-mono">{capData.urgency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Certainty</span>
                    <span className="font-bold text-emerald-400 font-mono">{capData.certainty}</span>
                  </div>
                </div>
                <div className="border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Description</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{capData.description}</p>
                </div>
                <div className="border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Operational Instruction</span>
                  <p className="text-cyan-300 font-semibold mt-0.5 leading-relaxed">{capData.instruction}</p>
                </div>
              </div>

              <div className="bg-cyan-950/20 border border-cyan-800/40 p-3 rounded-lg text-slate-300 text-[11px] leading-relaxed">
                💡 <strong>Interop Compliance:</strong> This payload adheres strictly to OASIS Common Alerting Protocol v1.2 and is immediately ingested by NDMA SACHET, the National Disaster Management Information System (NDMIS), and State Emergency Operations Centers.
              </div>
            </div>
          ) : viewFormat === 'xml' ? (
            <div className="relative">
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-cyan-300 overflow-x-auto max-h-[360px] leading-tight">
                {capData.xml_payload}
              </pre>
            </div>
          ) : (
            <div className="relative">
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-emerald-300 overflow-x-auto max-h-[360px] leading-tight">
                {JSON.stringify(capData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
