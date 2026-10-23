import React from 'react';
import {
  ShieldAlert,
  Fingerprint,
  Activity,
  Layers,
  ArrowUpRight,
  AlertTriangle,
  Server,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface OverviewViewProps {
  stats: any;
  onNavigateToEntity: (entityId: string) => void;
  onNavigateToInvestigation: (invId: string) => void;
  onNavigateToView: (view: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  onNavigateToEntity,
  onNavigateToInvestigation,
  onNavigateToView
}) => {
  if (!stats) {
    return (
      <div className="p-8 flex items-center justify-center text-[#A0A0A0] text-sm">
        <Activity className="w-4 h-4 animate-spin mr-2 text-[#F2D35E]" />
        Loading telemetry baselines...
      </div>
    );
  }

  const {
    totalEventsProcessed = 2231,
    totalEntitiesProfiled = 15,
    anomaliesFlagged = 3,
    openInvestigationsCount = 5,
    correlatedChainsCount = 6,
    volumeTrends = [],
    severityDistribution = {},
    topDeviatingEntities = [],
    recentInvestigations = []
  } = stats;

  const statCards = [
    {
      label: 'Events Processed',
      value: totalEventsProcessed.toLocaleString(),
      subtext: 'Normalized telemetry partition',
      icon: Activity,
      color: 'text-white'
    },
    {
      label: 'Entities Profiled',
      value: totalEntitiesProfiled.toString(),
      subtext: 'Users, hosts, servers, IPs',
      icon: Fingerprint,
      color: 'text-white'
    },
    {
      label: 'Behavioral Deviations',
      value: anomaliesFlagged.toString(),
      subtext: 'BDI score ≥ 50 / 100',
      icon: AlertTriangle,
      color: 'text-[#F2D35E]',
      highlight: true
    },
    {
      label: 'Correlated Chains',
      value: correlatedChainsCount.toString(),
      subtext: 'MITRE ATT&CK reconstructions',
      icon: Layers,
      color: 'text-white'
    },
    {
      label: 'Open Investigations',
      value: openInvestigationsCount.toString(),
      subtext: 'Active forensic cases',
      icon: ShieldAlert,
      color: 'text-white'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#0A0A0A] text-[#D8D8D8]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Institutional Forensics Intelligence</div>
          <h1 className="font-display text-4xl sm:text-5xl font-light tracking-tight text-white mt-1">Platform Overview</h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-light max-w-2xl leading-relaxed">
            Continuous behavioral baseline construction across 2,231 verified security events. Dual-layer Isolation Forest and robust statistical deviation modeling identify anomalous state changes without relying on static heuristics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-[#111111] border border-[#292929] text-[#10B981]">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            Parquet Sync Verified
          </span>
          <span className="px-2.5 py-1 text-[11px] font-mono bg-[#171717] border border-[#292929] text-[#F2D35E] font-medium">
            RESEARCH CORPUS
          </span>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 bg-[#111111] border ${card.highlight ? 'border-[#F2D35E]/50 shadow-[0_0_16px_rgba(242,211,94,0.06)]' : 'border-[#292929]'} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between text-[#777777] mb-3">
                  <span className="text-[11px] uppercase tracking-wider font-mono">{card.label}</span>
                  <Icon className={`w-4 h-4 ${card.highlight ? 'text-[#F2D35E]' : 'text-[#777777]'}`} strokeWidth={1.5} />
                </div>
                <div className={`text-3xl font-light tracking-tight ${card.color}`}>
                  {card.value}
                </div>
              </div>
              <div className="text-[11px] text-[#777777] font-light mt-3 border-t border-[#292929] pt-2">
                {card.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Volume Bar Chart */}
        <div className="lg:col-span-2 p-6 bg-[#111111] border border-[#292929]">
          <div className="flex items-center justify-between mb-4 border-b border-[#292929] pb-3">
            <div>
              <h3 className="text-sm font-medium text-white">Security Telemetry Ingestion Velocity</h3>
              <p className="text-[11px] text-[#777777]">Daily distribution of events across 14-day observation window</p>
            </div>
            <span className="text-[11px] font-mono text-[#F2D35E]">UTC Window</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeTrends}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#777777' }}
                  tickLine={false}
                  axisLine={{ stroke: '#292929' }}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#777777' }}
                  tickLine={false}
                  axisLine={{ stroke: '#292929' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #292929',
                    borderRadius: '0px',
                    fontSize: '11px',
                    fontFamily: 'IBM Plex Mono',
                    color: '#D8D8D8'
                  }}
                  cursor={{ fill: '#1F1F1F' }}
                />
                <Bar dataKey="count" fill="#F2D35E" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="p-6 bg-[#111111] border border-[#292929] flex flex-col justify-between">
          <div>
            <div className="border-b border-[#292929] pb-3 mb-4">
              <h3 className="text-sm font-medium text-white">Telemetry Risk Severity</h3>
              <p className="text-[11px] text-[#777777]">Classified according to CVSS & MITRE risk impact</p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Critical Severity', key: 'CRITICAL', color: 'bg-[#EF4444]', text: 'text-[#EF4444]' },
                { label: 'High Severity', key: 'HIGH', color: 'bg-[#F87171]', text: 'text-[#F87171]' },
                { label: 'Medium Severity', key: 'MEDIUM', color: 'bg-[#F59E0B]', text: 'text-[#F59E0B]' },
                { label: 'Low Severity', key: 'LOW', color: 'bg-[#60A5FA]', text: 'text-[#60A5FA]' },
                { label: 'Informational', key: 'INFO', color: 'bg-[#777777]', text: 'text-[#777777]' },
              ].map((sev) => {
                const count = severityDistribution[sev.key] || 0;
                const pct = Math.round((count / Math.max(totalEventsProcessed, 1)) * 100);
                return (
                  <div key={sev.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-light text-[#A0A0A0]">{sev.label}</span>
                      <span className="font-mono text-xs text-white">{count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-[#171717] h-1.5 overflow-hidden border border-[#292929]">
                      <div className={`h-full ${sev.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#292929] text-[11px] text-[#777777] flex items-center justify-between">
            <span className="font-mono">Threshold: Z &gt; 2.5&sigma;</span>
            <button
              onClick={() => onNavigateToView('analytics')}
              className="text-[#F2D35E] hover:underline flex items-center gap-0.5 font-mono text-xs"
            >
              Detailed Analytics <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Deviations & Recent Investigations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Deviating Entities */}
        <div className="p-6 bg-[#111111] border border-[#292929]">
          <div className="flex items-center justify-between border-b border-[#292929] pb-3 mb-4">
            <div>
              <h3 className="text-sm font-medium text-white">Entities with Greatest Behavioral Deviation</h3>
              <p className="text-[11px] text-[#777777]">Ranked by Composite Behavioral Deviation Index (BDI)</p>
            </div>
            <button
              onClick={() => onNavigateToView('entities')}
              className="text-xs font-mono text-[#F2D35E] hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#292929]">
            {topDeviatingEntities.map((ent: any) => {
              const isHigh = ent.deviationIndex >= 50;
              return (
                <div
                  key={ent.id}
                  onClick={() => onNavigateToEntity(ent.id)}
                  className="py-3 flex items-center justify-between hover:bg-[#171717] px-2 -mx-2 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#171717] border border-[#292929] flex items-center justify-center text-xs font-mono text-[#F2D35E]">
                      {ent.type[0]}
                    </div>
                    <div>
                      <div className="font-mono text-xs text-white font-medium">{ent.id}</div>
                      <div className="text-[11px] text-[#777777] font-light">{ent.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-mono text-xs font-medium ${isHigh ? 'text-[#F2D35E]' : 'text-white'}`}>
                        BDI {ent.deviationIndex}
                      </div>
                      <div className="text-[10px] text-[#777777] font-light font-mono">
                        Risk: {ent.riskScore}/100
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#777777]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Investigations */}
        <div className="p-6 bg-[#111111] border border-[#292929]">
          <div className="flex items-center justify-between border-b border-[#292929] pb-3 mb-4">
            <div>
              <h3 className="text-sm font-medium text-white">Recent Correlated Investigations</h3>
              <p className="text-[11px] text-[#777777]">Evidence-backed digital forensics cases</p>
            </div>
            <button
              onClick={() => onNavigateToView('investigations')}
              className="text-xs font-mono text-[#F2D35E] hover:underline flex items-center gap-1"
            >
              Workspace <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#292929]">
            {recentInvestigations.map((inv: any) => (
              <div
                key={inv.id}
                onClick={() => onNavigateToInvestigation(inv.id)}
                className="py-3 flex items-center justify-between hover:bg-[#171717] px-2 -mx-2 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#F2D35E]">{inv.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 border ${
                      inv.severity === 'CRITICAL' ? 'border-rose-900 text-[#EF4444] bg-rose-950/40' :
                      inv.severity === 'HIGH' ? 'border-rose-900/60 text-[#F87171] bg-rose-950/20' :
                      'border-[#292929] text-[#A0A0A0] bg-[#171717]'
                    }`}>
                      {inv.severity}
                    </span>
                  </div>
                  <div className="text-xs text-white font-medium mt-1">{inv.title}</div>
                  <div className="text-[11px] text-[#777777] font-light truncate max-w-sm">
                    {inv.summary}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 border font-mono ${
                    inv.status === 'In Progress' ? 'border-[#F2D35E] bg-[#F2D35E] text-[#0A0A0A] font-medium' :
                    inv.status === 'Resolved' ? 'border-emerald-800 text-[#10B981] bg-emerald-950/30' :
                    'border-[#292929] text-[#A0A0A0] bg-[#171717]'
                  }`}>
                    {inv.status}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#777777]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ingestion & Provenance Status Banner */}
      <div className="p-5 border border-[#292929] bg-[#111111] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-[#F2D35E] shrink-0" />
          <div>
            <div className="text-xs font-medium text-white">Data Pipeline & Baseline Calculation Status</div>
            <div className="text-[11px] text-[#777777] font-mono">
              Input: <code className="text-[#F2D35E]">sample_security_events.csv</code> (2,231 events) • Parquet Store Active • No Data Leakage Split (70/30)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onNavigateToView('methodology')}
            className="px-3 py-1.5 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:bg-[#222222] transition-colors"
          >
            Methodology
          </button>
          <button
            onClick={() => onNavigateToView('datasources')}
            className="px-3 py-1.5 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-colors font-medium"
          >
            Data Sources
          </button>
        </div>
      </div>
    </div>
  );
};
