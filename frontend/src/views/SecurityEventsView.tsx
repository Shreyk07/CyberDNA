import React, { useState, useEffect } from 'react';
import {
  Search,
  FileDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import type { SecurityEvent } from '../types';
import { api } from '../services/api';

interface SecurityEventsViewProps {
  onNavigateToEntity: (entityId: string) => void;
}

export const SecurityEventsView: React.FC<SecurityEventsViewProps> = ({
  onNavigateToEntity
}) => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Pagination & Filtering state
  const [page, setPage] = useState(0);
  const pageSize = 40;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  // Event detail modal state
  const [activeEvent, setActiveEvent] = useState<SecurityEvent | null>(null);

  useEffect(() => {
    loadEvents();
  }, [page, selectedEventType, selectedSeverity]);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await api.getEvents({
        limit: pageSize,
        offset: page * pageSize,
        eventType: selectedEventType !== 'ALL' ? selectedEventType : undefined,
        severity: selectedSeverity !== 'ALL' ? selectedSeverity : undefined,
        search: searchTerm || undefined
      });
      setEvents(res.events);
      setTotalCount(res.total);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    loadEvents();
  }

  function handleExportCsv() {
    if (events.length === 0) return;
    const headers = Object.keys(events[0]).join(',');
    const rows = events.map(e => Object.values(e).map(val => `"${val}"`).join(','));
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cyberdna_events_page_${page + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#777777] uppercase">Telemetry Event Log Stream</div>
          <h1 className="text-3xl font-light tracking-tight text-[#D8D8D8] mt-1 font-serif">Security Events Explorer</h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-light max-w-2xl leading-relaxed">
            Searchable, paginated audit log of 2,231 verified security events. Supports granular filtration by entity type, protocol, destination socket, process context, and MITRE detection rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:bg-[#222222] text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-[#777777]" />
            Export Filtered CSV
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="p-4 bg-[#111111] border border-[#292929] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              placeholder="Search event ID, entity, process name, source or destination IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#171717] text-[#D8D8D8] border border-[#292929] text-xs focus:outline-none focus:border-[#F2D35E] font-sans placeholder-[#777777]"
            />
          </div>

          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] text-xs font-semibold font-mono transition-colors"
          >
            Filter
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#777777] font-mono text-[11px]">Type:</span>
            <select
              value={selectedEventType}
              onChange={(e) => { setSelectedEventType(e.target.value); setPage(0); }}
              className="bg-[#171717] border border-[#292929] px-2 py-1 text-[#D8D8D8] focus:outline-none focus:border-[#F2D35E] font-mono text-xs"
            >
              <option value="ALL">All Event Types</option>
              <option value="AUTH_SUCCESS">AUTH_SUCCESS</option>
              <option value="AUTH_FAILURE">AUTH_FAILURE</option>
              <option value="PROCESS_SPAWN">PROCESS_SPAWN</option>
              <option value="LATERAL_MOVEMENT">LATERAL_MOVEMENT</option>
              <option value="DATA_EXFILTRATION">DATA_EXFILTRATION</option>
              <option value="NETWORK_CONNECTION">NETWORK_CONNECTION</option>
              <option value="DNS_QUERY">DNS_QUERY</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#777777] font-mono text-[11px]">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => { setSelectedSeverity(e.target.value); setPage(0); }}
              className="bg-[#171717] border border-[#292929] px-2 py-1 text-[#D8D8D8] focus:outline-none focus:border-[#F2D35E] font-mono text-xs"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="INFO">Info</option>
            </select>
          </div>
        </div>
      </form>

      {/* Table Container */}
      <div className="bg-[#111111] border border-[#292929] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292929] bg-[#171717] text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Event Identifier</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Associated Entity</th>
                <th className="py-3 px-4">Socket Direction</th>
                <th className="py-3 px-4">Process / Rule</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929] text-xs font-mono">
              {events.map((evt) => (
                <tr
                  key={evt.event_id}
                  onClick={() => setActiveEvent(evt)}
                  className="hover:bg-[#171717]/80 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-4 text-[#777777] whitespace-nowrap text-[11px]">
                    {evt.timestamp.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#D8D8D8]">
                    {evt.event_id}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-1.5 py-0.5 bg-[#171717] border border-[#292929] text-[11px] text-[#A0A0A0]">
                      {evt.event_type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[#D8D8D8]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToEntity(evt.entity_id);
                      }}
                      className="text-[#F2D35E] hover:underline flex items-center gap-1"
                    >
                      {evt.entity_id}
                      <ExternalLink className="w-2.5 h-2.5 text-[#777777]" />
                    </button>
                  </td>
                  <td className="py-2.5 px-4 text-[#777777] text-[11px] whitespace-nowrap">
                    {evt.source_ip} &rarr; {evt.destination_ip}:{evt.destination_port}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-[#A0A0A0] text-[11px] truncate max-w-xs">
                    {evt.process_name || evt.rule_triggered}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 border ${
                      evt.severity === 'CRITICAL' ? 'border-rose-500/50 text-rose-400 bg-rose-950/40 font-semibold' :
                      evt.severity === 'HIGH' ? 'border-rose-500/30 text-rose-400 bg-rose-950/20' :
                      evt.severity === 'MEDIUM' ? 'border-amber-500/30 text-amber-400 bg-amber-950/20' :
                      'border-[#292929] text-[#777777] bg-[#171717]'
                    }`}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveEvent(evt);
                      }}
                      className="px-2 py-0.5 text-[11px] border border-[#292929] bg-[#171717] hover:bg-[#222222] text-[#A0A0A0] hover:text-[#D8D8D8] transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#292929] bg-[#141414] flex items-center justify-between text-xs text-[#A0A0A0]">
          <div>
            Showing <span className="font-mono font-medium text-[#D8D8D8]">{page * pageSize + 1}</span> to{' '}
            <span className="font-mono font-medium text-[#D8D8D8]">{Math.min((page + 1) * pageSize, totalCount)}</span> of{' '}
            <span className="font-mono font-medium text-[#D8D8D8]">{totalCount.toLocaleString()}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
              className="px-2.5 py-1 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:bg-[#202020] disabled:opacity-30 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span className="font-mono text-[#777777] text-[11px] px-2">
              Page {page + 1} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={page >= totalPages - 1}
              className="px-2.5 py-1 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:bg-[#202020] disabled:opacity-30 flex items-center gap-1 transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Event Details Drawer */}
      {activeEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#292929] max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#292929] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#777777] uppercase">Raw Telemetry Inspector</span>
                <h3 className="text-base font-mono font-medium text-[#D8D8D8] mt-0.5">
                  {activeEvent.event_id} ({activeEvent.event_type})
                </h3>
              </div>
              <button
                onClick={() => setActiveEvent(null)}
                className="text-[#777777] hover:text-[#D8D8D8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-[#171717] border border-[#292929]">
                <span className="text-[#777777] block text-[10px]">Timestamp</span>
                <span className="text-[#D8D8D8]">{activeEvent.timestamp}</span>
              </div>
              <div className="p-2.5 bg-[#171717] border border-[#292929]">
                <span className="text-[#777777] block text-[10px]">Severity</span>
                <span className="text-[#D8D8D8] font-semibold">{activeEvent.severity}</span>
              </div>
              <div className="p-2.5 bg-[#171717] border border-[#292929]">
                <span className="text-[#777777] block text-[10px]">Entity ID</span>
                <span className="text-[#F2D35E]">{activeEvent.entity_id}</span>
              </div>
              <div className="p-2.5 bg-[#171717] border border-[#292929]">
                <span className="text-[#777777] block text-[10px]">Entity Type</span>
                <span className="text-[#D8D8D8]">{activeEvent.entity_type}</span>
              </div>
              <div className="p-2.5 bg-[#171717] border border-[#292929]">
                <span className="text-[#777777] block text-[10px]">Source Socket</span>
                <span className="text-[#D8D8D8]">{activeEvent.source_ip}</span>
              </div>
              <div className="p-2.5 bg-[#171717] border border-[#292929]">
                <span className="text-[#777777] block text-[10px]">Destination Socket</span>
                <span className="text-[#D8D8D8]">{activeEvent.destination_ip}:{activeEvent.destination_port}</span>
              </div>
              <div className="p-2.5 bg-[#171717] border border-[#292929]">
                <span className="text-[#777777] block text-[10px]">Process / Command</span>
                <span className="text-[#D8D8D8] truncate block">{activeEvent.process_name || 'N/A'}</span>
              </div>
              <div className="p-2.5 bg-[#171717] border border-[#292929]">
                <span className="text-[#777777] block text-[10px]">Volume Transferred</span>
                <span className="text-[#D8D8D8]">{activeEvent.bytes_transferred ? `${activeEvent.bytes_transferred} bytes` : '0'}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono text-[#777777] uppercase block mb-1">Detection Rule Triggered</span>
              <div className="p-2.5 bg-[#171717] border border-[#292929] font-mono text-xs text-[#D8D8D8]">
                {activeEvent.rule_triggered}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#292929]">
              <button
                onClick={() => {
                  onNavigateToEntity(activeEvent.entity_id);
                  setActiveEvent(null);
                }}
                className="px-3 py-1.5 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:bg-[#202020] text-xs font-normal transition-colors"
              >
                Inspect Entity Profile
              </button>
              <button
                onClick={() => setActiveEvent(null)}
                className="px-4 py-1.5 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
