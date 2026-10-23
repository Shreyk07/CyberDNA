import React, { useState } from 'react';
import {
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Fingerprint,
  Menu,
  X,
  CheckCircle2,
  Database,
  Cpu,
  Server,
  Network,
  Share2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { CyberDNALogo } from '../components/CyberDNALogo';

interface PublicHomeViewProps {
  onNavigateToLogin: () => void;
  onEnterDemo: () => void;
}

interface TelemetryEntityNode {
  id: string;
  label: string;
  type: 'USER' | 'DEVICE' | 'SERVER' | 'IP' | 'DOMAIN';
  x: number;
  y: number;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  bdi: number;
  entropy: string;
  events: number;
  tactic: string;
  detail: string;
}

export const PublicHomeView: React.FC<PublicHomeViewProps> = ({
  onNavigateToLogin,
  onEnterDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('user:elena.rostova');

  // Interactive Behavioral DNA Showcase nodes
  const telemetryNodes: TelemetryEntityNode[] = [
    {
      id: 'user:elena.rostova',
      label: 'user:elena.rostova',
      type: 'USER',
      x: 140,
      y: 130,
      risk: 'CRITICAL',
      bdi: 84,
      entropy: '1.84 / 4.58 (Steep Deviation)',
      events: 48,
      tactic: 'T1078 Valid Accounts (Compromised)',
      detail: '12 consecutive authentication failures followed by off-hours privilege escalation.'
    },
    {
      id: 'host:WS-FIN-01',
      label: 'host:WS-FIN-01',
      type: 'DEVICE',
      x: 290,
      y: 200,
      risk: 'HIGH',
      bdi: 72,
      entropy: '2.10 / 4.58',
      events: 112,
      tactic: 'T1059 Command & Scripting Execution',
      detail: 'Encoded PowerShell script spawned under financial workstation context.'
    },
    {
      id: 'srv:DC01.corp.local',
      label: 'srv:DC01.corp.local',
      type: 'SERVER',
      x: 430,
      y: 110,
      risk: 'HIGH',
      bdi: 68,
      entropy: '3.45 / 4.58',
      events: 340,
      tactic: 'T1021.002 Remote SMB Staging',
      detail: 'Lateral Kerberos ticket queries originating from unauthorized financial subnet.'
    },
    {
      id: 'srv:SQL01.prod.local',
      label: 'srv:SQL01.prod.local',
      type: 'SERVER',
      x: 520,
      y: 240,
      risk: 'CRITICAL',
      bdi: 89,
      entropy: '1.42 / 4.58 (Anomalous Spike)',
      events: 215,
      tactic: 'T1048 Alternate Protocol Exfiltration',
      detail: 'Off-hours burst transmission of 279 MB staged database archive.'
    },
    {
      id: 'ip:10.0.1.15',
      label: 'ip:10.0.1.15',
      type: 'IP',
      x: 270,
      y: 330,
      risk: 'MEDIUM',
      bdi: 42,
      entropy: '3.80 / 4.58',
      events: 198,
      tactic: 'Internal Gateway Routing',
      detail: 'Corporate subnet routing node exhibiting sudden lateral socket bursts.'
    },
    {
      id: 'ip:198.51.100.23',
      label: 'ip:198.51.100.23',
      type: 'IP',
      x: 690,
      y: 290,
      risk: 'CRITICAL',
      bdi: 94,
      entropy: '0.92 / 4.58 (Single-Host Drop)',
      events: 34,
      tactic: 'T1041 Exfiltration Over C2 Channel',
      detail: 'External drop-box receiving scheduled archive uploads during night hours.'
    },
    {
      id: 'domain:storage-cloud-sync.net',
      label: 'storage-cloud-sync.net',
      type: 'DOMAIN',
      x: 680,
      y: 130,
      risk: 'HIGH',
      bdi: 76,
      entropy: '1.15 / 4.58',
      events: 28,
      tactic: 'T1071 Application Layer C2 Protocol',
      detail: 'Rapid TXT query bursts acting as dead-drop beacon for exfiltrated tokens.'
    }
  ];

  // Verified telemetry relationships connecting nodes
  const telemetryEdges = [
    { from: 'user:elena.rostova', to: 'host:WS-FIN-01', label: 'AUTH_SUCCESS (Off-Hours)' },
    { from: 'host:WS-FIN-01', to: 'srv:DC01.corp.local', label: 'T1021.002 SMB Session' },
    { from: 'host:WS-FIN-01', to: 'ip:10.0.1.15', label: 'Subnet Ingress' },
    { from: 'srv:DC01.corp.local', to: 'srv:SQL01.prod.local', label: 'Lateral Admin Pivot' },
    { from: 'srv:SQL01.prod.local', to: 'ip:198.51.100.23', label: '279 MB Exfiltration Stream' },
    { from: 'srv:SQL01.prod.local', to: 'domain:storage-cloud-sync.net', label: 'DNS C2 Beacon' }
  ];

  const selectedNode = telemetryNodes.find(n => n.id === selectedEntityId) || telemetryNodes[0];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#D8D8D8] font-sans selection:bg-[#F2D35E] selection:text-[#0A0A0A]">
      {/* =========================================================================
          1. HEADER (NexBank-Inspired Minimalist Dark Editorial Header)
      ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#292929]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo & Wordmark in signature yellow */}
          <a href="#" className="flex items-center gap-3">
            <CyberDNALogo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-tight text-[#A0A0A0] font-normal">
            <a href="#platform" className="hover:text-white transition-colors">Behavioral DNA</a>
            <a href="#telemetry-graph" className="hover:text-white transition-colors">Entity Correlation</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Forensics Pipeline</a>
            <a href="#methodology" className="hover:text-white transition-colors">Scientific Methodology</a>
            <a href="#evidence" className="hover:text-white transition-colors">Evidence Standards</a>
          </nav>

          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2.5 text-[#A0A0A0] hover:text-white transition-colors tracking-wider uppercase text-[11px]"
            >
              Sign In
            </button>
            <button
              onClick={onEnterDemo}
              className="px-5 py-2.5 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-all font-medium tracking-tight flex items-center gap-2 group text-xs shadow-[0_0_20px_rgba(242,211,94,0.15)]"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#D8D8D8] hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#111111] border-b border-[#292929] px-6 py-6 space-y-4 text-sm">
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Behavioral DNA
            </a>
            <a
              href="#telemetry-graph"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Entity Correlation
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Forensics Pipeline
            </a>
            <a
              href="#methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Scientific Methodology
            </a>
            <a
              href="#evidence"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Evidence Standards
            </a>
            <div className="pt-4 border-t border-[#292929] flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateToLogin(); }}
                className="w-full py-2.5 text-center border border-[#292929] text-[#D8D8D8] hover:bg-[#171717]"
              >
                Sign In
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onEnterDemo(); }}
                className="w-full py-2.5 text-center bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] font-medium"
              >
                Explore Platform (Demo)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION (Enterprise Security Operations Center & Editorial Serif)
      ========================================================================= */}
      <section className="relative min-h-[calc(100vh-5rem)] border-b border-[#292929] flex flex-col justify-between overflow-hidden bg-[#0A0A0A]">
        {/* Subtle coordinate stamp */}
        <div className="absolute top-8 right-8 z-10 hidden lg:block text-right font-mono text-[11px] text-[#777777] tracking-wider select-none">
          <div>ENTERPRISE SOC TELEMETRY // ACTIVE CORPUS</div>
          <div className="text-[#F2D35E] mt-0.5 font-medium">PARQUET 2,231 EVENTS • MITRE ATT&CK GROUNDED</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center flex-1">
          {/* Left Column: Expressive Headline & Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-8 z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#111111] border border-[#292929] text-[11px] font-mono tracking-widest uppercase text-[#F2D35E]">
              <span className="w-1.5 h-1.5 bg-[#F2D35E] inline-block shadow-[0_0_8px_#F2D35E]" />
              Behavioral Fingerprinting & Digital Forensics
            </div>

            {/* Main Headline with Editorial Serif & Italic emphasis */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.4rem] xl:text-[6.2rem] font-light tracking-tight text-white leading-[1.04]">
              Understand behavior.<br />
              <em className="italic font-normal text-[#F2D35E]">
                Uncover what changed.
              </em>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#A0A0A0] font-light max-w-xl leading-relaxed">
              CyberDNA continuously learns behavioral baselines across users, endpoints, servers, and network sockets—detecting stealthy lateral movement, credential compromise, and off-hours data staging without synthetic alert fatigue.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onEnterDemo}
                className="px-8 py-4 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-all font-medium text-sm tracking-tight flex items-center justify-center gap-3 group shadow-[0_0_24px_rgba(242,211,94,0.18)]"
              >
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href="#telemetry-graph"
                className="px-8 py-4 bg-[#171717] text-[#D8D8D8] border border-[#292929] hover:bg-[#222222] transition-colors font-normal text-sm text-center tracking-tight"
              >
                Entity Telemetry Graph
              </a>
            </div>

            {/* Technical Metric Row */}
            <div className="pt-8 border-t border-[#292929] grid grid-cols-3 gap-6 max-w-lg text-xs font-mono">
              <div>
                <div className="text-xl sm:text-2xl font-light text-white">2,231</div>
                <div className="text-[11px] text-[#777777] font-light mt-0.5">Verified Events</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-light text-[#F2D35E]">15</div>
                <div className="text-[11px] text-[#777777] font-light mt-0.5">Profiled Entities</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-light text-[#EF4444]">6 Chains</div>
                <div className="text-[11px] text-[#777777] font-light mt-0.5">ATT&CK Reconstructions</div>
              </div>
            </div>
          </div>

          {/* Right Column: Cinematic SOC Hero Visual (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-[#292929] overflow-hidden bg-black shadow-2xl">
              {/* Enterprise Security Operations Center (SOC) Photography */}
              <img
                src="/assets/hero_soc.jpg"
                alt="CyberDNA Enterprise Security Operations Center (SOC) with real-time telemetry analysis"
                className="w-full h-[520px] object-cover contrast-110 brightness-95 object-center"
              />

              {/* Minimal vignette overlay to preserve photograph depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none opacity-75" />

              <div className="absolute bottom-6 left-6 right-6 text-white z-10 flex items-end justify-between">
                <div>
                  <div className="font-mono text-[10px] text-[#F2D35E] uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
                    Security Operations Telemetry
                  </div>
                  <div className="font-sans text-sm font-light text-[#D8D8D8] mt-1">
                    Multi-Dimensional SOC State Monitoring
                  </div>
                </div>

                <div className="font-mono text-xs text-[#777777]">
                  REF. 01 / 05
                </div>
              </div>

              {/* Large subtle outline numeral */}
              <div className="absolute top-4 right-6 text-8xl font-display text-outline-yellow select-none pointer-events-none opacity-40">
                01
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="border-t border-[#292929] bg-[#111111] px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] font-mono gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#A0A0A0]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block shadow-[0_0_8px_#10B981]" />
              Engine Online • Scikit-Learn IsolationForest
            </span>
            <span>|</span>
            <span>Zero Temporal Leakage (70/30 Split)</span>
          </div>

          <div className="text-[#A0A0A0]">
            Master's in Cybersecurity Research • Academic Year 2026
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION A — THE PLATFORM (Three Core Capabilities)
      ========================================================================= */}
      <section id="platform" className="py-24 border-b border-[#292929] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Core Capabilities</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
              Three Dimensions of <em className="italic text-[#F2D35E]">Forensic Intelligence</em>
            </h2>
            <p className="text-[#A0A0A0] text-base font-light leading-relaxed">
              Moving beyond static firewall rules and alert fatigue. CyberDNA grounds threat detection in mathematical deviations from observed historical behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Behavioral DNA */}
            <div className="p-8 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/40 transition-colors flex flex-col justify-between space-y-8 relative group">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-[#F2D35E] flex items-center justify-center font-mono text-xs text-[#F2D35E] bg-[#0A0A0A]">
                  01
                </div>
                <h3 className="text-2xl font-light text-white font-display">Behavioral DNA</h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed font-light">
                  Establish historical behavioral patterns for users, devices, IP addresses, servers, and domains. Shannon Hourly Entropy measures diurnal dispersion without temporal data leakage.
                </p>
              </div>

              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#777777] flex items-center justify-between">
                <span>15 Behavioral Dimensions</span>
                <Fingerprint className="w-4 h-4 text-[#F2D35E]" strokeWidth={1.5} />
              </div>
            </div>

            {/* Card 2: Anomaly Detection */}
            <div className="p-8 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/40 transition-colors flex flex-col justify-between space-y-8 relative group">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-[#F2D35E] flex items-center justify-center font-mono text-xs text-[#F2D35E] bg-[#0A0A0A]">
                  02
                </div>
                <h3 className="text-2xl font-light text-white font-display">Anomaly Detection</h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed font-light">
                  Identify multivariate deviations from established baselines using Scikit-Learn Isolation Forest and non-parametric Median Absolute Deviation (MAD) Z-score bounds.
                </p>
              </div>

              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#777777] flex items-center justify-between">
                <span>100 Isolation Trees</span>
                <Activity className="w-4 h-4 text-[#F2D35E]" strokeWidth={1.5} />
              </div>
            </div>

            {/* Card 3: Forensic Correlation */}
            <div className="p-8 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/40 transition-colors flex flex-col justify-between space-y-8 relative group">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-[#F2D35E] flex items-center justify-center font-mono text-xs text-[#F2D35E] bg-[#0A0A0A]">
                  03
                </div>
                <h3 className="text-2xl font-light text-white font-display">Forensic Correlation</h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed font-light">
                  Connect relevant events and entities into multi-stage MITRE ATT&CK progression chains to support evidence-based investigations and exportable court-grade case dossiers.
                </p>
              </div>

              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#777777] flex items-center justify-between">
                <span>Grounded Attack Graph</span>
                <Layers className="w-4 h-4 text-[#F2D35E]" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION A2 — INTERACTIVE BEHAVIORAL DNA & ENTITY TELEMETRY GRAPH
      ========================================================================= */}
      <section id="telemetry-graph" className="py-24 border-b border-[#292929] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#292929] pb-8">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">
                Interactive Entity Telemetry
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
                Behavioral DNA <em className="italic text-[#F2D35E]">Correlation Graph</em>
              </h2>
            </div>
            <p className="text-[#A0A0A0] text-xs font-light max-w-md leading-relaxed">
              Explore interconnected enterprise entities reconstructed from 2,231 verified security events. Click on any node to inspect its continuous behavioral fingerprint, Shannon entropy, and flagged anomalies.
            </p>
          </div>

          {/* Interactive Graph & Telemetry Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* SVG Entity Graph (8 cols) */}
            <div className="lg:col-span-8 bg-[#0A0A0A] border border-[#292929] overflow-hidden relative h-[480px] p-4 select-none">
              {/* Subtle grid background */}
              <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:32px_32px]" />

              <svg className="w-full h-full" viewBox="0 0 820 440">
                {/* Connection lines */}
                {telemetryEdges.map((edge, idx) => {
                  const src = telemetryNodes.find(n => n.id === edge.from);
                  const tgt = telemetryNodes.find(n => n.id === edge.to);
                  if (!src || !tgt) return null;

                  const isConnectedToSelected = selectedEntityId === src.id || selectedEntityId === tgt.id;

                  return (
                    <g key={idx}>
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={isConnectedToSelected ? '#F2D35E' : '#292929'}
                        strokeWidth={isConnectedToSelected ? 2 : 1}
                        strokeDasharray={edge.label.includes('Exfiltration') || edge.label.includes('DNS') ? '4 3' : undefined}
                        opacity={isConnectedToSelected ? 1 : 0.6}
                      />
                      {/* Edge telemetry label in small mono */}
                      <text
                        x={(src.x + tgt.x) / 2}
                        y={(src.y + tgt.y) / 2 - 6}
                        textAnchor="middle"
                        className="text-[8px] font-mono fill-[#777777] pointer-events-none select-none"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {telemetryNodes.map(node => {
                  const isSelected = selectedEntityId === node.id;
                  const isCritical = node.risk === 'CRITICAL';
                  const isHigh = node.risk === 'HIGH';

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={() => setSelectedEntityId(node.id)}
                    >
                      {/* Outer pulse circle for flagged anomalies */}
                      {isCritical && (
                        <circle
                          r={isSelected ? 22 : 18}
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1"
                          opacity="0.4"
                          className="animate-ping"
                        />
                      )}

                      {/* Main node circle */}
                      <circle
                        r={isSelected ? 18 : 13}
                        fill={
                          isCritical ? '#260B0E' :
                          isSelected ? '#241E09' : '#141414'
                        }
                        stroke={
                          isCritical ? '#EF4444' :
                          isSelected ? '#F2D35E' :
                          isHigh ? '#F59E0B' : '#3E3E3E'
                        }
                        strokeWidth={isSelected ? 2.5 : 1.25}
                      />

                      {/* Inner glyph center */}
                      <circle
                        r={3.5}
                        fill={
                          isSelected ? '#F2D35E' :
                          isCritical ? '#EF4444' :
                          isHigh ? '#F59E0B' : '#A0A0A0'
                        }
                      />

                      {/* Node label */}
                      <text
                        y={isSelected ? 28 : 22}
                        textAnchor="middle"
                        className={`text-[9px] font-mono pointer-events-none select-none ${
                          isSelected ? 'fill-[#F2D35E] font-semibold' : 'fill-[#A0A0A0]'
                        }`}
                      >
                        {node.label}
                      </text>

                      {/* BDI Micro-badge */}
                      <text
                        y={-14}
                        textAnchor="middle"
                        className={`text-[8px] font-mono pointer-events-none select-none ${
                          isCritical ? 'fill-rose-400 font-bold' : 'fill-[#777777]'
                        }`}
                      >
                        BDI {node.bdi}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Graph Legend & Status */}
              <div className="absolute bottom-3 left-3 bg-[#111111]/90 backdrop-blur-sm border border-[#292929] px-3 py-1.5 text-[10px] font-mono flex items-center gap-4 text-[#A0A0A0]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full border border-rose-500 bg-rose-950 inline-block" /> Critical Deviation
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full border border-amber-500 bg-amber-950 inline-block" /> High Anomaly
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full border border-[#3E3E3E] bg-[#141414] inline-block" /> Baseline Entity
                </span>
              </div>
            </div>

            {/* Right Telemetry Inspector (4 cols) */}
            <div className="lg:col-span-4 bg-[#111111] border border-[#292929] p-6 space-y-5">
              <div className="border-b border-[#292929] pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#777777] uppercase tracking-wider">
                    Continuous Fingerprint Profile
                  </span>
                  <h3 className="text-base font-mono font-medium text-white mt-0.5 break-all">
                    {selectedNode.id}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono border ${
                  selectedNode.risk === 'CRITICAL' ? 'border-rose-500/50 text-rose-400 bg-rose-950/40' :
                  selectedNode.risk === 'HIGH' ? 'border-amber-500/40 text-amber-400 bg-amber-950/30' :
                  'border-[#292929] text-[#A0A0A0] bg-[#171717]'
                }`}>
                  {selectedNode.risk}
                </span>
              </div>

              {/* BDI Score & Classification */}
              <div className="p-4 bg-[#171717] border border-[#292929] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#777777]">Behavioral Deviation Index</span>
                  <span className={`text-base font-bold ${
                    selectedNode.bdi >= 80 ? 'text-[#EF4444]' :
                    selectedNode.bdi >= 60 ? 'text-[#F59E0B]' : 'text-[#F2D35E]'
                  }`}>
                    {selectedNode.bdi} / 100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#292929] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      selectedNode.bdi >= 80 ? 'bg-[#EF4444]' :
                      selectedNode.bdi >= 60 ? 'bg-[#F59E0B]' : 'bg-[#F2D35E]'
                    }`}
                    style={{ width: `${selectedNode.bdi}%` }}
                  />
                </div>
              </div>

              {/* Forensic Metric Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 bg-[#171717] border border-[#292929]">
                  <span className="text-[10px] text-[#777777] block">Entity Classification</span>
                  <span className="text-[#D8D8D8] font-medium mt-0.5 block">{selectedNode.type}</span>
                </div>
                <div className="p-3 bg-[#171717] border border-[#292929]">
                  <span className="text-[10px] text-[#777777] block">Observed Telemetry</span>
                  <span className="text-[#D8D8D8] font-medium mt-0.5 block">{selectedNode.events} Events</span>
                </div>
              </div>

              {/* Shannon Entropy & MITRE correlation */}
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-[#171717] border border-[#292929]">
                  <span className="text-[10px] text-[#777777] block">Shannon Diurnal Entropy H(X)</span>
                  <span className="text-[#F2D35E] font-medium mt-0.5 block">{selectedNode.entropy}</span>
                </div>
                <div className="p-3 bg-[#171717] border border-[#292929]">
                  <span className="text-[10px] text-[#777777] block">Correlated MITRE ATT&CK Tactic</span>
                  <span className="text-white font-medium mt-0.5 block">{selectedNode.tactic}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#A0A0A0] leading-relaxed font-light">
                {selectedNode.detail}
              </p>

              <button
                onClick={onEnterDemo}
                className="w-full py-2.5 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-colors font-semibold text-xs font-mono flex items-center justify-center gap-2"
              >
                <span>Launch Full Forensic Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECTION B — HOW IT WORKS & ENTERPRISE INFRASTRUCTURE
      ========================================================================= */}
      <section id="how-it-works" className="py-24 border-b border-[#292929] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#292929] pb-8">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Architecture Workflow</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
                How CyberDNA <em className="italic text-[#F2D35E]">Processes Telemetry</em>
              </h2>
            </div>
            <p className="text-[#A0A0A0] text-xs font-light max-w-md leading-relaxed">
              From raw network packet flows and authentication events to evidence-backed forensic incident dossiers.
            </p>
          </div>

          {/* 6 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              {
                step: '01',
                title: 'Security Telemetry',
                desc: 'Raw CSV, JSON, NetFlow, and event streams ingested with schema validation.'
              },
              {
                step: '02',
                title: 'Data Processing',
                desc: 'UTC normalization, diurnal hour synthesis, and socket imputation.'
              },
              {
                step: '03',
                title: 'Behavioral Baselines',
                desc: 'Parametric and non-parametric reference windows with zero temporal leakage.'
              },
              {
                step: '04',
                title: 'Anomaly Detection',
                desc: 'Multi-attribute Z-scores & Isolation Forest decision tree calibration.'
              },
              {
                step: '05',
                title: 'Evidence Correlation',
                desc: 'Reconstructing credential bursts, lateral movement, and data staging.'
              },
              {
                step: '06',
                title: 'Investigation',
                desc: 'Case management, verified facts log, hypotheses separation, and dossier export.'
              }
            ].map((st, i) => (
              <div key={i} className="p-5 bg-[#171717] border border-[#292929] hover:border-[#F2D35E]/50 transition-colors flex flex-col justify-between space-y-6">
                <div>
                  <span className="font-mono text-xs text-[#F2D35E] block mb-2">{st.step}</span>
                  <h4 className="text-sm font-medium text-white leading-snug">{st.title}</h4>
                  <p className="text-[11px] text-[#A0A0A0] font-light mt-2 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                <div className="w-6 h-[1px] bg-[#F2D35E]" />
              </div>
            ))}
          </div>

          {/* Enterprise Big Data Infrastructure Feature */}
          <div className="p-8 bg-[#0A0A0A] border border-[#292929] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Infrastructure Photograph (5 cols) */}
            <div className="lg:col-span-5 relative border border-[#292929] overflow-hidden bg-black shadow-xl">
              <img
                src="/assets/datacenter_telemetry.jpg"
                alt="High-Performance Enterprise Infrastructure and Telemetry Ingestion Corridor"
                className="w-full h-80 object-cover contrast-110 brightness-90 object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none opacity-60" />
              <div className="absolute bottom-4 left-4 text-white font-mono text-[10px]">
                <div className="text-[#F2D35E] flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-[#F2D35E]" />
                  <span>INGESTION CLUSTER // HIGH-THROUGHPUT ENGINE</span>
                </div>
                <div className="text-[#777777] mt-0.5">PARQUET COLUMNAR STORAGE • 2,231 EVENTS NORMALISED</div>
              </div>
            </div>

            {/* Right Architecture Specs (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">
                  Big Data Execution Engine
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-white">
                  Columnar Parquet Architecture with Zero Data Leakage
                </h3>
                <p className="text-[#A0A0A0] text-xs font-light leading-relaxed">
                  CyberDNA is engineered for high-volume enterprise telemetry. Event streams are parsed, validated, and persisted into chronological partitions—guaranteeing that baseline models never observe future events during training.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#111111] border border-[#292929]">
                  <span className="text-[#777777] block text-[10px]">Columnar Storage</span>
                  <span className="text-white font-medium mt-1 block">Apache Parquet</span>
                </div>
                <div className="p-3 bg-[#111111] border border-[#292929]">
                  <span className="text-[#777777] block text-[10px]">Baseline Partition</span>
                  <span className="text-[#F2D35E] font-medium mt-1 block">70% Historical</span>
                </div>
                <div className="p-3 bg-[#111111] border border-[#292929]">
                  <span className="text-[#777777] block text-[10px]">Evaluation Window</span>
                  <span className="text-[#10B981] font-medium mt-1 block">30% Real-Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SECTION C — DIGITAL FORENSICS, RESEARCH & METHODOLOGY
      ========================================================================= */}
      <section id="methodology" className="py-24 border-b border-[#292929] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Forensic Investigation Workspace Image */}
          <div className="lg:col-span-5 relative">
            <div className="border border-[#292929] overflow-hidden bg-black shadow-xl">
              <img
                src="/assets/forensics_investigation.jpg"
                alt="Digital Forensics Investigation Workspace with timeline correlation and evidence review"
                className="w-full h-[520px] object-cover contrast-110 brightness-95 object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none opacity-75" />
              <div className="absolute bottom-6 left-6 text-white font-mono text-[11px]">
                <div className="text-[#F2D35E] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#F2D35E]" />
                  <span>FIG. 2 // DIGITAL FORENSICS INCIDENT DOSSIER</span>
                </div>
                <div className="text-[#777777] mt-0.5">CHRONOLOGICAL EVIDENCE LOGS • MITRE ATT&CK ALIGNMENT</div>
              </div>
            </div>
          </div>

          {/* Right Column: Research Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Scientific Methodology</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
                Explainable Findings <em className="italic text-[#F2D35E]">Rooted in Telemetry</em>
              </h2>
              <p className="text-[#A0A0A0] text-sm font-light leading-relaxed">
                Rather than treating machine learning as an uninterpretable "black box," CyberDNA guarantees that every flagged anomaly can be deconstructed into its underlying statistical contributors.
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#A0A0A0] leading-relaxed font-light">
              <div className="p-4 bg-[#111111] border border-[#292929] space-y-1">
                <span className="font-mono text-[#F2D35E] font-medium block">1. Mathematical Baseline Partitioning</span>
                <p>
                  To eliminate temporal data leakage, reference observation periods are strictly partitioned from evaluation windows (70% historical baseline, 30% current evaluation).
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#292929] space-y-1">
                <span className="font-mono text-[#F2D35E] font-medium block">2. Shannon Hourly Entropy Formulation</span>
                <p>
                  Calculates diurnal dispersion: <code className="font-mono text-[#D8D8D8]">H(Hour) = -&Sigma; [ p(h) &middot; log&sub2;(p(h)) ]</code>. Deviations flag stealthy off-hours activity even when individual event volumes appear nominal.
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#292929] space-y-1">
                <span className="font-mono text-[#F2D35E] font-medium block">3. Minimum History Safeguard</span>
                <p>
                  When historical event counts are sparse (&lt; 10 records), the platform formally marks the entity as <code className="font-mono text-[#D8D8D8]">INSUFFICIENT_HISTORY</code> and halts baseline construction to prevent false alarms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SECTION D — EVIDENCE, NOT ASSUMPTIONS (Epistemic Hygiene)
      ========================================================================= */}
      <section id="evidence" className="py-24 border-b border-[#292929] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Institutional Standard</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
              Evidence, <em className="italic text-[#F2D35E]">Not Assumptions</em>
            </h2>
            <p className="text-[#A0A0A0] text-sm font-light leading-relaxed">
              <strong>A statistical anomaly alone never proves malicious intent.</strong> CyberDNA maintains rigorous epistemic hygiene by separating verified observations from investigative theories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Category 1 */}
            <div className="p-6 bg-[#171717] border border-[#292929] space-y-3">
              <div className="flex items-center gap-2 text-[#10B981] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Observed Facts</span>
              </div>
              <p className="text-[#A0A0A0] font-light leading-relaxed text-[11px]">
                Immutable telemetry: verified source/destination sockets, authenticated Kerberos tickets, process hashes, and byte volumes recorded in SIEM logs.
              </p>
            </div>

            {/* Category 2 */}
            <div className="p-6 bg-[#171717] border border-[#292929] space-y-3">
              <div className="flex items-center gap-2 text-[#F2D35E] font-medium">
                <Activity className="w-4 h-4 text-[#F2D35E]" />
                <span>Statistical Anomalies</span>
              </div>
              <p className="text-[#A0A0A0] font-light leading-relaxed text-[11px]">
                Mathematical deviations from established baseline distributions: Z-score &gt; 2.5&sigma; shifts in failure rate, transfer velocity, or entropy.
              </p>
            </div>

            {/* Category 3 */}
            <div className="p-6 bg-[#171717] border border-[#292929] space-y-3">
              <div className="flex items-center gap-2 text-[#D8D8D8] font-medium">
                <Layers className="w-4 h-4 text-[#D8D8D8]" />
                <span>Inferred Relationships</span>
              </div>
              <p className="text-[#A0A0A0] font-light leading-relaxed text-[11px]">
                Temporally correlated multi-stage interactions: credential bursts preceding lateral RDP sessions within a 4-hour temporal envelope.
              </p>
            </div>

            {/* Category 4 */}
            <div className="p-6 bg-[#171717] border border-[#292929] space-y-3">
              <div className="flex items-center gap-2 text-[#F59E0B] font-medium">
                <Shield className="w-4 h-4 text-[#F59E0B]" />
                <span>Investigative Hypotheses</span>
              </div>
              <p className="text-[#A0A0A0] font-light leading-relaxed text-[11px]">
                Analyst theories regarding adversary objectives, staging tools, or external drop boxes pending host memory and disk forensic confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. SECTION E — CLOSING CALL TO ACTION
      ========================================================================= */}
      <section className="py-24 border-b border-[#292929] bg-[#0A0A0A] text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Ready for Inspection</span>
          <h2 className="font-display text-4xl sm:text-6xl font-light tracking-tight text-white">
            Explore the CyberDNA <em className="italic text-[#F2D35E]">Research Environment</em>
          </h2>
          <p className="text-[#A0A0A0] text-base font-light max-w-xl mx-auto leading-relaxed">
            Access the pre-populated forensic dashboard featuring 2,231 verified security events, interactive attack graphs, and evidence-grounded case dossiers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-8 py-4 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-colors font-medium text-sm tracking-tight flex items-center justify-center gap-3 group shadow-[0_0_24px_rgba(242,211,94,0.18)]"
            >
              <span>Enter Demo Environment</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto px-8 py-4 bg-[#171717] text-[#D8D8D8] border border-[#292929] hover:bg-[#222222] transition-colors font-normal text-sm tracking-tight"
            >
              Sign In with Account
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#777777] pt-4">
            Instant Demo Access • No Registration Required • Synthetic Research Corpus
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FOOTER
      ========================================================================= */}
      <footer className="bg-[#0A0A0A] py-16 border-t border-[#292929] text-xs text-[#A0A0A0]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <CyberDNALogo size="md" />
              <p className="text-[11px] text-[#777777] leading-relaxed font-light">
                Behavioral Fingerprinting & Digital Forensics Platform. Built for academic research.
              </p>
            </div>

            <div>
              <div className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Platform</div>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#platform" className="hover:text-white transition-colors">Behavioral DNA</a></li>
                <li><a href="#telemetry-graph" className="hover:text-white transition-colors">Entity Correlation</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Forensics Pipeline</a></li>
                <li><button onClick={onEnterDemo} className="hover:text-white transition-colors">Demo Environment</button></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Research</div>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Parquet Ingestion</a></li>
                <li><a href="#methodology" className="hover:text-white transition-colors">Shannon Entropy</a></li>
                <li><a href="#evidence" className="hover:text-white transition-colors">Evidence Standards</a></li>
                <li><a href="#methodology" className="hover:text-white transition-colors">Isolation Forest</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Academic Project</div>
              <p className="text-[11px] text-[#777777] leading-relaxed font-light">
                Master's in Cybersecurity research. Uses verified synthetic telemetry partitions. Not intended as commercial enterprise security software.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#292929] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777777] font-mono gap-4">
            <div>&copy; 2026 CyberDNA. Master's in Cybersecurity Research.</div>
            <div className="flex items-center gap-6">
              <button onClick={onNavigateToLogin} className="hover:text-white transition-colors">Sign In</button>
              <button onClick={onEnterDemo} className="hover:text-white transition-colors">Instant Demo</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
