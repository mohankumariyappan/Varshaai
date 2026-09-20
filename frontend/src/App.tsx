import React, { useState, useEffect } from 'react';
import { TopStatusBar } from './components/layout/TopStatusBar';
import { NavigationTabs, ScreenId } from './components/layout/NavigationTabs';
import { CommandCenter } from './screens/CommandCenter';
import { RainfallMap } from './screens/RainfallMap';
import { RegimeIntelligence } from './screens/RegimeIntelligence';
import { ForecastComparison } from './screens/ForecastComparison';
import { RiskRadar } from './screens/RiskRadar';
import { DistrictTwin } from './screens/DistrictTwin';
import { Explainability } from './screens/Explainability';
import { SkillCenter } from './screens/SkillCenter';
import { HistoricalReplay } from './screens/HistoricalReplay';
import { ModelHealth } from './screens/ModelHealth';
import { api } from './services/api';
import { DistrictForecast, MapFeatureProperties } from './types';

export function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('command-center');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('thiruvallur');
  const [leadTime, setLeadTime] = useState<number>(24);
  const [districts, setDistricts] = useState<Array<{ id: string; name: string; state: string }>>([]);
  const [currentForecast, setCurrentForecast] = useState<DistrictForecast | null>(null);
  const [mapFeatures, setMapFeatures] = useState<Array<{
    geometry: { coordinates: [number, number] };
    properties: MapFeatureProperties;
  }>>([]);
  const [customWeather, setCustomWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initial Load: Districts & Map Layers
  useEffect(() => {
    Promise.all([
      api.getDistricts(),
      api.getMapLayers(leadTime)
    ]).then(([distList, layers]) => {
      setDistricts(distList);
      if (layers && layers.features) {
        setMapFeatures(layers.features);
      }
    }).catch(console.error);
  }, []);

  // Update Map Layers whenever lead time changes
  useEffect(() => {
    api.getMapLayers(leadTime)
      .then((layers) => {
        if (layers && layers.features) {
          setMapFeatures(layers.features);
        }
      })
      .catch(console.error);
  }, [leadTime]);

  // Update District Forecast whenever selectedDistrict, leadTime, or customWeather changes
  useEffect(() => {
    setLoading(true);
    if (customWeather) {
      api.predictCustom(selectedDistrict, leadTime, customWeather)
        .then(setCurrentForecast)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      api.getDistrictForecast(selectedDistrict, leadTime)
        .then(setCurrentForecast)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedDistrict, leadTime, customWeather]);

  const handleSimulateWeather = (params: any) => {
    setCustomWeather(params);
  };

  const isExtremeActive = mapFeatures.some(f => f.properties.alert_level === 'RED');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Meteorological Top Status Bar */}
      <TopStatusBar
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        districts={districts}
        leadTime={leadTime}
        onLeadTimeChange={setLeadTime}
        extremeMode={isExtremeActive}
      />

      {/* 2. Navigation Tabs (All 10 Screens) */}
      <NavigationTabs
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
      />

      {/* 3. Screen Router */}
      <main className="flex-1 pb-10">
        {activeScreen === 'command-center' && (
          <CommandCenter
            currentForecast={currentForecast}
            mapFeatures={mapFeatures}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            leadTime={leadTime}
            onLeadTimeChange={setLeadTime}
            onNavigateScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'rainfall-map' && (
          <RainfallMap
            mapFeatures={mapFeatures}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            leadTime={leadTime}
            onLeadTimeChange={setLeadTime}
          />
        )}

        {activeScreen === 'regime-intelligence' && (
          <RegimeIntelligence
            currentForecast={currentForecast}
            onSimulateWeather={handleSimulateWeather}
          />
        )}

        {activeScreen === 'forecast-comparison' && (
          <ForecastComparison
            currentForecast={currentForecast}
            mapFeatures={mapFeatures}
            onSelectDistrict={setSelectedDistrict}
          />
        )}

        {activeScreen === 'risk-radar' && (
          <RiskRadar
            currentForecast={currentForecast}
            mapFeatures={mapFeatures}
            onSelectDistrict={setSelectedDistrict}
          />
        )}

        {activeScreen === 'district-twin' && (
          <DistrictTwin
            currentForecast={currentForecast}
            districts={districts}
            onSelectDistrict={setSelectedDistrict}
            leadTime={leadTime}
            onLeadTimeChange={setLeadTime}
          />
        )}

        {activeScreen === 'explainability' && (
          <Explainability
            currentForecast={currentForecast}
          />
        )}

        {activeScreen === 'verification' && (
          <SkillCenter />
        )}

        {activeScreen === 'historical-replay' && (
          <HistoricalReplay />
        )}

        {activeScreen === 'model-health' && (
          <ModelHealth />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 py-3 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">VARSHAAI</span>
          <span>•</span>
          <span>Regime-Aware Rainfall Intelligence &amp; Forecast Correction Platform</span>
        </div>
        <div className="font-mono text-[11px] text-slate-600">
          Smart India Hackathon Prototype • Atmospheric ML Pipeline v2.4
        </div>
      </footer>
    </div>
  );
}

export default App;
