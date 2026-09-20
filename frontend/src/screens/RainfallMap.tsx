import React, { useState } from 'react';
import { Layers, Sliders, MapPin, AlertTriangle, ShieldCheck, Compass, Info } from 'lucide-react';
import { MapFeatureProperties } from '../types';
import { InteractiveMap } from '../components/map/InteractiveMap';

interface RainfallMapProps {
  mapFeatures: Array<{
    geometry: { coordinates: [number, number] };
    properties: MapFeatureProperties;
  }>;
  selectedDistrict: string;
  onSelectDistrict: (id: string) => void;
  leadTime: number;
  onLeadTimeChange: (lt: number) => void;
}

export const RainfallMap: React.FC<RainfallMapProps> = ({
  mapFeatures,
  selectedDistrict,
  onSelectDistrict,
  leadTime,
  onLeadTimeChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeatures = mapFeatures.filter(f => 
    f.properties.district_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.properties.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFeature = mapFeatures.find(f => f.properties.district_id === selectedDistrict);

  // Aggregated spatial statistics
  const heavyRainCount = mapFeatures.filter(f => f.properties.ai_corrected_rainfall >= 64.5).length;
  const avgCorrection = (
    mapFeatures.reduce((acc, f) => acc + (f.properties.ai_corrected_rainfall - f.properties.raw_nwp_rainfall), 0) / 
    (mapFeatures.length || 1)
  ).toFixed(1);

  return (
    <div className="p-4 space-y-4 max-w-[1700px] mx-auto">
      {/* Title & Spatial Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-wide">
              INDIA RAINFALL INTELLIGENCE MAP
            </h2>
            <span className="text-[11px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-mono">
              HIGH-RESOLUTION GEOSPATIAL INTELLIGENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic regime classification and NWP bias correction mapped across meteorological subdivisions and district clusters.
          </p>
        </div>

        {/* Spatial Stats Summary */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Districts Monitored</span>
            <span className="text-base font-bold font-mono text-white">{mapFeatures.length} Key Hubs</span>
          </div>
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Heavy Rain Alert (&gt;64.5mm)</span>
            <span className="text-base font-bold font-mono text-rose-400">{heavyRainCount} Districts</span>
          </div>
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Mean AI Correction</span>
            <span className="text-base font-bold font-mono text-cyan-400">+{avgCorrection} mm</span>
          </div>
        </div>
      </div>

      {/* Main Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Large Map Canvas: 9 Cols */}
        <div className="lg:col-span-9 h-[620px]">
          <InteractiveMap
            features={mapFeatures}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={onSelectDistrict}
            leadTime={leadTime}
            onLeadTimeChange={onLeadTimeChange}
            enableSplitSlider={true}
          />
        </div>

        {/* Sidebar District List & Filter: 3 Cols */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col h-[620px]">
          <div className="mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              SEARCH &amp; SELECT DISTRICT
            </span>
            <input
              type="text"
              placeholder="Search district or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* District list */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredFeatures.map((f) => {
              const p = f.properties;
              const isSelected = p.district_id === selectedDistrict;
              return (
                <div
                  key={p.district_id}
                  onClick={() => onSelectDistrict(p.district_id)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{p.district_name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      p.alert_level === 'RED' ? 'bg-red-950 text-red-400 border border-red-800' :
                      p.alert_level === 'ORANGE' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      p.alert_level === 'YELLOW' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {p.alert_level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{p.state}</span>
                    <span className="font-mono text-purple-300 font-semibold">{p.weather_regime}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/80 text-[11px]">
                    <span className="text-amber-400">NWP: {p.raw_nwp_rainfall} mm</span>
                    <span className="text-cyan-400 font-bold font-mono">AI: {p.ai_corrected_rainfall} mm</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected District Snapshot */}
          {selectedFeature && (
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs bg-slate-950 p-2 rounded-lg">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">ACTIVE TARGET</span>
              <div className="flex justify-between items-baseline mt-0.5">
                <span className="font-bold text-white">{selectedFeature.properties.district_name}</span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {selectedFeature.properties.ai_corrected_rainfall} mm
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Regime: {selectedFeature.properties.weather_regime} ({(selectedFeature.properties.regime_confidence * 100).toFixed(0)}% conf)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
