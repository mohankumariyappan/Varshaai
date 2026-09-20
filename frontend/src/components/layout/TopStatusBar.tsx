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
  Flame
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
              <span className="text-[10px] font-bold tracking-widest bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 shadow-sm">
                SIH 2026 EDITION
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Regime-Aware Rainfall Intelligence &amp; NWP Forecast Correction Platform
            </p>
          </div>
        </div>

        {/* SIH 2026 Pitch Walkthrough Button */}
        <button
          onClick={() => setShowPitchModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95"
        >
          <Award className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>SIH EVALUATOR GUIDE</span>
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

      {/* SIH 2026 Interactive Pitch & Evaluator Guide Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white tracking-wide">
                  SIH 2026 EVALUATOR DEMO FLOW
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
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed min-h-[220px]">
              {pitchStep === 1 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    STAGE 1: THE CORE PROBLEM IN NWP RAINFALL FORECASTING
                  </span>
                  <h4 className="text-lg font-black text-white">Why One Generic AI Model Fails</h4>
                  <p>
                    Rainfall forecast errors from Numerical Weather Prediction (NWP) models are fundamentally 
                    non-uniform across weather situations. A <strong>Monsoon Depression</strong> produces severe under-prediction (-32 mm bias), 
                    while a <strong>Break Monsoon</strong> produces over-prediction (+6 mm bias).
                  </p>
                  <p className="bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-400">
                    💡 <em>Judges key question:</em> "Why didn't you just train one big Neural Network?" <br />
                    <strong>Answer:</strong> "Because atmospheric error dynamics are conditionally multi-modal. A generic model washes out localized extreme deluges into an average."
                  </p>
                </div>
              )}

              {pitchStep === 2 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    STAGE 2: THE VARSHAAI REGIME-AWARE INNOVATION
                  </span>
                  <h4 className="text-lg font-black text-white">Regime Classification → Specialized Error Models</h4>
                  <p>
                    VARSHAAI first classifies prevailing soundings (pressure anomaly, moisture flux, low-level wind convergence) into one of <strong>7 Canonical Indian Weather Regimes</strong> (93.24% accuracy).
                  </p>
                  <div className="bg-cyan-950/40 p-3 rounded-lg border border-cyan-800/60 font-mono text-cyan-300 text-center font-bold">
                    Weather Soundings → Regime Classifier → Regime-Specific Bias Correction → Corrected Rainfall
                  </div>
                  <p>
                    It then selects the specialized correction model to predict the NWP error: <code>Corrected = NWP + Predicted Error</code>.
                  </p>
                </div>
              )}

              {pitchStep === 3 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    STAGE 3: EMPIRICAL SCIENTIFIC PROOF (SKILL CENTER)
                  </span>
                  <h4 className="text-lg font-black text-white">Strict Unseen Test Dataset Verification</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">RMSE Drop</span>
                      <span className="text-base font-black text-cyan-400 font-mono">-47.4%</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">MAE Drop</span>
                      <span className="text-base font-black text-cyan-400 font-mono">-51.8%</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">False Alarms</span>
                      <span className="text-base font-black text-emerald-400 font-mono">&gt;58% Cut</span>
                    </div>
                  </div>
                  <p>
                    Evaluated on 1,050 unseen samples completely held out from training. Systematic bias reduced from +19.42 mm to -0.18 mm.
                  </p>
                </div>
              )}

              {pitchStep === 4 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    STAGE 4: LIVE DEMO FEATURES FOR JUDGES
                  </span>
                  <h4 className="text-lg font-black text-white">Key Interactive Elements to Showcase</h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
                    <li><strong>Map Slider:</strong> Toggle "SPLIT NWP vs AI SLIDER" on the map to wipe between raw NWP and AI corrected rainfall.</li>
                    <li><strong>Regime Sandbox:</strong> In the <em>Regime Intelligence</em> tab, drag the moisture and pressure anomaly sliders to see real-time reclassification.</li>
                    <li><strong>Why Did It Change?:</strong> In <em>Why It Changed</em>, show the SHAP feature contribution waterfall.</li>
                    <li><strong>Historical Event Replay:</strong> Hit "START REPLAY" to watch the 7-stage reconstruction of Cyclone Michaung.</li>
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
                    Got It, Start Demo!
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
