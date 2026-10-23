import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Eye,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  Layers,
  ChevronRight,
  User,
  Info,
  Calendar,
  ExternalLink,
  RefreshCw,
  FileText
} from 'lucide-react';
import { ThreatFinding, ActivityEvent } from '../types';
import { api } from '../services/api';

interface FindingsViewProps {
  onNavigateToEntity?: (entityId: string) => void;
  onNavigateToInvestigation?: (invId: string) => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({
  onNavigateToEntity,
  onNavigateToInvestigation
}) => {
  const [findings, setFindings] = useState<ThreatFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedFinding, setSelectedFinding] = useState<ThreatFinding | null>(null);
  const [supportingEvents, setSupportingEvents] = useState<ActivityEvent[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadFindings();
  }, [categoryFilter, statusFilter]);

  async function loadFindings() {
    setLoading(true);
    try {
      const data = await api.getFindings({
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        reviewStatus: statusFilter !== 'ALL' ? statusFilter : undefined
      });
      setFindings(data);
      if (data.length > 0 && !selectedFinding) {
        handleSelectFinding(data[0]);
      }
    } catch (err) {
      console.error('Failed to load findings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectFinding(finding: ThreatFinding) {
    setSelectedFinding(finding);
    setLoadingDetail(true);
    try {
      const detail = await api.getFindingDetail(finding.id);
      setSupportingEvents(detail.supportingEvents || []);
    } catch (err) {
      console.error('Failed to load finding detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleStatusChange(newStatus: 'NEW' | 'UNDER_REVIEW' | 'ESCALATED' | 'BENIGN' | 'RESOLVED') {
    if (!selectedFinding) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateFindingStatus(selectedFinding.id, newStatus);
      setSelectedFinding(updated);
      setFindings(prev => prev.map(f => f.id === updated.id ? updated : f));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const filtered = findings.filter(f => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.id.toLowerCase().includes(q) ||
      f.employeeName.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q) ||
      f.explanation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Editorial Header */}
      <div className="border-b border-[#292929] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F2D35E] mb-2">
              <AlertTriangle className="w-4 h-4 text-[#F2D35E]" />
              <span>Unusual Activity Detection</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
              Security <span className="italic font-normal text-[#F2D35E]">Alerts</span>
            </h1>
            <p className="mt-2 text-sm text-[#A0A0A0] max-w-2xl font-light">
              Unusual employee activities detected by simple, explainable security rules. Each alert explains what happened, why it was flagged, and recommended next steps for human review.
            </p>
          </div>

          {/* Epistemic Guardrail Notice */}
          <div className="bg-[#111111] border border-[#292929] p-3 text-xs text-[#A0A0A0] max-w-md">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#F2D35E] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Reviewer Notice: </span>
                These alerts indicate unusual activity requiring human review, not proof that an employee has done something wrong.
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1F1F1F]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search findings by employee, ID, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[#111111] border border-[#292929] text-xs text-white placeholder-[#777777] focus:outline-none focus:border-[#F2D35E] w-72"
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#111111] border border-[#292929] px-3 py-1.5 text-xs text-[#D8D8D8] focus:outline-none focus:border-[#F2D35E]"
            >
              <option value="ALL">All Finding Categories</option>
              <option value="RESIGNATION_DATA_HOARDING">Notice Period / Pre-Departure Data Hoarding</option>
              <option value="PRIVILEGE_ABUSE_LATERAL_ACCESS">Privilege Escalation & Memory Access</option>
              <option value="ABNORMAL_CLOUD_STORAGE_UPLOAD">Anomalous DNS Tunneling / Exfiltration</option>
            </select>

            {/* Review Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111111] border border-[#292929] px-3 py-1.5 text-xs text-[#D8D8D8] focus:outline-none focus:border-[#F2D35E]"
            >
              <option value="ALL">All Review Statuses</option>
              <option value="NEW">New</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadFindings}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#171717] border border-[#292929] text-xs text-[#D8D8D8] hover:text-white hover:border-[#F2D35E] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Findings</span>
            </button>
            <span className="text-xs text-[#777777] font-mono">
              {filtered.length} finding{filtered.length === 1 ? '' : 's'} flagged
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Findings Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Finding Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#777777] font-mono border border-[#292929] bg-[#111111]">
              Scanning Big Data analytical artifacts...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#777777] font-mono border border-[#292929] bg-[#111111]">
              No findings match selected filter criteria.
            </div>
          ) : (
            filtered.map((finding) => {
              const isSelected = selectedFinding?.id === finding.id;
              const isHigh = finding.anomalyScore >= 80;

              return (
                <div
                  key={finding.id}
                  onClick={() => handleSelectFinding(finding)}
                  className={`p-4 border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#F2D35E] bg-[#141414] shadow-[0_0_15px_rgba(242,211,94,0.08)]'
                      : 'border-[#292929] bg-[#111111] hover:border-[#3E3E3E] hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-[#F2D35E] font-medium">{finding.id}</span>
                        <span className="text-[#555555]">•</span>
                        <span className="text-[#A0A0A0]">{finding.department}</span>
                      </div>
                      <h3 className="mt-1 text-sm font-medium text-white group-hover:text-[#F2D35E] transition-colors">
                        {finding.categoryLabel}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-[#A0A0A0]">
                        <User className="w-3 h-3 text-[#777777]" />
                        <span>{finding.employeeName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`inline-block px-2 py-0.5 text-[10px] font-mono font-medium ${
                        isHigh ? 'bg-[#3D1414] text-[#FF7A7A] border border-[#5E1E1E]' : 'bg-[#2E2812] text-[#F2D35E] border border-[#52441A]'
                      }`}>
                        SCORE {finding.anomalyScore}
                      </div>
                      <div className="mt-1 text-[10px] font-mono text-[#777777]">
                        {finding.reviewStatus}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#A0A0A0] line-clamp-2 leading-relaxed">
                    {finding.explanation}
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] text-[#777777] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {finding.observationWindow}
                    </span>
                    <span className="text-[#F2D35E] flex items-center gap-1 hover:underline">
                      Inspect telemetry <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Finding Dossier & Telemetry Proof */}
        <div className="lg:col-span-7 border border-[#292929] bg-[#111111] p-6 space-y-6 sticky top-6">
          {selectedFinding ? (
            <>
              {/* Header Details */}
              <div className="border-b border-[#292929] pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#F2D35E]">
                    <span className="px-2 py-0.5 bg-[#1F1C12] border border-[#52441A] font-semibold">{selectedFinding.id}</span>
                    <span className="text-[#777777]">MITRE ATT&CK: {selectedFinding.mitreTactic}</span>
                  </div>

                  {/* Review Status Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#777777] font-mono">Review Status:</span>
                    <select
                      value={selectedFinding.reviewStatus}
                      onChange={(e) => handleStatusChange(e.target.value as any)}
                      disabled={isUpdatingStatus}
                      className="bg-[#1A1A1A] border border-[#3E3E3E] text-xs px-2.5 py-1 text-white focus:outline-none focus:border-[#F2D35E]"
                    >
                      <option value="NEW">New</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>
                </div>

                <h2 className="mt-3 text-2xl font-serif text-white tracking-tight">
                  {selectedFinding.categoryLabel}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#A0A0A0]">
                  <div>
                    Employee: <span className="text-white font-medium">{selectedFinding.employeeName}</span> ({selectedFinding.department})
                  </div>
                  <div>•</div>
                  <div>
                    Time Window: <span className="font-mono text-white">{selectedFinding.observationWindow}</span>
                  </div>
                  <div>•</div>
                  <div>
                    Evidence Records: <span className="font-mono text-[#F2D35E] font-medium">{selectedFinding.evidenceCompleteness}</span>
                  </div>
                </div>
              </div>

              {/* Anomaly Score & Deviation Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-[#141414] border border-[#292929] p-3">
                  <div className="text-[11px] font-mono text-[#777777] uppercase">Unusual Activity Score</div>
                  <div className="mt-1 text-2xl font-mono font-medium text-[#F2D35E]">
                    {selectedFinding.anomalyScore}
                    <span className="text-xs text-[#777777]"> / 100</span>
                  </div>
                  <div className="text-[10px] text-[#A0A0A0] mt-0.5">Deviation intensity</div>
                </div>

                <div className="bg-[#141414] border border-[#292929] p-3">
                  <div className="text-[11px] font-mono text-[#777777] uppercase">Activity Records</div>
                  <div className="mt-1 text-2xl font-mono font-medium text-white">
                    {selectedFinding.supportingEventIds.length}
                    <span className="text-xs text-[#777777]"> events</span>
                  </div>
                  <div className="text-[10px] text-[#A0A0A0] mt-0.5">Direct supporting records</div>
                </div>

                <div className="bg-[#141414] border border-[#292929] p-3 col-span-2 md:col-span-1">
                  <div className="text-[11px] font-mono text-[#777777] uppercase">Review Status</div>
                  <div className="mt-1 text-sm font-mono font-semibold text-white uppercase">
                    {selectedFinding.reviewStatus.replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-[#A0A0A0] mt-0.5">Current review state</div>
                </div>
              </div>

              {/* 4 Explainable Alert Review Questions */}
              <div className="border border-[#292929] bg-[#141414] p-5 space-y-4">
                <div className="text-xs font-mono uppercase text-[#F2D35E] tracking-wider flex items-center justify-between border-b border-[#292929] pb-2">
                  <span>Explainable Alert Details</span>
                  <span className="text-[10px] text-[#A0A0A0]">Explainable Rule Logic</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* 1. What happened? */}
                  <div className="p-3 bg-[#0D0D0D] border border-[#222222]">
                    <div className="text-[11px] font-mono text-[#F2D35E] font-medium flex items-center gap-1.5 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#1F1C12] border border-[#52441A] inline-flex items-center justify-center text-[10px]">1</span>
                      What happened?
                    </div>
                    <p className="text-xs text-[#D8D8D8] leading-relaxed">
                      {selectedFinding.whatHappened || selectedFinding.explanation}
                    </p>
                  </div>

                  {/* 2. Why was it flagged? */}
                  <div className="p-3 bg-[#0D0D0D] border border-[#222222]">
                    <div className="text-[11px] font-mono text-[#F2D35E] font-medium flex items-center gap-1.5 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#1F1C12] border border-[#52441A] inline-flex items-center justify-center text-[10px]">2</span>
                      Why was it flagged?
                    </div>
                    <p className="text-xs text-[#D8D8D8] leading-relaxed">
                      {selectedFinding.whyFlagged || selectedFinding.baselineComparison}
                    </p>
                  </div>

                  {/* 3. Which employee or activity is involved? */}
                  <div className="p-3 bg-[#0D0D0D] border border-[#222222]">
                    <div className="text-[11px] font-mono text-[#F2D35E] font-medium flex items-center gap-1.5 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#1F1C12] border border-[#52441A] inline-flex items-center justify-center text-[10px]">3</span>
                      Which employee is involved?
                    </div>
                    <p className="text-xs text-[#D8D8D8] leading-relaxed font-mono">
                      {selectedFinding.employeeInvolved || `${selectedFinding.employeeName} (${selectedFinding.department})`}
                    </p>
                  </div>

                  {/* 4. What should the reviewer check next? */}
                  <div className="p-3 bg-[#0D0D0D] border border-[#222222]">
                    <div className="text-[11px] font-mono text-[#F2D35E] font-medium flex items-center gap-1.5 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#1F1C12] border border-[#52441A] inline-flex items-center justify-center text-[10px]">4</span>
                      What should the reviewer check next?
                    </div>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      {selectedFinding.nextSteps || "Review recent activity records and confirm if this action was authorized by management."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Activity Records Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase text-[#A0A0A0] flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#F2D35E]" />
                    <span>Supporting Activity Events ({supportingEvents.length})</span>
                  </div>
                  <span className="text-[11px] text-[#777777] font-mono">Activity Records</span>
                </div>

                {loadingDetail ? (
                  <div className="p-4 text-center text-xs text-[#777777] font-mono border border-[#292929] bg-[#0A0A0A]">
                    Loading supporting records...
                  </div>
                ) : supportingEvents.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#777777] font-mono border border-[#292929] bg-[#0A0A0A]">
                    {selectedFinding.supportingEventIds.length} event IDs linked in pipeline ({selectedFinding.supportingEventIds.join(', ')}).
                  </div>
                ) : (
                  <div className="border border-[#292929] bg-[#0A0A0A] overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#141414] border-b border-[#292929] text-[10px] font-mono text-[#777777] uppercase">
                        <tr>
                          <th className="p-2">Event ID</th>
                          <th className="p-2">Timestamp</th>
                          <th className="p-2">Event Type</th>
                          <th className="p-2">Details / Resource</th>
                          <th className="p-2 text-right">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1F1F1F] font-mono">
                        {supportingEvents.map(evt => (
                          <tr key={evt.event_id} className="hover:bg-[#161616] text-[#A0A0A0]">
                            <td className="p-2 text-[#F2D35E] font-medium">{evt.event_id}</td>
                            <td className="p-2 text-[11px]">{new Date(evt.timestamp).toUTCString().slice(17, 25)} UTC</td>
                            <td className="p-2 text-white">{evt.event_type}</td>
                            <td className="p-2 truncate max-w-xs">{evt.process_name || evt.target_resource}</td>
                            <td className="p-2 text-right text-white">
                              {evt.bytes_transferred > 1_000_000
                                ? `${(evt.bytes_transferred / (1024*1024)).toFixed(1)} MB`
                                : `${evt.bytes_transferred} B`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Action Buttons: Navigate to Employee DNA or Case Investigation */}
              <div className="pt-4 border-t border-[#292929] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onNavigateToEntity && onNavigateToEntity(selectedFinding.employeeId)}
                  className="px-4 py-2 bg-[#171717] border border-[#292929] text-xs text-white hover:text-[#F2D35E] hover:border-[#F2D35E] transition-colors flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#F2D35E]" />
                  <span>View Employee Activity Summary</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onNavigateToInvestigation && onNavigateToInvestigation('INV-2026-101')}
                  className="px-4 py-2 bg-[#F2D35E] text-[#0A0A0A] font-medium text-xs hover:bg-[#FFE58A] transition-colors flex items-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#0A0A0A]" />
                  <span>Open Security Investigation</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-[#777777] text-xs font-mono">
              Select a finding from the left to view comprehensive forensic details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
