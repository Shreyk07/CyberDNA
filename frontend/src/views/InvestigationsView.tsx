import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileDown,
  CheckCircle2,
  AlertTriangle,
  Send,
  ExternalLink
} from 'lucide-react';
import type { Investigation, InvestigationNote } from '../types';
import { api } from '../services/api';

interface InvestigationsViewProps {
  initialInvestigationId?: string | null;
  onNavigateToEntity: (entityId: string) => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  initialInvestigationId,
  onNavigateToEntity
}) => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedInv, setSelectedInv] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'OBSERVED_FACT' | 'HYPOTHESIS' | 'CORRELATION' | 'CONCLUSION'>('OBSERVED_FACT');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // New Investigation Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<any>('HIGH');
  const [newLead, setNewLead] = useState('Analyst Monish (SOC Tier 3)');
  const [newEntities, setNewEntities] = useState('user:elena.rostova, host:WS-FIN-01');
  const [newSummary, setNewSummary] = useState('');

  useEffect(() => {
    loadInvestigations();
  }, []);

  useEffect(() => {
    if (initialInvestigationId && investigations.length > 0) {
      const match = investigations.find(i => i.id === initialInvestigationId);
      if (match) setSelectedInv(match);
    }
  }, [initialInvestigationId, investigations]);

  async function loadInvestigations() {
    setLoading(true);
    try {
      const list = await api.getInvestigations();
      setInvestigations(list);
      if (list.length > 0 && !selectedInv) {
        setSelectedInv(list[0]);
      }
    } catch (err) {
      console.error('Failed to load investigations:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInv || !newNoteText.trim()) return;

    setIsSubmittingNote(true);
    try {
      const created = await api.addInvestigationNote(selectedInv.id, {
        text: newNoteText.trim(),
        author: 'Lead Investigator (Active Session)',
        category: newNoteCategory
      });
      if (created) {
        setSelectedInv({
          ...selectedInv,
          notes: [created, ...selectedInv.notes]
        });
        setNewNoteText('');
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  }

  async function handleUpdateStatus(newStatus: any) {
    if (!selectedInv) return;
    try {
      const updated = await api.updateInvestigationStatus(selectedInv.id, newStatus);
      if (updated) {
        setSelectedInv(updated);
        setInvestigations(investigations.map(i => i.id === updated.id ? updated : i));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  async function handleCreateInvestigation(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const entityList = newEntities.split(',').map(s => s.trim()).filter(Boolean);
      const created = await api.createInvestigation({
        title: newTitle.trim(),
        severity: newSeverity,
        leadAnalyst: newLead.trim(),
        summary: newSummary.trim() || 'Manual investigation triggered following anomalous telemetry observation.',
        involvedEntities: entityList,
        observedFacts: ['Investigation initiated manually by SOC forensic team'],
        hypotheses: ['Potential unauthorized access or lateral movement staging pending verification']
      });

      if (created) {
        setInvestigations([created, ...investigations]);
        setSelectedInv(created);
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewSummary('');
      }
    } catch (err) {
      console.error('Failed to create investigation:', err);
    }
  }

  function handleExportReport(invId: string) {
    window.open(api.getExportUrl(invId), '_blank');
  }

  const filteredInvs = investigations.filter(inv => {
    if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-[#0A0A0A] text-[#D8D8D8]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Security Review Cases</div>
          <h1 className="font-display text-4xl sm:text-5xl font-light tracking-tight text-white mt-1">
            Security <span className="italic text-[#F2D35E]">Investigations</span>
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-light max-w-2xl leading-relaxed">
            Review security alerts and related employee activity records. Check the evidence, add reviewer notes, and update the case status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] transition-colors text-xs font-mono font-medium flex items-center gap-1.5 shadow-[0_0_16px_rgba(242,211,94,0.15)]"
          >
            <Plus className="w-3.5 h-3.5" />
            New Investigation
          </button>
        </div>
      </div>

      {/* Main Investigation Split View: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Case List (4 cols) */}
        <div className="lg:col-span-4 bg-[#111111] border border-[#292929] divide-y divide-[#292929] overflow-hidden">
          {/* Status Filter Tabs */}
          <div className="p-3 bg-[#171717] border-b border-[#292929] flex items-center gap-1 text-[11px] overflow-x-auto font-mono">
            {['ALL', 'In Progress', 'Needs Review', 'New', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 transition-colors whitespace-nowrap ${
                  statusFilter === st ? 'bg-[#F2D35E] text-[#0A0A0A] font-medium' : 'bg-[#111111] text-[#A0A0A0] border border-[#292929] hover:bg-[#1F1F1F]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="divide-y divide-[#292929] max-h-[700px] overflow-y-auto">
            {filteredInvs.map((inv) => {
              const isSelected = selectedInv?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInv(inv)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#1F1F1F] font-medium' : 'hover:bg-[#171717]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                    <span className="text-[#F2D35E]">{inv.id}</span>
                    <span className={`px-1.5 py-0.2 border text-[10px] ${
                      inv.severity === 'CRITICAL' ? 'border-rose-900 text-[#EF4444] bg-rose-950/40' :
                      inv.severity === 'HIGH' ? 'border-rose-900/60 text-[#F87171] bg-rose-950/20' :
                      'border-[#292929] text-[#A0A0A0]'
                    }`}>
                      {inv.severity}
                    </span>
                  </div>

                  <h3 className="text-xs font-medium text-white mt-1 leading-snug">
                    {inv.title}
                  </h3>

                  <p className="text-[11px] text-[#A0A0A0] font-light mt-1 line-clamp-2 leading-relaxed">
                    {inv.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-[#777777] border-t border-[#292929] pt-2 font-mono">
                    <span>{inv.createdAt.slice(0, 10)}</span>
                    <span className="px-1.5 py-0.5 bg-[#171717] border border-[#292929] text-[#D8D8D8]">
                      {inv.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Case Dossier (8 cols) */}
        {selectedInv ? (
          <div className="lg:col-span-8 bg-[#111111] border border-[#292929] p-6 space-y-6">
            {/* Dossier Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-[#292929] pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#F2D35E] font-medium">{selectedInv.id}</span>
                  <span className="text-[#777777]">•</span>
                  <span className="text-[#A0A0A0]">{selectedInv.createdAt.slice(0, 16).replace('T', ' ')} UTC</span>
                  <span className="text-[#777777]">•</span>
                  <span className="text-[#A0A0A0]">{selectedInv.leadAnalyst}</span>
                </div>
                <h2 className="text-xl font-normal text-white mt-1">
                  {selectedInv.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <select
                  value={selectedInv.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="text-xs bg-[#171717] border border-[#292929] px-2.5 py-1.5 focus:outline-none text-white font-mono"
                >
                  <option value="New">Status: New</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Needs Review">Status: Needs Review</option>
                  <option value="Resolved">Status: Resolved</option>
                </select>

                <button
                  onClick={() => handleExportReport(selectedInv.id)}
                  className="px-3 py-1.5 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:border-[#F2D35E]/50 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  title="Export official Markdown Case Dossier"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#F2D35E]" />
                  Export Dossier
                </button>
              </div>
            </div>

            {/* Case Summary */}
            <div className="p-4 bg-[#171717] border border-[#292929]">
              <div className="text-[11px] font-mono uppercase text-[#F2D35E] tracking-wider mb-1">
                Executive Incident Summary
              </div>
              <p className="text-xs text-[#D8D8D8] leading-relaxed font-light">
                {selectedInv.summary}
              </p>
            </div>

            {/* Involved Entities Badges */}
            <div>
              <div className="text-[11px] font-mono uppercase text-[#777777] tracking-wider mb-2">
                Involved Entities ({selectedInv.involvedEntities.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInv.involvedEntities.map((entId) => (
                  <button
                    key={entId}
                    onClick={() => onNavigateToEntity(entId)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#171717] border border-[#292929] hover:border-[#F2D35E]/50 text-xs font-mono text-white transition-colors"
                  >
                    <span>{entId}</span>
                    <ExternalLink className="w-3 h-3 text-[#F2D35E]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Sections: Observed Facts vs Investigative Hypotheses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Verified Facts */}
              <div className="p-4 border border-[#292929] bg-[#171717]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#10B981] mb-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  Observed Verifiable Facts (Telemetry Proof)
                </div>
                <ul className="text-xs space-y-1.5 text-[#A0A0A0] font-light">
                  {selectedInv.observedFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#10B981] mt-1">&bull;</span>
                      <span className="leading-snug">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hypotheses */}
              <div className="p-4 border border-[#292929] bg-[#171717]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#F59E0B] mb-2 font-mono">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  Investigative Hypotheses (Unverified)
                </div>
                <ul className="text-xs space-y-1.5 text-[#A0A0A0] font-light">
                  {selectedInv.hypotheses.map((hyp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#F59E0B] mt-1">&bull;</span>
                      <span className="leading-snug">{hyp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Evidentiary Limitations & Confidence */}
            <div className="p-4 bg-amber-950/20 border border-amber-900/60 text-xs">
              <div className="flex items-center justify-between text-amber-300 font-mono mb-1">
                <span>Evidentiary Confidence & Analytical Limitations</span>
                <span>Confidence: {Math.round(selectedInv.confidence * 100)}%</span>
              </div>
              <p className="text-[11px] text-[#A0A0A0] leading-relaxed font-light">
                {selectedInv.limitations}
              </p>
            </div>

            {/* Analyst Notes Log */}
            <div className="border-t border-[#292929] pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono text-[#F2D35E] uppercase tracking-wider">
                  Case Activity & Forensic Notes ({selectedInv.notes.length})
                </h3>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[#777777]">Category:</span>
                  <select
                    value={newNoteCategory}
                    onChange={(e: any) => setNewNoteCategory(e.target.value)}
                    className="bg-[#171717] border border-[#292929] px-2 py-1 text-white focus:outline-none"
                  >
                    <option value="OBSERVED_FACT">Observed Fact</option>
                    <option value="HYPOTHESIS">Hypothesis</option>
                    <option value="CORRELATION">Correlation Analysis</option>
                    <option value="CONCLUSION">Conclusion / Remediation</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter analyst note or forensic finding..."
                    className="flex-1 p-2 bg-[#171717] text-[#D8D8D8] border border-[#292929] text-xs font-mono focus:outline-none focus:border-[#F2D35E]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !newNoteText.trim()}
                    className="px-4 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] text-xs font-mono font-medium disabled:opacity-50 flex items-center gap-1.5 self-end py-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Record
                  </button>
                </div>
              </form>

              {/* Notes Timeline */}
              <div className="space-y-3 pt-2">
                {selectedInv.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-[#171717] border border-[#292929] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#777777] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{note.author}</span>
                        <span className="px-1.5 py-0.2 bg-[#111111] border border-[#292929] text-[9px] text-[#F2D35E]">
                          {note.category}
                        </span>
                      </div>
                      <span>{note.timestamp.slice(0, 16).replace('T', ' ')}</span>
                    </div>
                    <p className="text-[#D8D8D8] leading-relaxed font-light pt-1">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#111111] border border-[#292929] p-12 text-center text-[#777777] text-xs font-mono">
            Select an investigation from the list to inspect case evidence.
          </div>
        )}
      </div>

      {/* Interactive Modal: New Investigation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#292929] max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#292929] pb-3">
              <h3 className="text-sm font-medium text-white font-mono">Initiate New Forensic Investigation</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#777777] hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateInvestigation} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#A0A0A0] mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lateral Movement Anomaly on Domain Controller"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 bg-[#171717] text-white border border-[#292929] focus:outline-none focus:border-[#F2D35E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A0A0] mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e: any) => setNewSeverity(e.target.value)}
                    className="w-full p-2 bg-[#171717] text-white border border-[#292929] focus:outline-none"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A0A0A0] mb-1">Lead Analyst</label>
                  <input
                    type="text"
                    value={newLead}
                    onChange={(e) => setNewLead(e.target.value)}
                    className="w-full p-2 bg-[#171717] text-white border border-[#292929] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-1">Involved Entities (comma separated)</label>
                <input
                  type="text"
                  value={newEntities}
                  onChange={(e) => setNewEntities(e.target.value)}
                  placeholder="user:username, host:hostname, ip:1.2.3.4"
                  className="w-full p-2 bg-[#171717] text-white border border-[#292929] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-1">Initial Summary / Evidence Observed</label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe initial behavioral trigger or security telemetry anomaly..."
                  className="w-full p-2 bg-[#171717] text-white border border-[#292929] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#292929]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 border border-[#292929] text-[#A0A0A0] hover:bg-[#171717]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] font-medium"
                >
                  Open Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
