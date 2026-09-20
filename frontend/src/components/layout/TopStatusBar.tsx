import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Activity, 
  Database, 
  Cpu, 
  Clock, 
  ShieldAlert, 
  MapPin, 
  Sparkles, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Award,
  Flame,
  Info
} from 'lucide-react';

interface TopStatusBarProps {
  selectedDistrict: string;
  onDistrictChange: (id: string) => void;
  districts: Array<{ id: string; name: string; state: string }>;
  leadTime: number;
  onLeadTimeChange: (lt: number) => void;
  extremeMode: boolean;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  selectedDistrict,
  onDistrictChange,
  districts,
  leadTime,
  onLeadTimeChange,
  extremeMode
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchStep, setPitchStep] = useState(1);

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

        {/* How It Works & Data Pipeline Guide Button */}
        <button
          onClick={() => setShowPitchModal(true)}
          className="flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Info className="w-4 h-4 text-cyan-400" />
          <span>HOW IT WORKS &amp; DATA SOURCES</span>
        </button>

        {/* Extreme Mode Banner if active */}
        {extremeMode && (
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

      {/* How It Works & Data Sources Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white tracking-wide">
                  HOW VARSHAAI WORKS &amp; DATA PIPELINE
                </h3>
              </div>
              <button
                onClick={() => setShowPitchModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Content */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed min-h-[250px]">
              {pitchStep === 1 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    STAGE 1: WHAT IS THE PROBLEM &amp; HOW VARSHAAI SOLVES IT
                  </span>
                  <h4 className="text-lg font-black text-white">Why Weather Forecasts Miss Heavy Rains</h4>
                  <p>
                    Traditional weather supercomputers use mathematical physics equations (called <strong>Numerical Weather Prediction / NWP</strong>) to forecast rainfall.
                  </p>
                  <p>
                    However, computer models make <strong>regular, predictable mistakes</strong> depending on the weather situation:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>During <strong>Cyclones &amp; Monsoon Depressions</strong>, raw models routinely <em>under-predict</em> rain by 30 to 100 mm, failing to warn of flash floods.</li>
                    <li>During <strong>Break-Monsoon</strong> dry periods, models produce false alarms.</li>
                  </ul>
                  <p className="bg-cyan-950/40 p-2.5 rounded border border-cyan-800/60 text-cyan-200">
                    💡 <strong>The Innovation:</strong> Rather than using one generic AI model that averages everything out, VARSHAAI first identifies the active <strong>Weather Regime</strong>, then routes the forecast through an AI model trained specifically for that regime!
                  </p>
                </div>
              )}

              {pitchStep === 2 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    STAGE 2: WHERE DOES VARSHAAI TAKE DATA FROM?
                  </span>
                  <h4 className="text-lg font-black text-white">Real-Time Multi-Source Data Ingestion</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <p className="font-bold text-cyan-400">1. Physics Models (NWP)</p>
                      <p className="text-[11px] text-slate-400">
                        IMD GFS (12 km) &amp; NCMRWF Unified Model. Supplies baseline raw rainfall, surface pressure, and 850 hPa wind fields.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <p className="font-bold text-sky-400">2. Satellites &amp; Radars</p>
                      <p className="text-[11px] text-slate-400">
                        INSAT-3D/3DR geostationary soundings &amp; IMD Doppler Weather Radar (DWR). Supplies moisture flux, cloud tops, and CAPE storm energy.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <p className="font-bold text-emerald-400">3. Ground Truth Observations</p>
                      <p className="text-[11px] text-slate-400">
                        IMD Automated Weather Stations (AWS) and district rain gauges measuring true ground rainfall to calculate forecast errors.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <p className="font-bold text-purple-400">4. Topography &amp; Coastlines</p>
                      <p className="text-[11px] text-slate-400">
                        SRTM 30m Digital Elevation Models and coastal distance matrices for mountain slope &amp; sea-breeze lift.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {pitchStep === 3 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    STAGE 3: WHAT DO THE NUMBERS MEAN? (SIMPLE GLOSSARY)
                  </span>
                  <h4 className="text-lg font-black text-white">Understand Every Metric on the Screen</h4>
                  <div className="space-y-1.5 text-[11px]">
                    <p>• <strong className="text-amber-400">Raw NWP (mm):</strong> The original prediction from traditional physics supercomputer models.</p>
                    <p>• <strong className="text-cyan-400">AI Corrected (mm):</strong> The accurate rainfall after VARSHAAI corrects systematic model bias.</p>
                    <p>• <strong className="text-purple-400">Weather Regime:</strong> The active weather pattern (e.g., <em>Coastal System</em>, <em>Monsoon Depression</em>, <em>Mountain Orographic</em>).</p>
                    <p>• <strong className="text-sky-300">Quantile Range (e.g. 78–120 mm):</strong> The realistic lower and upper band where rain will actually fall (80% confidence interval).</p>
                    <p>• <strong className="text-rose-400">Heavy Rain Probability:</strong> The statistical chance that rainfall exceeds 64.5 mm (IMD official flood warning threshold).</p>
                    <p>• <strong className="text-red-400">Risk Radar (Red/Orange/Yellow/Green):</strong> Direct action advice for disaster managers and public safety.</p>
                  </div>
                </div>
              )}

              {pitchStep === 4 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    STAGE 4: INTERACTIVE DEMO FEATURES TO TRY
                  </span>
                  <h4 className="text-lg font-black text-white">What You Can Explore Right Now</h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
                    <li><strong>Map Split Slider:</strong> Click "Rainfall Map", turn on "SPLIT NWP vs AI SLIDER" and wipe across India to compare before vs after.</li>
                    <li><strong>Regime Simulator:</strong> In <em>Regime Intelligence</em>, drag atmospheric sliders (Moisture, Pressure, Wind) to test the AI classifier.</li>
                    <li><strong>Why It Changed (XAI):</strong> Click <em>Why It Changed</em> to see the exact atmospheric factors that adjusted the forecast.</li>
                    <li><strong>Historical Deluges:</strong> In <em>Historical Replay</em>, re-live the 2015 Chennai deluge and 2023 Cyclone Michaung.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Step Navigation Bar */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => setPitchStep(s)}
                    className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all ${
                      pitchStep === s
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {pitchStep > 1 && (
                  <button
                    onClick={() => setPitchStep(prev => prev - 1)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Previous
                  </button>
                )}
                {pitchStep < 4 ? (
                  <button
                    onClick={() => setPitchStep(prev => prev + 1)}
                    className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPitchModal(false)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                  >
                    Got It, Explore Platform!
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
