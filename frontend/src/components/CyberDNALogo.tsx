import React from 'react';

interface CyberDNALogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const CyberDNALogo: React.FC<CyberDNALogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subtitleClass = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric DNA Monogram Symbol in signature yellow */}
      <div className={`${iconSize} border border-[#F2D35E] bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden group shrink-0 shadow-[0_0_12px_rgba(242,211,94,0.12)]`}>
        <div className="absolute inset-0 bg-[#F2D35E]/5" />
        <span className="font-mono font-semibold text-[#F2D35E] text-[11px] tracking-wider relative z-10">
          DNA
        </span>
      </div>

      <div>
        {/* Prominent Signature Yellow Wordmark */}
        <div className="flex items-baseline">
          <span className={`font-sans font-medium tracking-tight text-[#F2D35E] ${textClass} leading-none`}>
            Cyber<span className="font-semibold text-white">DNA</span>
          </span>
        </div>

        {/* Restrained Gray Subtitle */}
        {showSubtitle && (
          <span className={`text-[#777777] font-mono tracking-widest uppercase block mt-1 ${subtitleClass} leading-none`}>
            Forensics & Telemetry
          </span>
        )}
      </div>
    </div>
  );
};
