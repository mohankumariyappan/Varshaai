import React from 'react';
import { Sparkles, ArrowRight, ArrowUpRight, ArrowDownRight, Info, CheckCircle2 } from 'lucide-react';
import { DistrictForecast } from '../types';

interface ExplainabilityProps {
  currentForecast: DistrictForecast | null;
}

export const Explainability: React.FC<ExplainabilityProps> = ({ currentForecast }) => {
  if (!currentForecast) return null;

  const totalChange = currentForecast.change;
  const isPositive = totalChange >= 0;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white">WHY DID THE FORECAST CHANGE? (XAI)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explainable AI: Model attribution breakdown showing how atmospheric soundings contributed to debiasing raw NWP.
          </p>
        </div>

        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
          <span className="text-slate-400">Target District:</span>
          <span className="font-bold text-white font-mono">{currentForecast.district_name}</span>
        </div>
      </div>

      {/* Hero Forecast Transformation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Raw NWP */}
          <div className="text-center md:text-left">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block mb-1">
              RAW NWP BASELINE
            </span>
            <div className="flex items-baseline gap-1 justify-center md:justify-start">
              <span className="text-4xl font-black font-mono text-amber-400">{currentForecast.raw_nwp}</span>
              <span className="text-sm text-slate-400 font-bold">mm</span>
            </div>
            <span className="text-xs text-slate-400">Numerical Weather Prediction</span>
          </div>

          {/* Transformation Arrow & Delta */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-slate-500 my-1">
              <div className="w-12 h-0.5 bg-slate-700 hidden sm:block"></div>
              <ArrowRight className="w-6 h-6 text-cyan-400" />
              <div className="w-12 h-0.5 bg-slate-700 hidden sm:block"></div>
            </div>
            <span className={`text-sm font-bold font-mono px-3 py-1 rounded-full border ${
              isPositive 
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700' 
                : 'bg-rose-950/80 text-rose-400 border-rose-700'
            }`}>
              {isPositive ? `+${totalChange}` : totalChange} mm TOTAL CORRECTION
            </span>
            <span className="text-[11px] text-slate-400 mt-1 font-mono">
              Via {currentForecast.model_selected}
            </span>
          </div>

          {/* AI Corrected */}
          <div className="text-center md:text-right">
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              VARSHAAI CORRECTED
            </span>
            <div className="flex items-baseline gap-1 justify-center md:justify-end">
              <span className="text-4xl font-black font-mono text-cyan-400">{currentForecast.corrected_rainfall}</span>
              <span className="text-sm text-slate-400 font-bold">mm</span>
            </div>
            <span className="text-xs text-slate-400">Regime-Aware Hydromet Output</span>
          </div>
        </div>
      </div>

      {/* Atmospheric Factor Attribution (SHAP-Style Waterfall) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          FEATURE ATTRIBUTION &amp; CONTRIBUTION WEIGHTS (SHAP-STYLE)
        </h3>

        <div className="space-y-3">
          {currentForecast.explanation.map((item) => {
            const isPos = item.contribution >= 0;
            const maxContrib = 20.0;
            const barWidth = Math.min(100, Math.max(10, (Math.abs(item.contribution) / maxContrib) * 100));

            return (
              <div key={item.feature} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div>
                    <span className="text-xs font-bold text-white">{item.feature}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-sm font-bold">
                    <span className={isPos ? 'text-emerald-400' : 'text-rose-400'}>
                      {isPos ? `+${item.contribution}` : item.contribution} mm
                    </span>
                    {isPos ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                </div>

                {/* Contribution bar */}
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPos ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plain Language Meteorological Rationale */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" />
          SYNOPTIC METEOROLOGICAL RATIONALE
        </h3>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            The prevailing synoptic environment over <strong className="text-white">{currentForecast.district_name}</strong> has been 
            classified into the <strong className="text-purple-300">{currentForecast.detected_regime}</strong> weather regime with{' '}
            <strong className="text-emerald-400">{Math.round(currentForecast.regime_confidence * 100)}% statistical confidence</strong>.
          </p>
          <p>
            Standard NWP atmospheric models often underestimate localized convective cores during active depressions due to spatial grid coarsening. 
            VARSHAAI applied the <strong className="text-cyan-300">{currentForecast.model_selected}</strong>, applying a net correction of{' '}
            <strong className="text-white font-mono">{isPositive ? `+${totalChange}` : totalChange} mm</strong> based on elevated moisture flux 
            ({currentForecast.atmospheric_profile.moisture_flux.value} g/kg·m/s) and intense low-level streamline convergence.
          </p>
        </div>
      </div>
    </div>
  );
};
