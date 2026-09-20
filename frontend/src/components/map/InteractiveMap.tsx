import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { Layers, Sliders, Eye, AlertTriangle, ArrowRightLeft, Info } from 'lucide-react';
import { MapFeatureProperties, WeatherRegime } from '../../types';

export type MapLayerType = 
  | 'ai_corrected' 
  | 'raw_nwp' 
  | 'observed' 
  | 'heavy_prob' 
  | 'regime' 
  | 'forecast_error';

interface InteractiveMapProps {
  features: Array<{
    geometry: { coordinates: [number, number] };
    properties: MapFeatureProperties;
  }>;
  selectedDistrict: string;
  onSelectDistrict: (id: string) => void;
  leadTime: number;
  onLeadTimeChange: (lt: number) => void;
  enableSplitSlider?: boolean;
}

// IMD Standard Rainfall Color Scale
export const getRainfallColor = (mm: number): string => {
  if (mm <= 10) return '#38bdf8'; // Light Blue (0-10mm)
  if (mm <= 25) return '#22c55e'; // Green (10-25mm)
  if (mm <= 50) return '#eab308'; // Yellow (25-50mm)
  if (mm <= 100) return '#f97316'; // Orange (50-100mm)
  return '#ef4444'; // Red (100+ mm)
};

// Probability Color Scale
export const getProbabilityColor = (prob: number): string => {
  if (prob < 0.30) return '#38bdf8';
  if (prob < 0.60) return '#eab308';
  if (prob < 0.80) return '#f97316';
  return '#ef4444';
};

// Regime Color Mapping
export const getRegimeColor = (regime: WeatherRegime): string => {
  const map: Record<string, string> = {
    'Monsoon Depression': '#ef4444',
    'Active Monsoon': '#3b82f6',
    'Coastal System': '#06b6d4',
    'Orographic Rainfall': '#a855f7',
    'Western Disturbance': '#ec4899',
    'Localized Convective': '#f59e0b',
    'Break Monsoon': '#64748b'
  };
  return map[regime] || '#94a3b8';
};

