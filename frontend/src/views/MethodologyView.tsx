import React, { useState } from 'react';
import {
  Layers,
  Fingerprint,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      step: '01',
      title: 'Ingestion & Schema Normalization',
      summary: 'Strict column verification, UTC ISO-8601 timestamp parsing, and telemetry type validation.',
      details: 'Ingestion accepts streaming or batched CSV, JSON, and Apache Parquet formats. Mandatory schema constraints (timestamp, event_id, event_type, entity_id, entity_type, severity) ensure downstream analytics receive clean inputs without missing temporal reference frames.'
    },
    {
      step: '02',
      title: 'Data Cleaning & Temporal Feature Extraction',
      summary: 'Data typing, null imputation, diurnal hour extraction, and weekend flags.',
      details: 'Timestamps are sorted chronologically. Auxiliary variables are synthesized, including hour_of_day (0-23), day_of_week (0-6), is_weekend, and is_off_hours (prior to 07:00 or after 19:00 UTC). Missing socket ports or byte counts are imputed deterministically.'
    },
    {
      step: '03',
      title: 'Entity Resolution & Feature Engineering',
      summary: 'Shannon entropy of activity, destination IP diversity, authentication failure ratios, and byte burst metrics.',
      details: 'For each entity (User, Device, Server, IP, Domain), an n-dimensional behavioral vector is constructed. Shannon Entropy H(X) = -sum(p(x) * log2(p(x))) captures the dispersion of activity across the 24 hours of the day. Destination diversity evaluates the unique IP ratio over total interactions.'
    },
    {
      step: '04',
      title: 'Baseline Construction (No Data Leakage)',
      summary: 'Chronological 70/30 window split, parametric (mean, std) and non-parametric (median, MAD) bounds.',
      details: 'To prevent temporal data leakage, historical observation records are strictly separated from current evaluation windows. Baselines compute mean (mu) and standard deviation (sigma) alongside robust median and Median Absolute Deviation (MAD) bounds for non-normally distributed event velocities.'
    },
    {
      step: '05',
      title: 'Scientific Safeguard: Minimum History Rule',
      summary: 'Explicit prevention of fabricated baselines when observations are insufficient (< 10 events).',
      details: 'Entities with fewer than 10 historical telemetry events are classified as INSUFFICIENT_HISTORY. The platform refuses to manufacture statistical bounds or compute artificial anomaly scores when the sample size lacks statistical power.'
    },
    {
      step: '06',
      title: 'Dual-Layer Anomaly Detection (Z-Score + Isolation Forest)',
      summary: 'Feature-level standard deviations coupled with unsupervised multidimensional tree isolation.',
      details: 'Layer 1 evaluates feature-level Z-scores: Z = (x - mu) / sigma. Layer 2 executes Scikit-Learn IsolationForest (100 estimators, 15% contamination). Isolation tree depths are calibrated into normalized [0, 100] risk scores, distinct from raw decision-function metrics.'
    },
    {
      step: '07',
      title: 'MITRE ATT&CK Attack-Chain Reconstruction',
      summary: 'Cross-entity temporal correlation tracking credential bursts, lateral movement, and data staging.',
      details: 'Rule-based temporal correlation correlates related events occurring within 4-hour windows. For example, multiple AUTH_FAILURE events followed by AUTH_SUCCESS, subsequent process execution, and off-hours outbound data transfer are assembled into unified intrusion progressions.'
    },
    {
      step: '08',
      title: 'Forensic Hypotheses & Evidentiary Limitations',
      summary: 'Rigorous separation of observed facts from investigative hypotheses. Anomaly != Malice.',
      details: 'Statistical divergence alone never constitutes proof of malicious adversarial intent. The system explicitly partitions verified telemetry facts from hypotheses, acknowledging telemetry blind spots, encrypted payloads, and DHCP lease rotations.'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#777777] uppercase">Academic Research Standard</div>
          <h1 className="text-3xl font-light tracking-tight text-[#D8D8D8] mt-1 font-serif">Platform Methodology & Architecture</h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-light max-w-2xl leading-relaxed">
            Detailed mathematical and architectural documentation explaining data transformation, behavioral baseline construction, unsupervised anomaly isolation, and evidence-grounded digital forensics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 bg-[#111111] border border-[#292929] text-[#A0A0A0]">
            Master's Thesis Specification
          </span>
        </div>
      </div>

      {/* Interactive System Architecture Diagram */}
      <div className="bg-[#111111] border border-[#292929] p-6 space-y-4">
        <div className="border-b border-[#292929] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-normal text-[#D8D8D8]">CyberDNA End-to-End System Architecture</h3>
            <p className="text-[11px] text-[#777777]">Data pipeline and modular analytics dataflow</p>
          </div>
          <span className="text-[10px] font-mono text-[#777777]">Interactive Diagram</span>
        </div>

        {/* Visual Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#171717] border border-[#292929] space-y-2">
            <div className="flex items-center justify-between text-[#777777] text-[10px]">
              <span>STAGE 1</span>
              <Layers className="w-3.5 h-3.5 text-[#F2D35E]" />
            </div>
            <div className="font-sans font-medium text-[#D8D8D8] text-sm">Telemetry Ingestion</div>
            <p className="font-sans text-[11px] text-[#A0A0A0] font-light leading-relaxed">
              CSV / JSON / Parquet logs parsed & verified against strict schemas.
            </p>
            <div className="pt-2 text-[10px] text-[#777777] border-t border-[#292929]">
              Validation & Cleaning
            </div>
          </div>

          <div className="p-4 bg-[#171717] border border-[#292929] space-y-2">
            <div className="flex items-center justify-between text-[#777777] text-[10px]">
              <span>STAGE 2</span>
              <Fingerprint className="w-3.5 h-3.5 text-[#F2D35E]" />
            </div>
            <div className="font-sans font-medium text-[#D8D8D8] text-sm">Feature Engineering</div>
            <p className="font-sans text-[11px] text-[#A0A0A0] font-light leading-relaxed">
              Shannon entropy, destination diversity, off-hours ratios & failure velocities.
            </p>
            <div className="pt-2 text-[10px] text-[#777777] border-t border-[#292929]">
              Multivariate Profiling
            </div>
          </div>

          <div className="p-4 bg-[#171717] border border-[#292929] space-y-2">
            <div className="flex items-center justify-between text-[#777777] text-[10px]">
              <span>STAGE 3</span>
              <Cpu className="w-3.5 h-3.5 text-[#F2D35E]" />
            </div>
            <div className="font-sans font-medium text-[#D8D8D8] text-sm">Dual Analytical Core</div>
            <p className="font-sans text-[11px] text-[#A0A0A0] font-light leading-relaxed">
              Statistical Z-scores + Isolation Forest (100 trees). Minimum history safeguard.
            </p>
            <div className="pt-2 text-[10px] text-[#777777] border-t border-[#292929]">
              Z &gt; 2.5 & IF Modeling
            </div>
          </div>

          <div className="p-4 bg-[#171717] border border-[#292929] space-y-2">
            <div className="flex items-center justify-between text-[#777777] text-[10px]">
              <span>STAGE 4</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#F2D35E]" />
            </div>
            <div className="font-sans font-medium text-[#D8D8D8] text-sm">Forensic Reconstruction</div>
            <p className="font-sans text-[11px] text-[#A0A0A0] font-light leading-relaxed">
              Attack graph generation, MITRE tactic correlation, and exportable dossiers.
            </p>
            <div className="pt-2 text-[10px] text-[#777777] border-t border-[#292929]">
              Evidence-based Dossiers
            </div>
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Methodology Accordion / Details */}
      <div className="bg-[#111111] border border-[#292929] p-6 space-y-6">
        <div className="border-b border-[#292929] pb-3">
          <h3 className="text-sm font-normal text-[#D8D8D8]">Methodological Principles & Mathematical Formulations</h3>
          <p className="text-[11px] text-[#777777]">Click any pipeline stage to inspect technical formulation and safeguards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Stage list (5 cols) */}
          <div className="md:col-span-5 space-y-1">
            {stages.map((st, idx) => (
              <button
                key={st.step}
                onClick={() => setActiveStage(idx)}
                className={`w-full text-left p-3 text-xs border transition-colors flex items-start gap-3 ${
                  activeStage === idx
                    ? 'bg-[#F2D35E] text-[#0A0A0A] border-[#F2D35E] font-medium'
                    : 'bg-[#171717] text-[#A0A0A0] border-[#292929] hover:bg-[#202020] hover:text-[#D8D8D8]'
                }`}
              >
                <span className="font-mono text-[11px] opacity-80">{st.step}</span>
                <div>
                  <div className="font-normal">{st.title}</div>
                  <div className={`text-[10px] mt-0.5 line-clamp-1 ${activeStage === idx ? 'text-[#0A0A0A]/80' : 'text-[#777777]'}`}>
                    {st.summary}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Stage Details (7 cols) */}
          <div className="md:col-span-7 p-6 bg-[#171717] border border-[#292929] space-y-4 text-xs">
            <div className="border-b border-[#292929] pb-3">
              <span className="text-[10px] font-mono text-[#777777] uppercase">Stage {stages[activeStage].step} Formulation</span>
              <h4 className="text-base font-normal text-[#D8D8D8] mt-1 font-serif">
                {stages[activeStage].title}
              </h4>
            </div>

            <p className="text-[#A0A0A0] leading-relaxed font-light text-sm">
              {stages[activeStage].details}
            </p>

            {activeStage === 2 && (
              <div className="p-3 bg-[#111111] border border-[#292929] font-mono text-[11px] space-y-1">
                <div className="text-[#777777]">Shannon Hourly Entropy:</div>
                <div className="text-[#F2D35E] font-medium">H(Hour) = - &Sigma; [ p(h) &middot; log&sub2;(p(h)) ]</div>
                <div className="text-[#777777] text-[10px] mt-1">Bounds: 0.0 (concentrated in 1 hour) to 4.58 (evenly dispersed across 24h).</div>
              </div>
            )}

            {activeStage === 3 && (
              <div className="p-3 bg-[#111111] border border-[#292929] font-mono text-[11px] space-y-1">
                <div className="text-[#777777]">Modified Z-Score (MAD):</div>
                <div className="text-[#F2D35E] font-medium">M_i = 0.6745 &middot; (x_i - Median) / MAD</div>
                <div className="text-[#777777] text-[10px] mt-1">Resistant to extreme statistical outliers during baseline calculation.</div>
              </div>
            )}

            {activeStage === 4 && (
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
                <strong className="text-amber-200">Anti-Hallucination Safeguard:</strong> Never fabricate a behavioral baseline when historical observations are insufficient. If N &lt; 10, state is formally tagged <code className="text-[#F2D35E]">INSUFFICIENT_HISTORY</code> and no anomaly flag is raised.
              </div>
            )}

            {activeStage === 7 && (
              <div className="p-3 bg-[#111111] border border-[#292929] text-[#D8D8D8] text-xs space-y-1 leading-relaxed">
                <strong className="text-[#F2D35E]">Forensic Standard:</strong> Distinguish observed facts, statistical anomalies, rule-based findings, inferred relationships, and investigative hypotheses. Never claim that an anomaly alone proves malicious intent.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
