import React, { useState, useEffect } from 'react';
import { History, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, CheckCircle2, ShieldAlert, Award, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { HistoricalEvent, ReplayResponse } from '../types';

export const HistoricalReplay: React.FC = () => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('michaung-2023');
  const [replayData, setReplayData] = useState<ReplayResponse | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getHistoricalEvents()
      .then(evs => {
        setEvents(evs);
        if (evs.length > 0) {
          return api.getHistoricalReplay(selectedEventId);
        }
      })
      .then(rep => {
        if (rep) setReplayData(rep);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentStage(1);
    setIsPlaying(false);
    api.getHistoricalReplay(eventId)
      .then(setReplayData)
      .catch(console.error);
  };

  // Auto-play timer across 7 stages
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStage(prev => {
          if (prev >= 7) {
            setIsPlaying(false);
            return 7;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (loading || !replayData) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="animate-spin mr-3 text-cyan-400">●</div> Loading historical events archive...
      </div>
    );
  }

  const activeStageObj = replayData.stages.find(s => s.stage_number === currentStage);
  const event = replayData.event;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white">HISTORICAL EVENT REPLAY ENGINE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Step-by-step sequential reconstruction of critical rainfall events to demonstrate how VARSHAAI prevents severe NWP under-predictions.
          </p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">Select Event:</span>
          <select
            value={selectedEventId}
            onChange={(e) => handleSelectEvent(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white font-bold rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Event Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">{event.title}</h3>
              <span className="bg-purple-950 text-purple-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-800">
                {event.regime}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Date: <span className="text-slate-200 font-semibold">{event.date}</span> • Region: <span className="text-slate-200 font-semibold">{event.region}</span>
            </p>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-amber-800/40 text-center">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Raw NWP</span>
              <span className="text-lg font-bold text-amber-400">{event.nwp_rainfall} mm</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-cyan-800/40 text-center">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">VARSHAAI</span>
              <span className="text-lg font-bold text-cyan-400">{event.varshaai_rainfall} mm</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-emerald-800/40 text-center">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Observed</span>
              <span className="text-lg font-bold text-emerald-400">{event.observed_rainfall} mm</span>
            </div>
          </div>
        </div>

        {/* Replay Controls & Timeline Track */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE REPLAY' : 'START REPLAY'}</span>
            </button>

            <button
              onClick={() => setCurrentStage(prev => Math.max(1, prev - 1))}
              disabled={currentStage <= 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentStage(prev => Math.min(7, prev + 1))}
              disabled={currentStage >= 7}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg text-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentStage(1);
                setIsPlaying(false);
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px]">RESET</span>
            </button>
          </div>

          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-3 py-1.5 rounded-lg border border-cyan-800">
            CURRENT: STAGE {currentStage} OF 7
          </span>
        </div>

        {/* 7 Stage Step Indicator Bar */}
        <div className="grid grid-cols-7 gap-1 mt-5">
          {replayData.stages.map((st) => {
            const isCompleted = st.stage_number < currentStage;
            const isCurrent = st.stage_number === currentStage;
            return (
              <div
                key={st.stage_number}
                onClick={() => setCurrentStage(st.stage_number)}
                className={`p-2 rounded-lg border transition-all cursor-pointer text-center ${
                  isCurrent
                    ? 'bg-cyan-950 border-cyan-500 shadow-lg ring-1 ring-cyan-500'
                    : isCompleted
                    ? 'bg-slate-950 border-emerald-800/80 text-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono font-bold block">
                  STAGE {st.stage_number}
                </span>
                <span className="text-[10px] font-semibold truncate block mt-0.5">
                  {st.stage_title.split(' ')[0]}...
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Breakdown */}
      {activeStageObj && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                {activeStageObj.stage_number}
              </span>
              <div>
                <h4 className="text-lg font-black text-white">{activeStageObj.stage_title}</h4>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{activeStageObj.timestamp}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 font-mono">
              STAGE ACTIVE
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {activeStageObj.details.status_message}
            </p>
          </div>

          {/* Key Stage Key-Value Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {Object.entries(activeStageObj.details)
              .filter(([k]) => k !== 'status_message')
              .map(([key, value]) => (
                <div key={key} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-mono font-bold text-cyan-300 mt-1 block">
                    {String(value)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
