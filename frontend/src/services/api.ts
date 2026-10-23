import {
  EntitySummary,
  BehavioralProfile,
  SecurityEvent,
  Investigation,
  InvestigationNote,
  GraphNode,
  GraphEdge,
  DataSourceMeta
} from '../types';

const API_BASE = 'http://localhost:3001/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error (${res.status}): ${errorText}`);
  }
  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  async getOverviewStats() {
    return fetchJson<any>('/stats/overview');
  },

  async getEntities(params?: { type?: string; anomalous?: boolean; search?: string }) {
    const q = new URLSearchParams();
    if (params?.type) q.set('type', params.type);
    if (params?.anomalous) q.set('anomalous', 'true');
    if (params?.search) q.set('search', params.search);
    return fetchJson<EntitySummary[]>(`/entities?${q.toString()}`);
  },

  async getEntityDetail(id: string) {
    return fetchJson<{ entity: EntitySummary; profile?: BehavioralProfile }>(`/entities/${encodeURIComponent(id)}`);
  },

  async getEvents(params?: { entityId?: string; eventType?: string; severity?: string; search?: string; limit?: number; offset?: number }) {
    const q = new URLSearchParams();
    if (params?.entityId) q.set('entityId', params.entityId);
    if (params?.eventType) q.set('eventType', params.eventType);
    if (params?.severity) q.set('severity', params.severity);
    if (params?.search) q.set('search', params.search);
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));
    
    const res = await fetch(`${API_BASE}/events?${q.toString()}`);
    const json = await res.json();
    return { total: json.total || 0, events: (json.data || []) as SecurityEvent[] };
  },

  async getInvestigations() {
    return fetchJson<Investigation[]>('/investigations');
  },

  async getInvestigationDetail(id: string) {
    return fetchJson<Investigation>(`/investigations/${encodeURIComponent(id)}`);
  },

  async createInvestigation(data: Partial<Investigation>) {
    return fetchJson<Investigation>('/investigations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async addInvestigationNote(id: string, note: { text: string; author: string; category: string }) {
    return fetchJson<InvestigationNote>(`/investigations/${encodeURIComponent(id)}/notes`, {
      method: 'POST',
      body: JSON.stringify(note)
    });
  },

  async updateInvestigationStatus(id: string, status: string) {
    return fetchJson<Investigation>(`/investigations/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async getGraph() {
    return fetchJson<{ nodes: GraphNode[]; edges: GraphEdge[] }>('/graph');
  },

  async getAnalytics() {
    return fetchJson<any>('/analytics');
  },

  async getDataSources() {
    return fetchJson<DataSourceMeta[]>('/datasources');
  },

  async runPipeline() {
    return fetchJson<any>('/pipeline/run', { method: 'POST' });
  },

  getExportUrl(investigationId: string) {
    return `${API_BASE}/investigations/${encodeURIComponent(investigationId)}/export`;
  }
};
