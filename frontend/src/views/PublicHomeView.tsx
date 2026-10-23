import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ShieldAlert,
  Clock,
  FileText,
  HardDrive,
  Users,
  Compass,
  RotateCcw
} from 'lucide-react';
import { CyberDNALogo } from '../components/CyberDNALogo';
import { CinematicLoader } from '../components/CinematicLoader';

interface PublicHomeViewProps {
  onNavigateToLogin: () => void;
  onEnterDemo: () => void;
}

export const PublicHomeView: React.FC<PublicHomeViewProps> = ({
  onNavigateToLogin,
  onEnterDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if intro has already been viewed in this browser session
  const [showLoader, setShowLoader] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hasSeenIntro = sessionStorage.getItem('cyberdna_intro_shown') === 'true';
    return !hasSeenIntro;
  });

  // Controls hero entrance animation once loader reaches dissolve stage
  const [heroRevealed, setHeroRevealed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('cyberdna_intro_shown') === 'true';
  });

  // Active tab in Forensic Workspace section
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'profile' | 'timeline' | 'graph' | 'dossier'>('profile');

  // Interactive Behavioral DNA showcase selected entity in Section D
  const [selectedEntityId, setSelectedEntityId] = useState<string>('user:elena.rostova');

  useEffect(() => {
    // Scroll reveal observer for below-the-fold sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .image-reveal-frame, .accent-line-reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem('cyberdna_intro_shown', 'true');
    setHeroRevealed(true);
    // Allow the 700ms dissolve transition to complete before removing loader from DOM
    setTimeout(() => {
      setShowLoader(false);
    }, 750);
  }, []);

  const handleReplayIntro = () => {
    sessionStorage.removeItem('cyberdna_intro_shown');
    setHeroRevealed(false);
    setShowLoader(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#D8D8D8] font-sans selection:bg-[#F2D35E] selection:text-[#0A0A0A] relative">
      {/* =========================================================================
          CINEMATIC 12 -> 46 -> 100 LOADER
          Full-screen overlay that smoothly dissolves into the homepage
      ========================================================================= */}
      {showLoader && (
        <CinematicLoader onComplete={handleLoaderComplete} />
      )}

      {/* =========================================================================
          1. HEADER (NexBank-Inspired Minimalist Dark Editorial Header)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#292929]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* CyberDNA Logo in signature yellow */}
          <a href="#" className="flex items-center gap-3 group">
            <CyberDNALogo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider text-[#A0A0A0]">
            <a href="#problem" className="hover:text-white transition-colors">Platform</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#patterns" className="hover:text-white transition-colors">Activity Patterns</a>
            <a href="#workspace" className="hover:text-white transition-colors">Investigations</a>
            <a href="#methodology" className="hover:text-white transition-colors">PySpark Pipeline</a>
            <a href="#evidence" className="hover:text-white transition-colors">Security Rules</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
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
            className="lg:hidden p-2 text-[#D8D8D8] hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#111111] border-b border-[#292929] px-6 py-6 space-y-4 text-sm font-mono">
            <a
              href="#problem"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Platform Overview
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              How It Works
            </a>
            <a
              href="#patterns"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Behavioral Intelligence
            </a>
            <a
              href="#workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Forensics Workspace
            </a>
            <a
              href="#methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#A0A0A0] hover:text-white py-1"
            >
              Research & Methodology
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
                Launch Analyst Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION — EDITORIAL TWO-COLUMN HERO
          Balanced composition: Dominant left headline + Cinematic right SOC image
      ========================================================================= */}
      <section className="relative min-h-[calc(100vh-5rem)] border-b border-[#292929] flex flex-col justify-between overflow-hidden bg-[#0A0A0A]">
        {/* Subtle coordinate stamp */}
        <div className={`absolute top-6 right-8 z-10 hidden xl:block text-right font-mono text-[10px] text-[#777777] tracking-wider select-none transition-opacity duration-1000 ${heroRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <div>EMPLOYEE ACTIVITY MONITORING // APEX GLOBAL</div>
          <div className="text-[#F2D35E] mt-0.5 font-medium">PYSPARK PARQUET ENGINE • 2,173 PROCESSED EVENTS</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 lg:py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center flex-1">
          {/* Left Column: Expressive Dominant Editorial Headline & Copy (7 cols) */}
          <div className={`lg:col-span-7 space-y-6 sm:space-y-8 z-10 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Outlined Eyebrow Label */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#111111] border border-[#292929] text-[10px] md:text-[11px] font-mono tracking-widest uppercase text-[#A0A0A0]">
              <span className="w-1.5 h-1.5 bg-[#F2D35E] inline-block shadow-[0_0_8px_#F2D35E] animate-pulse" />
              <span>EMPLOYEE ACTIVITY & SECURITY ANALYSIS PLATFORM</span>
            </div>

            {/* Main Headline: 76-100px on desktop with responsive scaling */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.8rem] xl:text-[5.5rem] 2xl:text-[6.2rem] font-light tracking-tight leading-[1.04] text-white">
              <span className="font-sans font-normal text-[#EAEAEA] block">
                Understand behavior.
              </span>
              <span className="font-display italic font-normal text-[#F2D35E] block mt-1 sm:mt-2">
                Uncover what changed.
              </span>
            </h1>

            {/* Exact Required Supporting Copy */}
            <p className="text-base sm:text-lg text-[#A0A0A0] font-light max-w-xl leading-relaxed">
              CyberDNA establishes behavioral baselines across employees, devices, and corporate systems. It connects unusual activity to verifiable evidence, helping investigators understand what happened, when it happened, and what deserves closer examination.
            </p>

            {/* Two CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onEnterDemo}
                className="px-8 py-4 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-all duration-300 font-medium text-sm tracking-tight flex items-center justify-center gap-3 group shadow-[0_0_24px_rgba(242,211,94,0.18)] cursor-pointer"
              >
                <span>Launch Analyst Demo</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href="#problem"
                className="px-8 py-4 bg-[#111111] text-[#D8D8D8] border border-[#292929] hover:bg-[#171717] hover:border-[#F2D35E]/50 transition-colors duration-300 font-normal text-sm text-center tracking-tight flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore the Platform</span>
              </a>
            </div>

            {/* Understated Research Indicator */}
            <div className="pt-4 border-t border-[#292929]/70 max-w-xl">
              <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[#777777] uppercase flex items-center gap-2">
                <span className="w-1 h-1 bg-[#F2D35E] rounded-full inline-block" />
                <span>EMPLOYEE ACTIVITY PATTERNS / UNUSUAL ACTIVITY DETECTION / SECURITY INVESTIGATIONS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Cinematic Near-Monochrome Image Frame (5 cols) */}
          <div className={`lg:col-span-5 relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${heroRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <div className="image-reveal-frame border border-[#292929] shadow-2xl relative bg-[#111111] overflow-hidden group">
              {/* Security Operations Center Photography */}
              <img
                src="/assets/hero_soc.jpg"
                alt="CyberDNA Enterprise Security Operations Center with real-time employee activity telemetry"
                className="image-reveal-img w-full h-[460px] sm:h-[500px] lg:h-[530px] object-cover object-center"
              />

              {/* Restrained dark overlay to integrate into cinematic theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent pointer-events-none opacity-85" />

              {/* Restrained Yellow Outline Number in Background ("01") */}
              <div className="absolute top-4 right-6 text-7xl sm:text-8xl font-display text-outline-yellow select-none pointer-events-none opacity-25">
                01
              </div>

              {/* Captions and Markers */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-10 flex items-end justify-between border-t border-white/10 pt-4">
                <div>
                  <div className="font-mono text-[10px] sm:text-[11px] text-[#F2D35E] uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
                    <span>APEX GLOBAL / SECURITY OPERATIONS</span>
                  </div>
                  <div className="font-sans text-xs sm:text-sm font-light text-[#D8D8D8] mt-1">
                    Continuous Behavioral Baseline Monitoring
                  </div>
                </div>

                <div className="font-mono text-[10px] sm:text-xs text-[#777777] tracking-wider">
                  REF. 01 / 05
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="border-t border-[#292929] bg-[#111111] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] font-mono gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#A0A0A0]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block shadow-[0_0_8px_#10B981]" />
              Analytical Engine Online • Local PySpark Core
            </span>
            <span className="hidden md:inline text-[#333333]">|</span>
            <span className="hidden md:inline">Ground-Truth Evidence Separation (Facts vs Hypotheses)</span>
          </div>

          <div className="text-[#A0A0A0]">
            Fictional Corporate Organization: Apex Global Technologies
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION A — THE PROBLEM
          "Insider activity rarely looks suspicious at first."
      ========================================================================= */}
      <section id="problem" className="py-24 border-b border-[#292929] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4 scroll-reveal">
            <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">The Insider Problem</span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
              Insider activity rarely looks <em className="font-display italic text-[#F2D35E]">suspicious at first.</em>
            </h2>
            <p className="text-[#A0A0A0] text-base sm:text-lg font-light leading-relaxed">
              An employee accessing files, authenticating over VPN, or uploading project reports looks completely legitimate in isolated security logs. But when an employee on resignation notice conducts an off-hours session, queries unauthorized financial databases, inserts a personal USB drive, and exfiltrates 850 MB to external cloud storage at 3:00 AM, the composite pattern reveals the true deviation.
            </p>
          </div>

          {/* 3 Comparative Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/40 transition-colors flex flex-col justify-between space-y-6 scroll-reveal delay-100">
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#777777] block uppercase">01 / The Blindspot</span>
                <h3 className="text-xl font-medium text-white">Isolated Events Look Normal</h3>
                <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed font-light">
                  Traditional perimeter defenses and signature-based SIEM rules focus on malware hashes and unauthorized IP blocks. They fail when legitimate users employ authorized credentials for unauthorized purposes.
                </p>
              </div>
              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#777777] flex items-center justify-between">
                <span>Perimeter Insufficiency</span>
                <Shield className="w-4 h-4 text-[#A0A0A0]" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/40 transition-colors flex flex-col justify-between space-y-6 scroll-reveal delay-200">
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#F2D35E] block uppercase">02 / The Solution</span>
                <h3 className="text-xl font-medium text-white">Composite Behavioral Change</h3>
                <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed font-light">
                  CyberDNA establishes personalized behavioral profiles across diurnal working hours, file velocity, and removable media habits—measuring mathematical divergence from an employee's historical baseline.
                </p>
              </div>
              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#F2D35E] flex items-center justify-between">
                <span>Diurnal Entropy & Z-Scores</span>
                <Activity className="w-4 h-4 text-[#F2D35E]" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/40 transition-colors flex flex-col justify-between space-y-6 scroll-reveal delay-300">
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#10B981] block uppercase">03 / The Standard</span>
                <h3 className="text-xl font-medium text-white">Evidence-Grounded Triage</h3>
                <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed font-light">
                  An anomaly score is an invitation to investigate, not an automated accusation. CyberDNA strictly isolates verified telemetry proof from investigative hypotheses, providing analysts with court-grade dossiers.
                </p>
              </div>
              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#10B981] flex items-center justify-between">
                <span>Epistemic Integrity</span>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION B — HOW CYBERDNA WORKS
          Four connected stages: Observe -> Baseline -> Correlate -> Evidence
      ========================================================================= */}
      <section id="how-it-works" className="py-24 border-b border-[#292929] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#292929] pb-8 scroll-reveal">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Architecture Workflow</span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
                How CyberDNA <em className="font-display italic text-[#F2D35E]">Processes Activity</em>
              </h2>
            </div>
            <p className="text-[#A0A0A0] text-xs sm:text-sm font-light max-w-md leading-relaxed">
              A transparent four-stage pipeline moving from raw system activity records to correlation-backed digital forensic case dossiers.
            </p>
          </div>

          {/* 4 Connected Stages with Thin Lines */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Observe Activity',
                tag: 'ACTIVITY INGESTION',
                desc: 'Ingests normalized authentication events, file access logs, removable USB device records, web proxy transactions, and communication metadata.',
                metric: '2,173 Events Normalized'
              },
              {
                step: '02',
                title: 'Establish Baselines',
                tag: 'ACTIVITY BASELINES',
                desc: 'Calculates 24-hour daily activity distributions, access frequency means, and working hour baselines for each employee.',
                metric: '10 Employee Profiles'
              },
              {
                step: '03',
                title: 'Correlate Events',
                tag: 'RELATED ACTIVITY',
                desc: 'Connects related activity records across devices and observation windows to provide full context on unusual behavior.',
                metric: '3 Explainable Rules'
              },
              {
                step: '04',
                title: 'Assemble Evidence',
                tag: 'INVESTIGATION DETAILS',
                desc: 'Constructs chronological timelines and case files that clearly show observed facts for human security review.',
                metric: 'Reviewer Export'
              }
            ].map((st, i) => (
              <div
                key={i}
                className="p-6 bg-[#171717] border border-[#292929] hover:border-[#F2D35E]/60 transition-colors flex flex-col justify-between space-y-6 group scroll-reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#F2D35E] font-medium tracking-wider">{st.step}</span>
                    <span className="text-[10px] font-mono text-[#777777] uppercase tracking-wider">{st.tag}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white">{st.title}</h3>
                  <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#292929] flex items-center justify-between text-[11px] font-mono text-[#777777]">
                  <span>{st.metric}</span>
                  <div className="w-5 h-[1px] bg-[#F2D35E] transition-all group-hover:w-8" />
                </div>
              </div>
            ))}
          </div>

          {/* Infrastructure Callout with Datacenter Image */}
          <div className="p-8 bg-[#0A0A0A] border border-[#292929] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-reveal">
            <div className="lg:col-span-5 image-reveal-frame border border-[#292929]">
              <img
                src="/assets/datacenter_telemetry.jpg"
                alt="High-Throughput Big Data Telemetry Ingestion Cluster"
                className="image-reveal-img w-full h-64 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none opacity-60" />
              <div className="absolute bottom-4 left-4 text-white font-mono text-[10px]">
                <div className="text-[#F2D35E] flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-[#F2D35E]" />
                  <span>APACHE PYSPARK ENGINE // LOCAL[*] EXECUTION</span>
                </div>
                <div className="text-[#777777] mt-0.5">SNAPPY PARQUET STORAGE • SCHEMA ENFORCED</div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#F2D35E] uppercase">Big Data Execution Architecture</span>
              <h3 className="text-2xl font-light text-white">
                Genuine Columnar Processing with Zero Temporal Leakage
              </h3>
              <p className="text-xs sm:text-sm text-[#A0A0A0] font-light leading-relaxed">
                CyberDNA is designed around genuine distributed Big Data concepts. The analytics engine partitions activity logs chronologically (70% historical baseline reference, 30% evaluation window), guaranteeing that baseline calculations never observe future evaluation records.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-xs">
                <div className="p-3 bg-[#111111] border border-[#292929]">
                  <span className="text-[10px] text-[#777777] block">Engine Mode</span>
                  <span className="text-white font-medium mt-0.5 block">PySpark / PyArrow</span>
                </div>
                <div className="p-3 bg-[#111111] border border-[#292929]">
                  <span className="text-[10px] text-[#777777] block">Storage Format</span>
                  <span className="text-[#F2D35E] font-medium mt-0.5 block">Columnar Parquet</span>
                </div>
                <div className="p-3 bg-[#111111] border border-[#292929]">
                  <span className="text-[10px] text-[#777777] block">Temporal Split</span>
                  <span className="text-[#10B981] font-medium mt-0.5 block">70 / 30 Partition</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECTION C — BEHAVIORAL INTELLIGENCE
          Supported Analytical Patterns & Explainable Findings
      ========================================================================= */}
      <section id="patterns" className="py-24 border-b border-[#292929] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4 scroll-reveal">
            <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Behavioral Intelligence</span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
              Supported <em className="font-display italic text-[#F2D35E]">Analytical Patterns</em>
            </h2>
            <p className="text-[#A0A0A0] text-sm sm:text-base font-light leading-relaxed">
              CyberDNA detects multi-vector anomalies supported by verified event fields. Every finding records the specific baseline comparison, observed deviation, and supporting event records:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pattern 1 */}
            <div className="p-6 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/50 transition-colors flex flex-col justify-between space-y-6 scroll-reveal delay-100">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-[#292929] bg-[#171717] flex items-center justify-center text-[#F2D35E]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#F2D35E] uppercase tracking-wider block">Authentication Vector</span>
                  <h3 className="text-lg font-medium text-white mt-1">Unusual Login Hours</h3>
                </div>
                <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                  Identifies off-hours access significantly departing from an employee's diurnal distribution (e.g. 03:14 AM session vs 09:00 AM baseline, &Delta; = 6.2h, Z = +3.8&sigma;).
                </p>
              </div>

              <div className="p-3 bg-[#171717] border border-[#292929] font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-[#777777]">
                  <span>Historical Peak</span>
                  <span className="text-white">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Observed Event</span>
                  <span className="text-[#EF4444]">03:14 AM</span>
                </div>
              </div>
            </div>

            {/* Pattern 2 */}
            <div className="p-6 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/50 transition-colors flex flex-col justify-between space-y-6 scroll-reveal delay-200">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-[#292929] bg-[#171717] flex items-center justify-center text-[#F2D35E]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#F2D35E] uppercase tracking-wider block">File Activity Vector</span>
                  <h3 className="text-lg font-medium text-white mt-1">High-Volume File Reads</h3>
                </div>
                <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                  Measures abnormal bursts of read or copy operations across sensitive repositories (e.g. 482 confidential financial spreadsheets accessed vs 18 historical average).
                </p>
              </div>

              <div className="p-3 bg-[#171717] border border-[#292929] font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-[#777777]">
                  <span>Daily Baseline</span>
                  <span className="text-white">18.4 Files</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Observed Burst</span>
                  <span className="text-[#EF4444]">482 Files</span>
                </div>
              </div>
            </div>

            {/* Pattern 3 */}
            <div className="p-6 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/50 transition-colors flex flex-col justify-between space-y-6 scroll-reveal delay-300">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-[#292929] bg-[#171717] flex items-center justify-center text-[#F2D35E]">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#F2D35E] uppercase tracking-wider block">Removable Device Vector</span>
                  <h3 className="text-lg font-medium text-white mt-1">Changes in Device Usage</h3>
                </div>
                <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                  Tracks novel hardware insertion on corporate workstations (e.g. unapproved SanDisk USB VID:0781 PID:5583 inserted by an employee with no historical removable media use).
                </p>
              </div>

              <div className="p-3 bg-[#171717] border border-[#292929] font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-[#777777]">
                  <span>Device Authorization</span>
                  <span className="text-white">Corporate-Only</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Removable Media</span>
                  <span className="text-[#EF4444]">Unauthorized</span>
                </div>
              </div>
            </div>

            {/* Pattern 4 */}
            <div className="p-6 bg-[#111111] border border-[#292929] hover:border-[#F2D35E]/50 transition-colors flex flex-col justify-between space-y-6 scroll-reveal delay-400">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-[#292929] bg-[#171717] flex items-center justify-center text-[#F2D35E]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#F2D35E] uppercase tracking-wider block">Sequence Correlation</span>
                  <h3 className="text-lg font-medium text-white mt-1">Multi-System Chain</h3>
                </div>
                <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                  Correlates events across temporal envelopes (e.g. privilege escalation on domain controller followed by lateral SMB hop and 279 MB archive egress within 3 hours).
                </p>
              </div>

              <div className="p-3 bg-[#171717] border border-[#292929] font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-[#777777]">
                  <span>Temporal Envelope</span>
                  <span className="text-white">3.5 Hours</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Multi-Host Staging</span>
                  <span className="text-[#EF4444]">3 Systems</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center font-mono text-xs text-[#777777] border-t border-[#292929] pt-6">
            ILLUSTRATIVE ANALYTICAL PATTERNS • COMPUTED FROM NORMALIZED EVENT TELEMETRY
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SECTION D — FORENSIC WORKSPACE
          Connecting Employee Profiles, Timelines, Graphs & Investigations
      ========================================================================= */}
      <section id="workspace" className="py-24 border-b border-[#292929] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#292929] pb-8 scroll-reveal">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Integrated Environment</span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
                The Digital Forensics <em className="font-display italic text-[#F2D35E]">Workspace</em>
              </h2>
            </div>
            <p className="text-[#A0A0A0] text-xs sm:text-sm font-light max-w-md leading-relaxed">
              Explore how employee behavioral profiles, activity timelines, entity relationships, and digital forensic investigations seamlessly interlock.
            </p>
          </div>

          {/* Interactive Workspace Showcase Tabs */}
          <div className="space-y-6 scroll-reveal">
            {/* Tab Selector */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#292929] pb-3 text-xs font-mono">
              {[
                { id: 'profile', label: 'Employee Behavioral Profile' },
                { id: 'timeline', label: 'Chronological Timeline' },
                { id: 'graph', label: 'Organizational Activity Graph' },
                { id: 'dossier', label: 'Case Dossier & Evidence' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkspaceTab(tab.id as any)}
                  className={`px-4 py-2 border transition-all cursor-pointer ${
                    activeWorkspaceTab === tab.id
                      ? 'bg-[#F2D35E] text-[#0A0A0A] border-[#F2D35E] font-medium'
                      : 'bg-[#171717] text-[#A0A0A0] border-[#292929] hover:text-white hover:border-[#444444]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Employee Behavioral Profile Showcase */}
            {activeWorkspaceTab === 'profile' && (
              <div className="p-8 bg-[#0A0A0A] border border-[#292929] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#171717] border border-[#292929] text-[10px] font-mono text-[#F2D35E]">
                    <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-ping" />
                    <span>FLAGGED INVESTIGATION PROFILE</span>
                  </div>
                  <h3 className="text-2xl font-medium text-white">Elena Rostova — VP Finance</h3>
                  <p className="text-xs sm:text-sm text-[#A0A0A0] font-light leading-relaxed">
                    Examines 24-hour diurnal activity distributions against the employee's historical baseline. Flagged for abnormal off-hours access and volume spikes during a 30-day notice period.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 bg-[#111111] border border-[#292929]">
                      <span className="text-[10px] text-[#777777] block">Employment Status</span>
                      <span className="text-[#F59E0B] font-medium mt-0.5 block">Notice Period (Resignation)</span>
                    </div>
                    <div className="p-3 bg-[#111111] border border-[#292929]">
                      <span className="text-[10px] text-[#777777] block">Anomaly Score</span>
                      <span className="text-[#EF4444] font-medium mt-0.5 block">84 / 100 (High Deviation)</span>
                    </div>
                  </div>
                  <button
                    onClick={onEnterDemo}
                    className="pt-2 text-xs font-mono text-[#F2D35E] hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Inspect Elena Rostova in Live Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Profile Visual Mock */}
                <div className="lg:col-span-7 bg-[#111111] border border-[#292929] p-6 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-[#292929] pb-3">
                    <span className="text-[#777777]">Diurnal Activity Distribution (24 Hours)</span>
                    <span className="text-[#10B981]">Baseline vs Observed Window</span>
                  </div>
                  {/* Simplified diurnal chart representation */}
                  <div className="h-40 flex items-end justify-between gap-1 pt-6 px-2">
                    {[1, 2, 2, 18, 2, 1, 3, 14, 25, 42, 60, 58, 45, 62, 54, 48, 38, 24, 12, 4, 3, 2, 1, 1].map((val, h) => {
                      const isAnomaly = h === 3; // 3 AM anomaly
                      return (
                        <div key={h} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t-sm transition-all ${
                              isAnomaly ? 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]' : 'bg-[#292929] hover:bg-[#F2D35E]/60'
                            }`}
                            style={{ height: `${Math.min(100, Math.max(8, isAnomaly ? 85 : val * 1.5))}%` }}
                          />
                          {h % 4 === 0 && (
                            <span className="text-[9px] text-[#555555]">{h}h</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#777777] border-t border-[#292929] pt-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#292929] inline-block" /> Historical Mean (09:00 - 18:00)
                    </span>
                    <span className="flex items-center gap-1.5 text-[#EF4444]">
                      <span className="w-2 h-2 bg-[#EF4444] inline-block" /> 03:00 AM VPN Session (Z = +3.8&sigma;)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Chronological Timeline Showcase */}
            {activeWorkspaceTab === 'timeline' && (
              <div className="p-8 bg-[#0A0A0A] border border-[#292929] space-y-6 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-[#292929] pb-4">
                  <div>
                    <h3 className="text-base font-sans font-medium text-white">Chronological Event Timeline</h3>
                    <p className="text-xs text-[#777777] mt-0.5">Correlating multi-vector security events across time</p>
                  </div>
                  <span className="text-[11px] text-[#F2D35E] border border-[#F2D35E]/40 px-2.5 py-1 bg-[#111111]">
                    CASE INV-2026-001
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { time: '2026-04-12 03:14:22 UTC', entity: 'Elena Rostova', type: 'LOGON_OFFHOURS', desc: 'Off-hours VPN authentication from residential IP 198.51.100.23', tag: 'ANOMALY' },
                    { time: '2026-04-12 03:18:05 UTC', entity: 'WS-FIN-01', type: 'SMB_QUERY', desc: 'Lateral Kerberos query to srv:SQL01.prod.local database staging directory', tag: 'INFERRED' },
                    { time: '2026-04-12 03:22:40 UTC', entity: 'WS-FIN-01', type: 'FILE_ACCESS', desc: 'Batch read of 482 confidential Q1 financial audit worksheets (Z = +3.84)', tag: 'ANOMALY' },
                    { time: '2026-04-12 03:29:12 UTC', entity: 'WS-FIN-01', type: 'CLOUD_UPLOAD', desc: '279 MB encrypted payload dispatched to external bucket storage-cloud-sync.net', tag: 'CRITICAL' }
                  ].map((ev, idx) => (
                    <div key={idx} className="p-4 bg-[#111111] border border-[#292929] flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-[#F2D35E]">{idx + 1}.</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{ev.entity}</span>
                            <span className="text-[#555555]">/</span>
                            <span className="text-[#A0A0A0]">{ev.type}</span>
                          </div>
                          <p className="text-[#777777] text-[11px] mt-1 font-sans">{ev.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-[#555555] shrink-0">
                        <span>{ev.time}</span>
                        <span className={`px-2 py-0.5 border ${
                          ev.tag === 'CRITICAL' ? 'border-rose-500/50 text-rose-400 bg-rose-950/30' :
                          ev.tag === 'ANOMALY' ? 'border-amber-500/40 text-amber-400 bg-amber-950/20' :
                          'border-[#333333] text-[#A0A0A0]'
                        }`}>
                          {ev.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Organizational Activity Graph Showcase */}
            {activeWorkspaceTab === 'graph' && (
              <div className="p-8 bg-[#0A0A0A] border border-[#292929] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-4">
                  <div>
                    <h3 className="text-base font-sans font-medium text-white">Organizational Activity Graph</h3>
                    <p className="text-xs text-[#777777] mt-0.5">120 verified entity nodes and 2,158 evidence-supported relationship edges</p>
                  </div>
                  <button
                    onClick={onEnterDemo}
                    className="px-4 py-2 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] text-xs font-mono font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <span>Open Full Interactive Graph</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="h-64 bg-[#111111] border border-[#292929] relative overflow-hidden flex items-center justify-center p-6 text-center select-none">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F2D35E_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 max-w-md space-y-3">
                    <Network className="w-10 h-10 text-[#F2D35E] mx-auto opacity-80" />
                    <h4 className="text-white text-sm font-medium">Grounded Entity Relationships</h4>
                    <p className="text-xs text-[#A0A0A0] font-light">
                      Nodes represent employees, corporate devices, servers, IP sockets, and external domains. Edges reflect actual SIEM event records—never fabricated connections.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Case Dossier & Evidence Showcase */}
            {activeWorkspaceTab === 'dossier' && (
              <div className="p-8 bg-[#0A0A0A] border border-[#292929] space-y-6 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-[#292929] pb-4">
                  <div>
                    <h3 className="text-base font-sans font-medium text-white">Digital Forensics Case Dossier</h3>
                    <p className="text-xs text-[#777777] mt-0.5">Formal separation of verified observations from investigative hypotheses</p>
                  </div>
                  <span className="text-[#10B981] text-[11px] border border-[#10B981]/40 px-2 py-0.5 bg-[#111111]">
                    STATUS: ACTIVE_INVESTIGATION
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#111111] border border-[#292929] space-y-2">
                    <span className="text-[#10B981] font-semibold block uppercase text-[10px]">1. Verified Facts</span>
                    <p className="text-[#A0A0A0] font-sans text-[11px] leading-relaxed">
                      VPN connection authenticated via valid credentials at 03:14 UTC. 482 files read. 279 MB outbound TCP socket to storage-cloud-sync.net recorded in firewall log.
                    </p>
                  </div>
                  <div className="p-4 bg-[#111111] border border-[#292929] space-y-2">
                    <span className="text-[#F2D35E] font-semibold block uppercase text-[10px]">2. Statistical Deviations</span>
                    <p className="text-[#A0A0A0] font-sans text-[11px] leading-relaxed">
                      Z-score +3.8&sigma; deviation in off-hours access. Diurnal entropy collapsed from 4.58 (normal) to 1.84 (concentrated nighttime exfiltration).
                    </p>
                  </div>
                  <div className="p-4 bg-[#111111] border border-[#292929] space-y-2">
                    <span className="text-[#F59E0B] font-semibold block uppercase text-[10px]">3. Investigative Hypotheses</span>
                    <p className="text-[#A0A0A0] font-sans text-[11px] leading-relaxed">
                      Potential unauthorized trade-secret preservation prior to resignation departure; host disk image requested to verify encrypted archive staging.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SECTION E — RESEARCH AND EVIDENCE
          Methodology, PySpark Pipeline, Anomaly Analysis & Evidence Traceability
      ========================================================================= */}
      <section id="methodology" className="py-24 border-b border-[#292929] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Forensic Investigation Workspace Image */}
          <div className="lg:col-span-5 relative scroll-reveal-left">
            <div className="image-reveal-frame border border-[#292929] shadow-xl">
              <img
                src="/assets/forensics_investigation.jpg"
                alt="Digital Forensics Incident Dossier and Investigation Workspace"
                className="image-reveal-img w-full h-[480px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none opacity-75" />
              <div className="absolute bottom-6 left-6 text-white font-mono text-[11px]">
                <div className="text-[#F2D35E] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#F2D35E]" />
                  <span>FIG. 02 // EVIDENCE INTEGRITY & TRACEABILITY</span>
                </div>
                <div className="text-[#777777] mt-0.5">ZERO TEMPORAL LEAKAGE • CERT R4.2 SCHEMA COMPLIANT</div>
              </div>
            </div>
          </div>

          {/* Right Column: Research Narrative */}
          <div className="lg:col-span-7 space-y-8 scroll-reveal">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Research & Methodology</span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
                Explainable Findings <em className="font-display italic text-[#F2D35E]">Rooted in Math</em>
              </h2>
              <p className="text-[#A0A0A0] text-sm sm:text-base font-light leading-relaxed">
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
          8. SECTION E2 — EVIDENCE STANDARDS (Epistemic Hygiene)
      ========================================================================= */}
      <section id="evidence" className="py-24 border-b border-[#292929] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4 scroll-reveal">
            <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Institutional Standard</span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
              Evidence, <em className="font-display italic text-[#F2D35E]">Not Assumptions</em>
            </h2>
            <p className="text-[#A0A0A0] text-sm sm:text-base font-light leading-relaxed">
              <strong>A statistical anomaly alone never proves malicious intent.</strong> CyberDNA enforces strict epistemic hygiene by separating verified observations from investigative theories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Category 1 */}
            <div className="p-6 bg-[#171717] border border-[#292929] space-y-3 scroll-reveal delay-100">
              <div className="flex items-center gap-2 text-[#10B981] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Observed Facts</span>
              </div>
              <p className="text-[#A0A0A0] font-light leading-relaxed text-[11px]">
                Immutable telemetry: verified source/destination sockets, authenticated Kerberos tickets, process hashes, and byte volumes recorded in SIEM logs.
              </p>
            </div>

            {/* Category 2 */}
            <div className="p-6 bg-[#171717] border border-[#292929] space-y-3 scroll-reveal delay-200">
              <div className="flex items-center gap-2 text-[#F2D35E] font-medium">
                <Activity className="w-4 h-4 text-[#F2D35E]" />
                <span>Statistical Anomalies</span>
              </div>
              <p className="text-[#A0A0A0] font-light leading-relaxed text-[11px]">
                Mathematical deviations from established baseline distributions: Z-score &gt; 2.5&sigma; shifts in failure rate, transfer velocity, or entropy.
              </p>
            </div>

            {/* Category 3 */}
            <div className="p-6 bg-[#171717] border border-[#292929] space-y-3 scroll-reveal delay-300">
              <div className="flex items-center gap-2 text-[#D8D8D8] font-medium">
                <Layers className="w-4 h-4 text-[#D8D8D8]" />
                <span>Inferred Relationships</span>
              </div>
              <p className="text-[#A0A0A0] font-light leading-relaxed text-[11px]">
                Temporally correlated multi-stage interactions: credential bursts preceding lateral RDP sessions within a 4-hour temporal envelope.
              </p>
            </div>

            {/* Category 4 */}
            <div className="p-6 bg-[#171717] border border-[#292929] space-y-3 scroll-reveal delay-400">
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
          9. SECTION F — FINAL CALL TO ACTION
          Headline: "Understand the activity. Examine the evidence."
      ========================================================================= */}
      <section className="py-24 border-b border-[#292929] bg-[#0A0A0A] text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8 scroll-reveal">
          <span className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Ready for Inspection</span>
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-white leading-tight">
            Understand the activity. <br className="hidden sm:inline" />
            <em className="font-display italic text-[#F2D35E]">Examine the evidence.</em>
          </h2>
          <p className="text-[#A0A0A0] text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed">
            Access the pre-populated enterprise insider-threat forensics dashboard with 2,173 verified security records, employee behavioral profiles, and evidence-grounded case dossiers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-8 py-4 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-colors font-medium text-sm tracking-tight flex items-center justify-center gap-3 group shadow-[0_0_24px_rgba(242,211,94,0.18)] cursor-pointer"
            >
              <span>Launch Analyst Demo</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <a
              href="#methodology"
              className="w-full sm:w-auto px-8 py-4 bg-[#171717] text-[#D8D8D8] border border-[#292929] hover:bg-[#222222] transition-colors font-normal text-sm tracking-tight flex items-center justify-center cursor-pointer"
            >
              <span>Explore Methodology</span>
            </a>
          </div>

          <div className="text-[11px] font-mono text-[#777777] pt-4">
            Instant Demo Access • Synthetic Corporate Corpus • Zero Cloud Dependency
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FOOTER
      ========================================================================= */}
      <footer className="bg-[#0A0A0A] py-16 border-t border-[#292929] text-xs text-[#A0A0A0]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <CyberDNALogo size="md" />
              <p className="text-[11px] text-[#777777] leading-relaxed font-light">
                Enterprise Insider-Threat Behavioral Analytics & Digital Forensics Platform. Built for academic research.
              </p>
              <button
                onClick={handleReplayIntro}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#F2D35E] hover:text-[#FFE58A] transition-colors pt-2 cursor-pointer"
                title="Replay the cinematic 12 -> 46 -> 100 loading animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Cinematic Intro (12 &rarr; 46 &rarr; 100)</span>
              </button>
            </div>

            <div>
              <div className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Platform</div>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#problem" className="hover:text-white transition-colors">The Problem</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#patterns" className="hover:text-white transition-colors">Analytical Patterns</a></li>
                <li><a href="#workspace" className="hover:text-white transition-colors">Forensic Workspace</a></li>
                <li><button onClick={onEnterDemo} className="hover:text-white transition-colors cursor-pointer">Launch Analyst Demo</button></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Research</div>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Columnar Parquet Engine</a></li>
                <li><a href="#methodology" className="hover:text-white transition-colors">Shannon Hourly Entropy</a></li>
                <li><a href="#evidence" className="hover:text-white transition-colors">Evidence Standards</a></li>
                <li><a href="#methodology" className="hover:text-white transition-colors">Baseline Safeguards</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-[11px] text-white uppercase tracking-wider mb-3">Academic Provenance</div>
              <p className="text-[11px] text-[#777777] leading-relaxed font-light">
                Master's in Cybersecurity research. Uses verified synthetic insider telemetry partitions based on the CERT r4.2 schema. Not intended as commercial enterprise security software.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#292929] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777777] font-mono gap-4">
            <div>&copy; 2026 CyberDNA. Master's in Cybersecurity Research.</div>
            <div className="flex items-center gap-6">
              <button onClick={onNavigateToLogin} className="hover:text-white transition-colors cursor-pointer">Sign In</button>
              <button onClick={onEnterDemo} className="hover:text-white transition-colors cursor-pointer">Instant Demo</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