// Error Color (Observed - NWP): Blue = NWP underpredicted, Red = NWP overpredicted
export const getErrorColor = (err: number): string => {
  if (err > 20) return '#ef4444'; // severe underestimation by NWP
  if (err > 5) return '#f97316';
  if (err < -5) return '#3b82f6'; // NWP overpredicted
  return '#22c55e'; // NWP was accurate
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  features,
  selectedDistrict,
  onSelectDistrict,
  leadTime,
  onLeadTimeChange,
  enableSplitSlider = true
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('ai_corrected');
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50); // 0 = 100% NWP, 100 = 100% AI Corrected
  const [isSliderActive, setIsSliderActive] = useState<boolean>(false);

  // Center on central/southern India
  const centerPosition: [number, number] = [17.5, 78.5];

  const getMarkerColor = (props: MapFeatureProperties, lon: number): string => {
    if (isSliderActive && enableSplitSlider) {
      // Functional split slider: Map coordinates across lon 68 (West) to 96 (East)
      // Normalized longitude from 0 to 100
      const normLon = ((lon - 68) / (96 - 68)) * 100;
      if (normLon < splitSliderPos) {
        // Left of split: RAW NWP
        return getRainfallColor(props.raw_nwp_rainfall);
      } else {
        // Right of split: VARSHAAI Corrected
        return getRainfallColor(props.ai_corrected_rainfall);
      }
    }

    switch (activeLayer) {
      case 'ai_corrected':
        return getRainfallColor(props.ai_corrected_rainfall);
      case 'raw_nwp':
        return getRainfallColor(props.raw_nwp_rainfall);
      case 'observed':
        return getRainfallColor(props.observed_rainfall);
      case 'heavy_prob':
        return getProbabilityColor(props.heavy_rain_probability);
      case 'regime':
        return getRegimeColor(props.weather_regime);
      case 'forecast_error':
        return getErrorColor(props.forecast_error);
      default:
        return '#38bdf8';
    }
  };

  const getMarkerRadius = (props: MapFeatureProperties): number => {
    if (props.district_id === selectedDistrict) return 15;
    if (activeLayer === 'heavy_prob') return 9 + props.heavy_rain_probability * 8;
    const rain = activeLayer === 'raw_nwp' ? props.raw_nwp_rainfall : props.ai_corrected_rainfall;
    return Math.max(8, Math.min(18, 7 + (rain / 120) * 11));
  };

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Map Layer Control Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">METEOROLOGICAL LAYERS:</span>
          
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'ai_corrected', label: 'AI Corrected', color: 'border-cyan-500' },
              { id: 'raw_nwp', label: 'Raw NWP', color: 'border-amber-500' },
              { id: 'observed', label: 'Observed Truth', color: 'border-emerald-500' },
              { id: 'heavy_prob', label: 'Heavy Rain Prob', color: 'border-rose-500' },
              { id: 'regime', label: 'Weather Regime', color: 'border-purple-500' },
              { id: 'forecast_error', label: 'NWP Error (Obs-NWP)', color: 'border-indigo-500' }
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => {
                  setActiveLayer(layer.id as MapLayerType);
                  setIsSliderActive(false);
                }}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all border ${
                  activeLayer === layer.id && !isSliderActive
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* Forecast Split-Wipe Slider Toggle */}
        {enableSplitSlider && (
          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            <button
              onClick={() => setIsSliderActive(!isSliderActive)}
              className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${
                isSliderActive
                  ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {isSliderActive ? 'SPLIT SLIDER: ACTIVE' : 'SPLIT NWP vs AI SLIDER'}
            </button>
          </div>
        )}
      </div>

      {/* Floating Interactive Functional Split Slider Bar */}
      {isSliderActive && enableSplitSlider && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-cyan-500/60 shadow-2xl rounded-full px-5 py-2 flex items-center gap-4 text-xs font-semibold backdrop-blur-md max-w-[92%] w-[460px]">
          <span className="text-amber-400 font-bold whitespace-nowrap">RAW NWP ◄</span>
          <input
            type="range"
            min={10}
            max={90}
            value={splitSliderPos}
            onChange={(e) => setSplitSliderPos(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-cyan-400 font-bold whitespace-nowrap">► AI CORRECTED</span>
          <span className="text-[10px] text-slate-400 font-mono">[{splitSliderPos}%]</span>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={centerPosition}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', minHeight: '420px' }}
        >
          {/* CartoDB Dark Matter Basemap */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {features.map((f) => {
            const [lon, lat] = f.geometry.coordinates;
            const p = f.properties;
            const isSelected = p.district_id === selectedDistrict;
            const color = getMarkerColor(p, lon);
            const radius = getMarkerRadius(p);

            return (
              <CircleMarker
                key={p.district_id}
                center={[lat, lon]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.85,
                  color: isSelected ? '#ffffff' : color,
                  weight: isSelected ? 3 : 1.5
                }}
                eventHandlers={{
                  click: () => onSelectDistrict(p.district_id)
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="text-xs p-1">
                    <p className="font-bold text-slate-100">{p.district_name}</p>
                    <p className="text-cyan-400 font-medium">{p.weather_regime}</p>
                    <p className="text-slate-300">
                      AI Corrected: <span className="font-bold text-white">{p.ai_corrected_rainfall} mm</span>
                    </p>
                    <p className="text-amber-400">
                      Raw NWP: <span className="font-bold">{p.raw_nwp_rainfall} mm</span>
                    </p>
                  </div>
                </Tooltip>

                <Popup>
                  <div className="text-xs p-2 min-w-[210px] text-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
                      <h4 className="font-bold text-sm text-cyan-400">{p.district_name}</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {p.state}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weather Regime:</span>
                        <span className="font-bold text-purple-300">{p.weather_regime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Regime Confidence:</span>
                        <span className="font-bold text-emerald-400">{Math.round(p.regime_confidence * 100)}%</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1">
                        <span className="text-slate-400">Raw NWP:</span>
                        <span className="font-bold text-amber-400">{p.raw_nwp_rainfall} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">VARSHAAI AI:</span>
                        <span className="font-bold text-cyan-400">{p.ai_corrected_rainfall} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Correction Bias:</span>
                        <span className={`font-bold ${p.ai_corrected_rainfall >= p.raw_nwp_rainfall ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {p.ai_corrected_rainfall >= p.raw_nwp_rainfall ? '+' : ''}
                          {(p.ai_corrected_rainfall - p.raw_nwp_rainfall).toFixed(1)} mm
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1">
                        <span className="text-slate-400">Heavy Rain Prob:</span>
                        <span className="font-bold text-rose-400">{Math.round(p.heavy_rain_probability * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Risk Level:</span>
                        <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                          p.alert_level === 'RED' ? 'bg-red-950 text-red-400 border border-red-800' :
                          p.alert_level === 'ORANGE' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                          p.alert_level === 'YELLOW' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                          'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {p.alert_level}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDistrict(p.district_id)}
                      className="mt-3 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1 px-2 rounded text-[11px] transition-all"
                    >
                      OPEN DISTRICT DIGITAL TWIN
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Bottom Meteorological Scale Legend & Time Controller */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        {/* Scale Legend */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {activeLayer === 'heavy_prob' ? 'HEAVY RAIN PROBABILITY:' :
             activeLayer === 'regime' ? 'WEATHER REGIMES:' :
             activeLayer === 'forecast_error' ? 'NWP ERROR (OBS - NWP):' :
             'RAINFALL INTENSITY (mm):'}
          </span>

          {activeLayer === 'heavy_prob' ? (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> &lt;30%</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> 30–60%</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 60–80%</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> &gt;80%</span>
            </div>
          ) : activeLayer === 'regime' ? (
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Depression</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Monsoon</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Coastal</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Orographic</span>
            </div>
          ) : activeLayer === 'forecast_error' ? (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> NWP Overpredict</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Accurate (±5mm)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> NWP Underpredict</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Severe Under (&gt;20mm)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> 0–10</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> 10–25</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> 25–50</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 50–100</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> 100+ mm</span>
            </div>
          )}
        </div>

        {/* Time Slider */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase">FORECAST LEAD TIME:</span>
          <div className="flex items-center gap-1">
            {[6, 12, 18, 24, 36, 48].map((lt) => (
              <button
                key={lt}
                onClick={() => onLeadTimeChange(lt)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                  leadTime === lt
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                +{lt}h
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
