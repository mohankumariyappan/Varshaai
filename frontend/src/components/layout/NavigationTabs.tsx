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
  HeartPulse 
} from 'lucide-react';

export type ScreenId = 
  | 'command-center'
  | 'rainfall-map'
  | 'regime-intelligence'
  | 'forecast-comparison'
  | 'risk-radar'
  | 'district-twin'
  | 'explainability'
  | 'verification'
  | 'historical-replay'
  | 'model-health';

interface NavigationTabsProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeScreen, onSelectScreen }) => {
  const tabs = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'rainfall-map', label: 'Rainfall Map', icon: Map },
    { id: 'regime-intelligence', label: 'Regime Intelligence', icon: Compass },
    { id: 'forecast-comparison', label: 'Forecast Comparison', icon: GitCompare },
    { id: 'risk-radar', label: 'Risk Radar', icon: ShieldAlert },
    { id: 'district-twin', label: 'District Twin', icon: Building2 },
    { id: 'explainability', label: 'Why It Changed', icon: Sparkles },
    { id: 'verification', label: 'Skill Center', icon: CheckCircle2 },
    { id: 'historical-replay', label: 'Historical Replay', icon: History },
    { id: 'model-health', label: 'Model Health', icon: HeartPulse },
  ];

  return (
    <nav className="bg-slate-950 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectScreen(tab.id as ScreenId)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
