import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Compass, 
  GitCompare, 
  ShieldAlert, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  History, 
  HeartPulse,
  Waves,
  Radio,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export type ScreenId = 
  | 'command-center'
  | 'rainfall-map'
  | 'urban-inundation'
  | 'emergency-dispatch'
  | 'regime-intelligence'
  | 'forecast-comparison'
  | 'risk-radar'
  | 'district-twin'
  | 'explainability'
  | 'verification'
  | 'historical-replay'
  | 'model-health';

export type PillarId = 'cockpit' | 'urban-twin' | 'emergency' | 'ai-lab';

interface NavigationTabsProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

interface PillarConfig {
  id: PillarId;
  label: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  defaultScreen: ScreenId;
  subScreens?: Array<{ id: ScreenId; label: string; icon: React.ElementType }>;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeScreen, onSelectScreen }) => {
  const pillars: PillarConfig[] = [
    {
      id: 'cockpit',
      label: 'Command Cockpit',
      icon: LayoutDashboard,
      defaultScreen: 'command-center',
      subScreens: [
        { id: 'command-center', label: 'Overview', icon: LayoutDashboard },
        { id: 'rainfall-map', label: 'Rainfall Map', icon: Map },
        { id: 'forecast-comparison', label: '3-Way Comparison', icon: GitCompare },
        { id: 'risk-radar', label: 'Risk Radar', icon: ShieldAlert },
        { id: 'district-twin', label: 'District Twin', icon: Building2 },
      ]
    },
    {
      id: 'urban-twin',
      label: 'Urban Inundation & Dam Twin',
      badge: 'NEXT-GEN INNOVATION',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      icon: Waves,
      defaultScreen: 'urban-inundation',
    },
    {
      id: 'emergency',
      label: 'Emergency Dispatch Hub',
      badge: 'NDMA CAP v1.2',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: Radio,
      defaultScreen: 'emergency-dispatch',
    },
    {
      id: 'ai-lab',
      label: 'Atmospheric AI Lab',
      badge: 'REGIME ML',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      icon: Compass,
      defaultScreen: 'regime-intelligence',
      subScreens: [
        { id: 'regime-intelligence', label: 'Regime Sandbox', icon: Compass },
        { id: 'explainability', label: 'Why Forecast Changed (SHAP)', icon: Sparkles },
        { id: 'historical-replay', label: 'Disaster Replay', icon: History },
        { id: 'verification', label: 'Verification Skills', icon: CheckCircle2 },
        { id: 'model-health', label: 'MLOps Pipeline', icon: HeartPulse },
      ]
    }
  ];

  // Determine active pillar based on current screen
  const activePillar = pillars.find((p) => 
    p.defaultScreen === activeScreen || (p.subScreens && p.subScreens.some((s) => s.id === activeScreen))
  ) || pillars[0];

  return (
    <div className="bg-slate-950 border-b border-slate-800 flex flex-col">
      {/* 1. Master Pillar Navigation (Clean, Spacious, Uncluttered) */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800/80 overflow-x-auto gap-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isPillarActive = activePillar.id === pillar.id;

            return (
              <button
                key={pillar.id}
                onClick={() => {
                  if (activePillar.id !== pillar.id) {
                    onSelectScreen(pillar.defaultScreen);
                  }
                }}
                className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isPillarActive
                    ? 'bg-slate-900 text-white border border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  isPillarActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{pillar.label}</span>

                {pillar.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${pillar.badgeColor}`}>
                    {pillar.badge}
                  </span>
                )}

                {isPillarActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Operational Status Pill */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>INNOVATION SUITE: 4 CORE PILLARS ACTIVE</span>
        </div>
      </div>

      {/* 2. Sleek Sub-View Pill Switcher (Only shown when pillar has sub-views) */}
      {activePillar.subScreens && activePillar.subScreens.length > 0 && (
        <div className="px-4 py-1.5 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-slate-900">
          <span className="text-[10px] uppercase font-bold text-slate-500 mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-cyan-500" />
            {activePillar.label} View:
          </span>

          {activePillar.subScreens.map((sub) => {
            const SubIcon = sub.icon;
            const isSubActive = activeScreen === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => onSelectScreen(sub.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-lg transition whitespace-nowrap ${
                  isSubActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <SubIcon className={`w-3 h-3 ${isSubActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
