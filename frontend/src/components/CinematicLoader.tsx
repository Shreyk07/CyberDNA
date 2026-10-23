import React, { useState, useEffect, useRef } from 'react';

interface CinematicLoaderProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({
  onComplete,
  forceShow = false
}) => {
  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Generate randomized starting percentage between 7 and 16
  const [startPercentage] = useState(() => Math.floor(Math.random() * (16 - 7 + 1)) + 7);
  const [percent, setPercent] = useState<number>(startPercentage);
  const [isReady, setIsReady] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  // Keep a stable ref to onComplete to avoid effect re-triggers
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Define and track readiness condition:
  // - Critical local hero asset loaded or failed gracefully
  // - Component mounted and rendered
  // - Resilient bounded fallback (never waits forever)
  const isAssetReadyRef = useRef(false);

  useEffect(() => {
    // Immediate bypass for reduced motion preference
    if (prefersReducedMotion) {
      onCompleteRef.current();
      setIsRemoved(true);
      return;
    }

    let isCancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    // Check critical hero asset readiness (hero SOC image)
    const img = new Image();
    img.src = '/assets/hero_soc.jpg';
    img.onload = () => {
      isAssetReadyRef.current = true;
    };
    img.onerror = () => {
      // Graceful fallback if image is missing or delayed
      isAssetReadyRef.current = true;
    };

    // Bounded safety fallback: ensure readiness is true within 1000ms max
    const fallbackTimer = setTimeout(() => {
      isAssetReadyRef.current = true;
    }, 1000);

    // Current tracking value in ref to avoid stale closure
    let current = startPercentage;

    const scheduleNextTick = () => {
      if (isCancelled) return;

      if (current >= 100) {
        current = 100;
        setPercent(100);
        setIsReady(true);

        // Hold at 100% briefly (350ms), then begin smooth dissolve
        timerId = setTimeout(() => {
          if (isCancelled) return;
          setIsDissolving(true);
          // Notify parent so hero section begins entrance in sync with dissolve
          onCompleteRef.current();

          // After dissolve transition completes (700ms), unmount loader completely
          timerId = setTimeout(() => {
            if (isCancelled) return;
            setIsRemoved(true);
          }, 700);
        }, 380);

        return;
      }

      // Dynamic variable increment:
      // - Smaller steps (2-6%) at start
      // - Moderate steps (3-8%) in middle
      // - If approaching 90% and asset is ready, accelerate smoothly to 100%
      let increment: number;
      let delay: number;

      if (current < 45) {
        increment = Math.floor(Math.random() * 5) + 3; // 3 to 7
        delay = Math.floor(Math.random() * 50) + 60;   // 60ms to 110ms
      } else if (current < 85) {
        increment = Math.floor(Math.random() * 6) + 4; // 4 to 9
        delay = Math.floor(Math.random() * 60) + 70;   // 70ms to 130ms
      } else {
        // Approaching completion (85%+)
        if (isAssetReadyRef.current) {
          // Asset ready: accelerate to 100
          increment = Math.floor(Math.random() * 5) + 5; // 5 to 9
          delay = Math.floor(Math.random() * 40) + 50;   // 50ms to 90ms
        } else {
          // Brief pacing while waiting for asset (bounded by fallback)
          increment = 2;
          delay = 120;
        }
      }

      current = Math.min(100, current + increment);
      setPercent(current);

      timerId = setTimeout(scheduleNextTick, delay);
    };

    // Kick off progression
    timerId = setTimeout(scheduleNextTick, 80);

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
      clearTimeout(fallbackTimer);
    };
  }, [startPercentage, prefersReducedMotion]);

  if (isRemoved) {
    return null;
  }

  // Stage label based on dynamic progress
  const getStageLabel = () => {
    if (percent === 100 || isReady) {
      return 'SYSTEM READY';
    }
    if (percent >= 75) {
      return 'SYNTHESIZING DIURNAL ENTROPY';
    }
    if (percent >= 40) {
      return 'CALIBRATING BEHAVIORAL BASELINES';
    }
    return 'CYBERDNA / INITIALIZING TELEMETRY';
  };

  const getSubLabel = () => {
    if (percent === 100 || isReady) {
      return 'BEHAVIORAL ANALYTICS & FORENSIC WORKSPACE READY';
    }
    if (percent >= 75) {
      return 'Calculating Z-Score Outlier Bounds (70/30 Baseline Split)';
    }
    if (percent >= 40) {
      return 'Establishing Historical Diurnal Frequency Profiles';
    }
    return 'Ingesting Multi-Vector Telemetry & Normalizing Timestamps';
  };

  return (
    <div
      role="progressbar"
      aria-label="CyberDNA Behavioral Analytics Platform Initializing"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#0A0A0A] select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDissolving ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-[#292929]/40 text-xs font-mono text-[#777777]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 bg-[#F2D35E] rounded-full animate-pulse shadow-[0_0_8px_#F2D35E]" />
          <span className="text-[#D8D8D8] tracking-widest uppercase font-semibold">CyberDNA</span>
          <span className="text-[#444444]">/</span>
          <span className="tracking-wider text-[11px] text-[#A0A0A0]">BEHAVIORAL FORENSICS</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] tracking-wider text-[#777777]">
          <span>APEX GLOBAL TELEMETRY</span>
          <span className="text-[#444444]">•</span>
          <span>ESTABLISHING BASELINES</span>
        </div>
      </div>

      {/* Center Typographic Dynamic Counter */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Subtle radial glow centered on number */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[#F2D35E]/5 blur-[120px] pointer-events-none -translate-y-6" />

        {/* Dynamic Status Eyebrow */}
        <div className="text-center mb-4 transition-all duration-300 ease-out">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#292929] text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-[#A0A0A0]">
            {percent === 100 || isReady ? (
              <>
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_8px_#10B981]" />
                <span className="text-white font-medium">{getStageLabel()}</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 bg-[#F2D35E] rounded-full animate-pulse" />
                <span>{getStageLabel()}</span>
              </>
            )}
          </div>
        </div>

        {/* The Oversized Typographic Number (Dynamic Counter) */}
        <div className="relative font-mono font-extralight text-center my-2 select-none overflow-hidden h-[140px] sm:h-[180px] md:h-[220px] flex items-center justify-center">
          <div className="text-[6.5rem] sm:text-[9rem] md:text-[11.5rem] lg:text-[13rem] leading-none tracking-tighter text-[#E8E8E8] flex items-baseline justify-center">
            <span className="tabular-nums font-mono-num">{percent}</span>
            <span className="text-2xl sm:text-3xl md:text-4xl text-[#F2D35E] font-sans font-light ml-2 tracking-normal opacity-90">
              %
            </span>
          </div>
        </div>

        {/* Sub-label explaining current operation */}
        <div className="text-center mt-3 text-xs sm:text-sm font-mono tracking-wider text-[#777777] h-6 max-w-lg">
          {percent === 100 || isReady ? (
            <span className="text-[#F2D35E] font-medium tracking-widest text-[11px] uppercase">
              {getSubLabel()}
            </span>
          ) : (
            <span>{getSubLabel()}</span>
          )}
        </div>

        {/* Minimalist Synchronized Yellow Progress Line */}
        <div className="w-64 sm:w-80 md:w-96 max-w-full mt-8 space-y-2">
          <div className="w-full h-[2px] bg-[#222222] relative overflow-hidden">
            <div
              className="h-full bg-[#F2D35E] transition-all duration-150 ease-out shadow-[0_0_12px_rgba(242,211,94,0.6)]"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-[#555555]">
            <span>INITIALIZE</span>
            <span>BASELINES</span>
            <span className={percent === 100 ? 'text-[#F2D35E]' : ''}>READY</span>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Stamp */}
      <div className="max-w-7xl mx-auto w-full px-6 h-16 flex items-center justify-between border-t border-[#292929]/40 text-[11px] font-mono text-[#555555]">
        <div>ACADEMIC RESEARCH PLATFORM • CYBERDNA V2.4</div>
        <div className="text-[#777777]">LOCAL PYSPARK & PARQUET CORE</div>
      </div>
    </div>
  );
};
