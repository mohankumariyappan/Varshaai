import type { 
  DistrictForecast, 
  MapLayersResponse, 
  VerificationSkillsResponse, 
  HistoricalEvent, 
  ReplayResponse, 
  ModelHealthResponse 
} from '../types';

const BASE_URL = '/api';

export const api = {
  async getDistricts(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/districts`);
    if (!res.ok) throw new Error('Failed to fetch districts');
    return res.json();
  },

  async getDistrictForecast(districtId: string, leadTime: number = 24): Promise<DistrictForecast> {
    const res = await fetch(`${BASE_URL}/district/${districtId}?lead_time=${leadTime}`);
    if (!res.ok) throw new Error(`Failed to fetch forecast for ${districtId}`);
    return res.json();
  },

  async getMapLayers(leadTime: number = 24): Promise<MapLayersResponse> {
    const res = await fetch(`${BASE_URL}/map/layers?lead_time=${leadTime}`);
    if (!res.ok) throw new Error('Failed to fetch map layers');
    return res.json();
  },

  async getRiskRadar(leadTime: number = 24): Promise<any> {
    const res = await fetch(`${BASE_URL}/risk/radar?lead_time=${leadTime}`);
    if (!res.ok) throw new Error('Failed to fetch risk radar data');
    return res.json();
  },

  async getExplainability(districtId: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/explain/${districtId}`);
    if (!res.ok) throw new Error(`Failed to fetch explanation for ${districtId}`);
    return res.json();
  },

  async getVerificationSkills(): Promise<VerificationSkillsResponse> {
    const res = await fetch(`${BASE_URL}/verification/skills`);
    if (!res.ok) throw new Error('Failed to fetch verification skills');
    return res.json();
  },

  async getHistoricalEvents(): Promise<HistoricalEvent[]> {
    const res = await fetch(`${BASE_URL}/historical/events`);
    if (!res.ok) throw new Error('Failed to fetch historical events');
    return res.json();
  },

  async getHistoricalReplay(eventId: string): Promise<ReplayResponse> {
    const res = await fetch(`${BASE_URL}/historical/replay/${eventId}`);
    if (!res.ok) throw new Error(`Failed to fetch replay for ${eventId}`);
    return res.json();
  },

  async getModelHealth(): Promise<ModelHealthResponse> {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error('Failed to fetch model health');
    return res.json();
  },

  async predictCustom(districtId: string, leadTime: number, customWeather: any): Promise<DistrictForecast> {
    const res = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        district_id: districtId,
        lead_time: leadTime,
        custom_weather: customWeather
      })
    });
    if (!res.ok) throw new Error('Failed to run custom prediction');
    return res.json();
  },

  // Next-Gen Urban Inundation & Dam Twin APIs
  async getUrbanInundation(districtId: string, leadTime: number = 24): Promise<any> {
    const res = await fetch(`${BASE_URL}/hydro/inundation/${districtId}?lead_time=${leadTime}`);
    if (!res.ok) throw new Error('Failed to fetch urban inundation data');
    return res.json();
  },

  async getReservoirs(districtId: string, leadTime: number = 24): Promise<any> {
    const res = await fetch(`${BASE_URL}/hydro/reservoirs/${districtId}?lead_time=${leadTime}`);
    if (!res.ok) throw new Error('Failed to fetch reservoir inflow data');
    return res.json();
  },

  // Next-Gen NDMA CAP Alerts & Multilingual APIs
  async getCAPAlert(districtId: string, leadTime: number = 24): Promise<any> {
    const res = await fetch(`${BASE_URL}/alerts/cap/${districtId}?lead_time=${leadTime}`);
    if (!res.ok) throw new Error('Failed to fetch CAP alert payload');
    return res.json();
  },

  async getMultilingualBroadcasts(districtId: string, leadTime: number = 24): Promise<any> {
    const res = await fetch(`${BASE_URL}/alerts/multilingual/${districtId}?lead_time=${leadTime}`);
    if (!res.ok) throw new Error('Failed to fetch multilingual broadcasts');
    return res.json();
  },

  async getDisasterLogistics(districtId: string, leadTime: number = 24): Promise<any> {
    const res = await fetch(`${BASE_URL}/alerts/logistics/${districtId}?lead_time=${leadTime}`);
    if (!res.ok) throw new Error('Failed to fetch disaster logistics');
    return res.json();
  },

  // Next-Gen AI Meteorologist Copilot API
  async queryCopilot(query: string, districtId: string = 'thiruvallur', leadTime: number = 24): Promise<any> {
    const res = await fetch(`${BASE_URL}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        district_id: districtId,
        lead_time: leadTime
      })
    });
    if (!res.ok) throw new Error('Failed to query AI Meteorologist Copilot');
    return res.json();
  }
};
