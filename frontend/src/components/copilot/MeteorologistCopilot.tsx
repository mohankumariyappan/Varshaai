import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';
import { CopilotQueryResponse } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  timestamp: string;
  text: string;
  data?: CopilotQueryResponse;
}

interface MeteorologistCopilotProps {
  districtId: string;
  leadTime: number;
}

export const MeteorologistCopilot: React.FC<MeteorologistCopilotProps> = ({
  districtId,
  leadTime
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: Message = {
    id: 'msg-0',
    sender: 'copilot',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: `Hello! I am your **VARSHAAI Hydrometeorological Copilot**. I analyze real-time WRF atmospheric regimes, urban inundation depths, dam inflow twin models, and NDMA CAP v1.2 alerts. Ask me anything or select a scenario below:`,
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  const quickPrompts = [
    "Will Chembarambakkam reservoir overflow in next 24h?",
    "Which roads are impassable right now?",
    "Generate NDRF evacuation alert for low-lying wards",
    "Explain why VarshaAI corrected IMD rainfall",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await api.queryCopilot(text.trim(), districtId, leadTime);
      const copilotMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'copilot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.answer_markdown,
        data: response,
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'copilot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "I encountered a communication delay connecting to the atmospheric ML engine. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-2xl shadow-cyan-500/30 border border-cyan-400/40 transition-all hover:scale-105 group active:scale-95"
          aria-label="Open AI Meteorologist Copilot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-wide">AI Copilot</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-full font-mono">Next-Gen</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-96 sm:w-[440px] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl shadow-black/80 flex flex-col transition-all overflow-hidden ${
            isMinimized ? 'h-14' : 'h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Meteorologist Copilot</h3>
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">District: {districtId.toUpperCase()} • T+{leadTime}h</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-900/30'
                          : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/80 shadow-sm'
                      }`}
                    >
                      {/* Message Content */}
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* If response includes grounded telemetry */}
                      {msg.data && msg.data.grounding_telemetry && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/60 space-y-1.5 font-mono">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="text-slate-500">Domain Classification:</span>
                            <span className="text-cyan-400 font-bold">{msg.data.category}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 text-[9px] bg-slate-950/70 p-2 rounded border border-slate-800">
                            <div>
                              <span className="text-slate-500 block">Regime:</span>
                              <span className="text-slate-300 font-semibold">{msg.data.grounding_telemetry.regime}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Corrected Rain:</span>
                              <span className="text-emerald-400 font-semibold">{msg.data.grounding_telemetry.corrected_rain_mm} mm</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">NWP Model Bias:</span>
                              <span className="text-amber-400 font-semibold">{msg.data.grounding_telemetry.nwp_bias_mm} mm</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Civil Alert:</span>
                              <span className="text-rose-400 font-semibold">{msg.data.grounding_telemetry.alert_level}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 px-1 mt-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 p-3 bg-slate-800/70 border border-slate-700/50 rounded-2xl rounded-tl-none w-fit text-xs text-cyan-400 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing atmospheric regime & hydrological models...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Chips */}
              <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    className="text-[10px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition active:scale-95 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask copilot about rainfall, gates, alerts..."
                  disabled={loading}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !inputQuery.trim()}
                  className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-lg transition disabled:text-slate-500"
                  title="Send Question"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
