import React, { useEffect, useState } from 'react';
import { HeartPulse, CheckCircle2, ShieldCheck, Database, Activity, Cpu, Server, Clock, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { ModelHealthResponse } from '../types';

export const ModelHealth: React.FC = () => {
  const [health, setHealth] = useState<ModelHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHealth = () => {
    setLoading(true);
    api.getModelHealth()
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading || !health) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="animate-spin mr-3 text-cyan-400">●</div> Polling MLOps pipeline telemetry...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">MODEL HEALTH &amp; MLOPS MONITORING</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline monitoring, data drift telemetry, model status, and prediction latency metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHealth}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>REFRESH STATUS</span>
          </button>
          <div className="bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-300 font-bold uppercase">SYSTEM HEALTH: {health.status}</span>
          </div>
        </div>
      </div>

      {/* System Service Nodes Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">DATA PIPELINE</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">
              {health.system_status.data_pipeline}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">NWP INGESTION</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">
              {health.system_status.nwp_ingestion}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">AI INFERENCE ENGINE</span>
            <span className="text-cyan-400 font-mono font-bold text-sm">
              {health.system_status.ai_inference_engine}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">DATABASE &amp; STORE</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">
              {health.system_status.database}
            </span>
          </div>
        </div>
      </div>

      {/* Model Inventory & Telemetry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          MACHINE LEARNING MODEL REGISTRY &amp; RUNTIME STATUS
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Model Component</th>
                <th className="py-2.5 px-3">Architecture</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Primary Accuracy Metric</th>
                <th className="py-2.5 px-3">Inference Latency</th>
                <th className="py-2.5 px-3">Last Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {health.models.map((m) => (
                <tr key={m.name} className="hover:bg-slate-950/40 transition-all">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {m.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">{m.type}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{m.version}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-cyan-400 font-mono font-bold">
                    {m.accuracy || m.rmse_test || m.brier_score || m.coverage || 'Optimal'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{m.latency_ms} ms</td>
                  <td className="py-2.5 px-3 text-slate-400">{m.last_validated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Ingestion Quality & Drift Telemetry */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          DATA QUALITY &amp; FEATURE DRIFT TELEMETRY
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Data Freshness</span>
            <span className="text-lg font-black font-mono text-emerald-400">{health.data_quality.freshness}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Missing Values Rate</span>
            <span className="text-lg font-black font-mono text-emerald-400">{health.data_quality.missing_values_rate}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ingestion Cycle</span>
            <span className="text-xs font-bold text-slate-200 mt-1 block">{health.data_quality.ingestion_frequency}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Avg Pipeline Latency</span>
            <span className="text-lg font-black font-mono text-cyan-400">{health.data_quality.average_pipeline_latency_ms} ms</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Feature Drift Status</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 block font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 inline-block">
              {health.data_quality.feature_drift_status}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Kolmogorov Drift (p-val)</span>
            <span className="text-lg font-black font-mono text-slate-200">{health.data_quality.drift_score_p_value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
