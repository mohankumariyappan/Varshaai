import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Clock, 
  MapPin, 
  Flame,
  Zap 
} from 'lucide-react';

interface TopStatusBarProps {
  selectedDistrict: string;
  onDistrictChange: (id: string) => void;
  districts: Array<{ id: string; name: string; state: string }>;
  leadTime: number;
  onLeadTimeChange: (lt: number) => void;
  extremeMode: boolean;
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  selectedDistrict,
  onDistrictChange,
  districts,
  leadTime,
  onLeadTimeChange,
  extremeMode,
  isSimulating,
  onToggleSimulation
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata'
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-2xl">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-40 animate-pulse"></div>
            <div className="relative bg-slate-950 p-2 rounded-lg border border-cyan-500/50 text-cyan-400">
              <CloudRain className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider text-white bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                VARSHAAI
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Regime-Aware Rainfall Intelligence &amp; NWP Forecast Correction Platform
            </p>
          </div>
        </div>

        {/* 1-Click SIH Live Demo Button */}
        {onToggleSimulation && (
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-lg active:scale-95 ${
              isSimulating
                ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse shadow-rose-950/60 ring-2 ring-rose-500/50'
                : 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 text-amber-300 hover:text-white hover:border-amber-400 border-amber-500/50'
            }`}
            title="Click to toggle a live demonstration of an extreme cyclone / monsoon rain surge"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'text-rose-400 fill-rose-400 animate-spin' : 'text-amber-400 fill-amber-400'}`} />
            <span>{isSimulating ? '🚨 LIVE DEMO: CYCLONE SURGE ACTIVE (CLICK TO RESET)' : '⚡ 1-Click SIH Demo: Simulate Storm'}</span>
          </button>
        )}

        {/* Extreme Mode Banner if active */}
        {extremeMode && !isSimulating && (
          <div className="hidden lg:flex items-center gap-2 bg-red-950/80 border border-red-500 text-red-300 px-3 py-1 rounded-md text-xs font-semibold animate-pulse shadow-lg shadow-red-950/50">
            <Flame className="w-4 h-4 text-red-400" />
            <span>EXTREME RAIN MONITORING ACTIVE</span>
          </div>
        )}

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-3">
          {/* Telemetry badges */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-medium bg-slate-950/90 px-3 py-1.5 rounded-md border border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400">DATA:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">NWP:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-slate-400">AI:</span>
              <span className="text-cyan-400 font-bold">ONLINE</span>
            </div>
          </div>

          {/* Lead time quick pill */}
          <div className="flex items-center bg-slate-950 p-1 rounded-md border border-slate-800 text-xs">
            {[6, 12, 24, 48].map((lt) => (
              <button
                key={lt}
                onClick={() => onLeadTimeChange(lt)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] transition-all ${
                  leadTime === lt
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                +{lt < 10 ? `0${lt}` : lt}h
              </button>
            ))}
          </div>

          {/* District Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-xs">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                  {d.name}, {d.state}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeStr || '14:30 IST'}</span>
          </div>
        </div>
      </header>
    </>
  );
};
