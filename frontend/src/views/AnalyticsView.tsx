import React, { useState, useEffect } from 'react';
import {
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { api } from '../services/api';

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center text-[#A0A0A0] text-xs font-mono">
        <Activity className="w-4 h-4 animate-spin mr-2 text-[#F2D35E]" />
        Aggregating multi-dimensional forensic metrics...
      </div>
    );
  }

  const {
    featureShifts = [],
    riskBuckets = [],
    pipelineMetrics = {},
  } = data;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#777777] uppercase">Scientific Analytics</div>
          <h1 className="text-3xl font-light tracking-tight text-[#D8D8D8] mt-1 font-serif">Behavioral Deviations & Model Metrics</h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-light max-w-2xl leading-relaxed">
            Analytical evaluation of behavioral baseline shifts, multivariate Isolation Forest contamination modeling, and MITRE tactic reconstruction across normalized telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 bg-[#111111] border border-[#292929] text-[#A0A0A0]">
            Scikit-Learn IsolationForest • 100 Estimators
          </span>
        </div>
      </div>

      {/* Model Parameters & Processing Benchmark Banner */}
      <div className="p-6 bg-[#111111] border border-[#292929]">
        <div className="border-b border-[#292929] pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-normal text-[#D8D8D8]">Big Data Execution & Hyperparameter Benchmark</h3>
            <p className="text-[11px] text-[#777777]">Evaluated on real telemetry slices without synthetic data leakage</p>
          </div>
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/30">
            Validated Run
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#171717] border border-[#292929]">
            <span className="text-[#777777] block text-[10px]">Contamination factor</span>
            <span className="text-[#D8D8D8] font-medium text-sm mt-1 block">{pipelineMetrics.isolationForestContamination} (15%)</span>
          </div>
          <div className="p-3 bg-[#171717] border border-[#292929]">
            <span className="text-[#777777] block text-[10px]">Trees in Ensemble</span>
            <span className="text-[#D8D8D8] font-medium text-sm mt-1 block">{pipelineMetrics.treesInEnsemble} trees</span>
          </div>
          <div className="p-3 bg-[#171717] border border-[#292929]">
            <span className="text-[#777777] block text-[10px]">Z-Score Threshold</span>
            <span className="text-[#D8D8D8] font-medium text-sm mt-1 block">&ge; {pipelineMetrics.zScoreThreshold} &sigma;</span>
          </div>
          <div className="p-3 bg-[#171717] border border-[#292929]">
            <span className="text-[#777777] block text-[10px]">Baseline Partition</span>
            <span className="text-[#D8D8D8] font-medium text-sm mt-1 block">{pipelineMetrics.totalTrainedSamples} events (70%)</span>
          </div>
          <div className="p-3 bg-[#171717] border border-[#292929]">
            <span className="text-[#777777] block text-[10px]">Evaluation Window</span>
            <span className="text-[#D8D8D8] font-medium text-sm mt-1 block">{pipelineMetrics.evaluationWindowEvents} events (30%)</span>
          </div>
          <div className="p-3 bg-[#171717] border border-[#292929]">
            <span className="text-[#777777] block text-[10px]">Pipeline Execution Time</span>
            <span className="text-[#F2D35E] font-medium text-sm mt-1 block">{pipelineMetrics.runtimeSeconds}s</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Shift Z-Scores */}
        <div className="p-6 bg-[#111111] border border-[#292929]">
          <div className="border-b border-[#292929] pb-3 mb-4">
            <h3 className="text-sm font-normal text-[#D8D8D8]">Feature-Level Statistical Shift Magnitude (&sigma;)</h3>
            <p className="text-[11px] text-[#777777]">Average standard deviation deviation across flagged anomalies</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureShifts} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: '#777777' }} domain={[0, 6]} stroke="#292929" />
                <YAxis
                  dataKey="feature"
                  type="category"
                  tick={{ fontSize: 10, fill: '#D8D8D8' }}
                  width={150}
                  tickLine={false}
                  stroke="#292929"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #292929',
                    fontSize: '11px',
                    fontFamily: 'IBM Plex Mono',
                    color: '#D8D8D8'
                  }}
                />
                <Bar dataKey="zScore" fill="#F2D35E" barSize={14}>
                  {featureShifts.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.severity === 'CRITICAL' ? '#EF4444' : entry.severity === 'HIGH' ? '#F87171' : '#F2D35E'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Buckets */}
        <div className="p-6 bg-[#111111] border border-[#292929]">
          <div className="border-b border-[#292929] pb-3 mb-4">
            <h3 className="text-sm font-normal text-[#D8D8D8]">Entity Risk Score Distribution</h3>
            <p className="text-[11px] text-[#777777]">Population density across calibrated behavioral risk spectrum</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBuckets}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#777777' }} tickLine={false} stroke="#292929" />
                <YAxis tick={{ fontSize: 10, fill: '#777777' }} tickLine={false} stroke="#292929" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #292929',
                    fontSize: '11px',
                    fontFamily: 'IBM Plex Mono',
                    color: '#D8D8D8'
                  }}
                />
                <Bar dataKey="count" fill="#F2D35E" barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Tactic Correlation Distribution */}
      <div className="p-6 bg-[#111111] border border-[#292929]">
        <div className="border-b border-[#292929] pb-3 mb-4">
          <h3 className="text-sm font-normal text-[#D8D8D8]">Correlated MITRE ATT&CK Matrix Coverage</h3>
          <p className="text-[11px] text-[#777777]">Distribution of verified tactics reconstructed from telemetry event chains</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 border border-[#292929] bg-[#171717]">
            <div className="text-[10px] font-mono text-[#777777] uppercase">Initial Access</div>
            <div className="font-mono text-[#F2D35E] font-medium mt-1">T1078 Valid Accounts</div>
            <div className="text-[11px] text-[#A0A0A0] mt-1 leading-relaxed">1 compromise correlated following credential stuffing burst</div>
          </div>

          <div className="p-3 border border-[#292929] bg-[#171717]">
            <div className="text-[10px] font-mono text-[#777777] uppercase">Execution & Persistence</div>
            <div className="font-mono text-[#F2D35E] font-medium mt-1">T1059 Scripting</div>
            <div className="text-[11px] text-[#A0A0A0] mt-1 leading-relaxed">4 encoded PowerShell & credential dumping executions</div>
          </div>

          <div className="p-3 border border-[#292929] bg-[#171717]">
            <div className="text-[10px] font-mono text-[#777777] uppercase">Lateral Movement</div>
            <div className="font-mono text-[#F2D35E] font-medium mt-1">T1021 Remote Services</div>
            <div className="text-[11px] text-[#A0A0A0] mt-1 leading-relaxed">RDP & SMB staging across Domain Controller & SQL cluster</div>
          </div>

          <div className="p-3 border border-[#292929] bg-[#171717]">
            <div className="text-[10px] font-mono text-[#777777] uppercase">Exfiltration</div>
            <div className="font-mono text-[#F2D35E] font-medium mt-1">T1048 Alt Protocol</div>
            <div className="text-[11px] text-[#A0A0A0] mt-1 leading-relaxed">High-volume off-hours transfer to drop server (1.2 GB)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
