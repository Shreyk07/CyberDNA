import React, { useState, useEffect } from 'react';
import {
  Search,
  Fingerprint,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  X,
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { EntitySummary, BehavioralProfile, FeatureDeviation, SecurityEvent } from '../types';
import { api } from '../services/api';

interface EntityDNAViewProps {
  initialEntityId?: string | null;
  onNavigateToInvestigation: (invId: string) => void;
  onCreateInvestigationFromEntity: (entityId: string) => void;
}

export const EntityDNAView: React.FC<EntityDNAViewProps> = ({
  initialEntityId,
  onNavigateToInvestigation,
  onCreateInvestigationFromEntity
}) => {
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(initialEntityId || null);
  const [entityDetail, setEntityDetail] = useState<{ entity: EntitySummary; profile?: BehavioralProfile } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'fingerprint' | 'features' | 'events'>('fingerprint');
  const [entityEvents, setEntityEvents] = useState<SecurityEvent[]>([]);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [filterAnomalous, setFilterAnomalous] = useState(false);
  const [sortBy, setSortBy] = useState<'bdi' | 'risk' | 'events'>('bdi');

  useEffect(() => {
    loadEntities();
  }, []);

  useEffect(() => {
    if (initialEntityId) {
      setSelectedEntityId(initialEntityId);
    }
  }, [initialEntityId]);

  useEffect(() => {
    if (selectedEntityId) {
      loadEntityDetail(selectedEntityId);
    } else {
      setEntityDetail(null);
    }
  }, [selectedEntityId]);

  async function loadEntities() {
    setLoading(true);
    try {
      const data = await api.getEntities();
      setEntities(data);
    } catch (err) {
      console.error('Failed to load entities:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadEntityDetail(id: string) {
    setDetailLoading(true);
    try {
      const data = await api.getEntityDetail(id);
      setEntityDetail(data);

      const evts = await api.getEvents({ entityId: id, limit: 30 });
      setEntityEvents(evts.events);
    } catch (err) {
      console.error('Failed to load entity detail:', err);
    } finally {
      setDetailLoading(false);
    }
  }

  const filteredEntities = entities.filter(ent => {
    if (selectedType !== 'ALL' && ent.type !== selectedType) return false;
    if (filterAnomalous && !ent.anomalous && ent.deviationIndex < 50) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return ent.id.toLowerCase().includes(q) || ent.label.toLowerCase().includes(q) || ent.role.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'bdi') return b.deviationIndex - a.deviationIndex;
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    return b.eventCount - a.eventCount;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-[#0A0A0A] text-[#D8D8D8]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Behavioral Fingerprinting</div>
          <h1 className="font-display text-4xl sm:text-5xl font-light tracking-tight text-white mt-1">Entity DNA Profiles</h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-light max-w-2xl leading-relaxed">
            Multivariate behavioral baselines for identities, workstations, enterprise servers, domains, and network interfaces. Deviations are measured against observed historical telemetry across 15 distinct dimensions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterAnomalous(!filterAnomalous)}
            className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
              filterAnomalous
                ? 'bg-[#F2D35E] text-[#0A0A0A] border-[#F2D35E] font-medium'
                : 'bg-[#111111] text-[#A0A0A0] border-[#292929] hover:bg-[#171717]'
            }`}
          >
            {filterAnomalous ? 'Showing Flagged Deviations' : 'Filter: Anomalies Only'}
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 bg-[#111111] border border-[#292929] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              placeholder="Search entity identifier, username, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#171717] text-[#D8D8D8] border border-[#292929] text-xs font-mono focus:outline-none focus:border-[#F2D35E]"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center border border-[#292929] divide-x divide-[#292929] font-mono text-xs">
            {['ALL', 'USER', 'DEVICE', 'SERVER', 'DOMAIN'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 text-[11px] transition-colors ${
                  selectedType === type ? 'bg-[#F2D35E] text-[#0A0A0A] font-medium' : 'bg-[#111111] text-[#A0A0A0] hover:bg-[#171717]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-[#A0A0A0] font-mono">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#171717] border border-[#292929] px-2 py-1 text-xs text-white focus:outline-none font-mono"
          >
            <option value="bdi">Behavioral Deviation (BDI)</option>
            <option value="risk">Risk Score</option>
            <option value="events">Event Count</option>
          </select>
        </div>
      </div>

      {/* Main Entities Grid & Table */}
      <div className="bg-[#111111] border border-[#292929] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292929] bg-[#171717] text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                <th className="py-3 px-4">Entity Identifier</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Role / Description</th>
                <th className="py-3 px-4 text-right">Telemetry Events</th>
                <th className="py-3 px-4 text-right">Baseline Status</th>
                <th className="py-3 px-4 text-right">Deviation Index (BDI)</th>
                <th className="py-3 px-4 text-right">Risk Score</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929] text-xs font-mono">
              {filteredEntities.map((ent) => {
                const isHigh = ent.deviationIndex >= 50;
                const isSelected = selectedEntityId === ent.id;

                return (
                  <tr
                    key={ent.id}
                    onClick={() => setSelectedEntityId(ent.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#1F1F1F] font-medium'
                        : 'hover:bg-[#171717]'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs text-white flex items-center gap-2">
                        <Fingerprint className="w-3.5 h-3.5 text-[#F2D35E] shrink-0" />
                        <span>{ent.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-[#A0A0A0] px-1.5 py-0.5 bg-[#171717] border border-[#292929]">
                        {ent.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#A0A0A0] font-sans font-light">
                      {ent.role}
                    </td>
                    <td className="py-3 px-4 text-right text-white">
                      {ent.eventCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-[10px] px-2 py-0.5 border ${
                        ent.profileStatus === 'PROFILED'
                          ? 'border-[#292929] bg-[#171717] text-[#10B981]'
                          : 'border-amber-900 bg-amber-950/40 text-[#F59E0B]'
                      }`}>
                        {ent.profileStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`font-mono font-medium ${isHigh ? 'text-[#F2D35E]' : 'text-white'}`}>
                          {ent.deviationIndex}
                        </span>
                        <div className="w-12 bg-[#171717] h-1.5 overflow-hidden border border-[#292929]">
                          <div
                            className={`h-full ${isHigh ? 'bg-[#F2D35E]' : 'bg-[#777777]'}`}
                            style={{ width: `${Math.min(100, ent.deviationIndex)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={ent.riskScore >= 70 ? 'text-[#EF4444] font-medium' : 'text-[#A0A0A0]'}>
                        {ent.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntityId(ent.id);
                        }}
                        className="px-2 py-1 text-[11px] border border-[#292929] bg-[#171717] hover:border-[#F2D35E]/50 text-[#D8D8D8] inline-flex items-center gap-1 font-mono"
                      >
                        Fingerprint <ArrowUpRight className="w-3 h-3 text-[#F2D35E]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entity Profile Drawer / Detail Modal */}
      {selectedEntityId && entityDetail && (
        <div className="bg-[#111111] border-2 border-[#F2D35E]/40 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-[#292929] pb-4 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-medium text-white">
                  {entityDetail.entity.id}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 bg-[#171717] border border-[#292929] text-[#F2D35E]">
                  {entityDetail.entity.type}
                </span>
                {entityDetail.profile?.isAnomalous && (
                  <span className="text-[11px] px-2 py-0.5 bg-rose-950/40 border border-rose-800 text-[#EF4444] font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    ANOMALOUS BEHAVIOR FLAG
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A0A0A0] mt-1 font-mono">
                {entityDetail.entity.role} • Baseline observations: {entityDetail.profile?.baselineEventCount || 0}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onCreateInvestigationFromEntity(entityDetail.entity.id)}
                className="px-3 py-1.5 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Initiate Investigation
              </button>
              <button
                onClick={() => setSelectedEntityId(null)}
                className="p-1.5 text-[#777777] hover:text-white hover:bg-[#171717] border border-[#292929]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#292929] space-x-6 text-xs font-mono">
            <button
              onClick={() => setActiveTab('fingerprint')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'fingerprint' ? 'text-[#F2D35E] font-medium border-b-2 border-[#F2D35E]' : 'text-[#777777] hover:text-white'
              }`}
            >
              Behavioral Fingerprint & Timeline
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'features' ? 'text-[#F2D35E] font-medium border-b-2 border-[#F2D35E]' : 'text-[#777777] hover:text-white'
              }`}
            >
              Feature-Level Deviations ({entityDetail.profile?.featureDeviations.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'events' ? 'text-[#F2D35E] font-medium border-b-2 border-[#F2D35E]' : 'text-[#777777] hover:text-white'
              }`}
            >
              Event Telemetry ({entityEvents.length})
            </button>
          </div>

          {/* TAB 1: Fingerprint */}
          {activeTab === 'fingerprint' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#171717] border border-[#292929] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#F2D35E] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-white font-mono">Behavioral Baseline Analysis</div>
                  <p className="text-xs text-[#A0A0A0] mt-1 leading-relaxed font-light">
                    {entityDetail.profile?.explanation}
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-[#777777] flex gap-4">
                    <span>BDI Score: <strong className="text-white">{entityDetail.profile?.behavioralDeviationIndex} / 100</strong></span>
                    <span>Isolation Forest Score: <strong className="text-white">{entityDetail.profile?.rawAnomalyScore ?? 'N/A'}</strong></span>
                    <span>Model Risk: <strong className="text-[#F2D35E]">{entityDetail.profile?.isolationForestRiskScore ?? entityDetail.entity.riskScore} / 100</strong></span>
                  </div>
                </div>
              </div>

              {/* 24-Hour Activity Baseline vs Current */}
              <div className="p-4 border border-[#292929] bg-[#111111]">
                <div className="flex items-center justify-between mb-3 border-b border-[#292929] pb-2">
                  <div>
                    <h4 className="text-xs font-medium text-white">Hourly Activity Profile (Baseline vs Current Window)</h4>
                    <p className="text-[11px] text-[#777777]">24-hour diurnal histogram identifying off-hours shifts</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#333333] inline-block" /> Historical Baseline
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#F2D35E] inline-block" /> Current Observation
                    </span>
                  </div>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(entityDetail.profile?.hourlyBaseline || []).map((val, h) => ({
                        hour: `${h.toString().padStart(2, '0')}:00`,
                        baseline: val,
                        current: entityDetail.profile?.hourlyCurrent?.[h] || 0
                      }))}
                    >
                      <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#777777' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: '#777777' }} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171717',
                          border: '1px solid #292929',
                          fontSize: '11px',
                          fontFamily: 'IBM Plex Mono',
                          color: '#D8D8D8'
                        }}
                      />
                      <Bar dataKey="baseline" fill="#333333" barSize={8} name="Historical Baseline" />
                      <Bar dataKey="current" fill="#F2D35E" barSize={8} name="Current Observation" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Feature-Level Deviations */}
          {activeTab === 'features' && (
            <div className="overflow-x-auto border border-[#292929]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#171717] text-[11px] font-mono text-[#777777] uppercase border-b border-[#292929]">
                    <th className="py-2.5 px-4">Behavioral Dimension</th>
                    <th className="py-2.5 px-4 text-right">Baseline</th>
                    <th className="py-2.5 px-4 text-right">Current</th>
                    <th className="py-2.5 px-4 text-right">Shift</th>
                    <th className="py-2.5 px-4 text-right">% Change</th>
                    <th className="py-2.5 px-4 text-right">Z-Score</th>
                    <th className="py-2.5 px-4 text-center">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929] font-mono">
                  {entityDetail.profile?.featureDeviations.map((feat: FeatureDeviation, i: number) => {
                    const isHigh = feat.severity === 'HIGH' || Math.abs(feat.z_score) >= 3.0;
                    const isMed = feat.severity === 'MEDIUM';

                    return (
                      <tr key={i} className="hover:bg-[#171717]">
                        <td className="py-2.5 px-4 font-medium text-white capitalize font-sans">
                          {feat.feature.replace(/_/g, ' ')}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#777777]">
                          {feat.baseline_value}
                        </td>
                        <td className="py-2.5 px-4 text-right font-medium text-white">
                          {feat.current_value}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {feat.absolute_shift > 0 ? `+${feat.absolute_shift}` : feat.absolute_shift}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {feat.percentage_change > 0 ? `+${feat.percentage_change}%` : `${feat.percentage_change}%`}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className={`px-1.5 py-0.5 ${
                            isHigh ? 'bg-rose-950/60 text-[#EF4444] font-semibold' :
                            isMed ? 'bg-amber-950/60 text-[#F59E0B]' : 'text-[#A0A0A0]'
                          }`}>
                            {feat.z_score > 0 ? `+${feat.z_score}` : feat.z_score}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 border ${
                            feat.severity === 'HIGH' ? 'border-rose-800 text-[#EF4444] bg-rose-950/30' :
                            feat.severity === 'MEDIUM' ? 'border-amber-800 text-[#F59E0B] bg-amber-950/30' :
                            'border-[#292929] text-[#777777]'
                          }`}>
                            {feat.severity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Event Telemetry */}
          {activeTab === 'events' && (
            <div className="space-y-2">
              <div className="text-xs text-[#A0A0A0] mb-2 font-mono">
                Showing latest {entityEvents.length} telemetry records for <code className="text-[#F2D35E]">{entityDetail.entity.id}</code>:
              </div>
              <div className="border border-[#292929] divide-y divide-[#292929] max-h-72 overflow-y-auto font-mono text-xs">
                {entityEvents.map((evt) => (
                  <div key={evt.event_id} className="p-3 flex items-center justify-between hover:bg-[#171717]">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#777777]">{evt.timestamp.slice(11, 19)} UTC</span>
                      <span className="font-medium text-white">{evt.event_type}</span>
                      <span className="text-[#A0A0A0] text-[11px]">{evt.process_name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#777777]">
                        {evt.source_ip} &rarr; {evt.destination_ip}:{evt.destination_port}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 border ${
                        evt.severity === 'CRITICAL' ? 'border-rose-900 bg-rose-950/40 text-[#EF4444]' :
                        evt.severity === 'HIGH' ? 'border-rose-900/60 text-[#F87171]' :
                        'border-[#292929] text-[#A0A0A0]'
                      }`}>
                        {evt.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
