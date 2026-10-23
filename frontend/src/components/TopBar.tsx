import React from 'react';
import { Search, RefreshCw, Database, Clock, ChevronRight, LogOut } from 'lucide-react';

interface TopBarProps {
  currentView: string;
  subTitle?: string;
  onSearch?: (query: string) => void;
  onRunPipeline?: () => void;
  isPipelineRunning?: boolean;
  totalEvents: number;
  onLogout?: () => void;
  userEmail?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  subTitle,
  onSearch,
  onRunPipeline,
  isPipelineRunning,
  totalEvents,
  onLogout,
  userEmail
}) => {
  return (
    <header className="h-14 border-b border-[#292929] bg-[#0A0A0A] px-6 flex items-center justify-between shrink-0 select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-[#777777]">CyberDNA</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#777777]" />
        <span className="text-white font-medium capitalize">{currentView}</span>
        {subTitle && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#777777]" />
            <span className="text-[#F2D35E] font-mono text-[11px]">{subTitle}</span>
          </>
        )}
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
          <input
            type="text"
            placeholder="Search entities, IPs, event IDs, MITRE tactics..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#111111] text-[#D8D8D8] placeholder-[#777777] border border-[#292929] text-xs font-mono focus:outline-none focus:border-[#F2D35E] transition-colors"
          />
        </div>
      </div>

      {/* Right Telemetry Badges & Action */}
      <div className="flex items-center gap-3 text-xs">
        <div className="hidden sm:flex items-center gap-2 text-[#A0A0A0] bg-[#111111] px-2.5 py-1 border border-[#292929] text-[11px] font-mono">
          <Database className="w-3 h-3 text-[#F2D35E]" />
          <span className="text-white font-medium">{totalEvents.toLocaleString()} Events</span>
          <span className="text-[#777777]">|</span>
          <span className="text-[#777777]">Parquet</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[#777777] text-[11px] font-mono">
          <Clock className="w-3 h-3 text-[#F2D35E]" />
          <span>2026-10-24 UTC</span>
        </div>

        {onRunPipeline && (
          <button
            onClick={onRunPipeline}
            disabled={isPipelineRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] border border-[#292929] text-[#D8D8D8] hover:border-[#F2D35E]/50 hover:text-white text-xs font-mono transition-colors disabled:opacity-50"
            title="Execute Big Data Ingestion, Baseline Recalculation & Isolation Forest Scoring"
          >
            <RefreshCw className={`w-3 h-3 text-[#F2D35E] ${isPipelineRunning ? 'animate-spin' : ''}`} />
            <span>{isPipelineRunning ? 'Syncing...' : 'Sync'}</span>
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="p-1.5 text-[#777777] hover:text-[#EF4444] hover:bg-[#171717] border border-[#292929] ml-1 transition-colors"
            title={`Sign Out (${userEmail || 'Active Analyst'})`}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
