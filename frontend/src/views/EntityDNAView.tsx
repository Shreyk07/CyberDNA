import React, { useState, useEffect } from 'react';
import {
  Search,
  Fingerprint,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  X,
  Info,
  User,
  HardDrive,
  Briefcase,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { EmployeeSummary, BehavioralProfile, FeatureDeviation, ActivityEvent } from '../types';
import { api } from '../services/api';

interface EntityDNAViewProps {
  initialEntityId?: string | null;
  onNavigateToInvestigation: (invId: string) => void;
  onCreateInvestigationFromEntity: (entityId: string) => void;
}

export const EntityDNAView: React.FC<EntityDNAViewProps> = ({
  initialEntityId,
  onNavigateToInvestigation,
  onCreateInvestigationFromEntity
}) => {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(initialEntityId || null);
  const [employeeDetail, setEmployeeDetail] = useState<{ employee: EmployeeSummary; profile?: BehavioralProfile } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'fingerprint' | 'features' | 'events'>('fingerprint');
  const [employeeEvents, setEmployeeEvents] = useState<ActivityEvent[]>([]);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [filterAnomalous, setFilterAnomalous] = useState(false);
  const [sortBy, setSortBy] = useState<'bdi' | 'risk' | 'events'>('bdi');

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (initialEntityId) {
      setSelectedEntityId(initialEntityId);
    }
  }, [initialEntityId]);

  useEffect(() => {
    if (selectedEntityId) {
      loadEmployeeDetail(selectedEntityId);
    } else {
      setEmployeeDetail(null);
    }
  }, [selectedEntityId]);

  async function loadEmployees() {
    setLoading(true);
    try {
      const data = await api.getEmployees();
      setEmployees(data);
      if (data.length > 0 && !selectedEntityId && !initialEntityId) {
        setSelectedEntityId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadEmployeeDetail(id: string) {
    setDetailLoading(true);
    try {
      const data = await api.getEmployeeDetail(id);
      setEmployeeDetail({ employee: data.employee || data.entity, profile: data.profile });

      const evts = await api.getEvents({ employeeId: id, limit: 40 });
      setEmployeeEvents(evts.events);
    } catch (err) {
      console.error('Failed to load employee detail:', err);
    } finally {
      setDetailLoading(false);
    }
  }

  const departments = ['ALL', 'Finance', 'Engineering', 'IT Operations', 'Human Resources', 'Legal & Compliance', 'Sales & Accounts'];

  const filteredEmployees = employees.filter(emp => {
    if (selectedDepartment !== 'ALL' && emp.department !== selectedDepartment) return false;
    if (filterAnomalous && !emp.anomalous && emp.deviationIndex < 50) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        emp.id.toLowerCase().includes(q) ||
        emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'bdi') return b.deviationIndex - a.deviationIndex;
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    return b.eventCount - a.eventCount;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-[#0A0A0A] text-[#D8D8D8] animate-fade-in">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">
            Employee Directory & Activity Profiles
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-white mt-1">
            Employee <span className="italic text-[#F2D35E]">Profiles & Activity</span>
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1.5 font-light max-w-2xl leading-relaxed">
            Directory of fictional employees across Finance, Engineering, IT, HR, Legal, and Sales. Click any employee to view their activity summary, working hours, and any flagged alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterAnomalous(!filterAnomalous)}
            className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
              filterAnomalous
                ? 'bg-[#F2D35E] text-[#0A0A0A] border-[#F2D35E] font-medium'
                : 'bg-[#111111] text-[#A0A0A0] border-[#292929] hover:bg-[#171717]'
            }`}
          >
            {filterAnomalous ? 'Showing Flagged Employees' : 'Filter: Unusual Activity Only'}
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 bg-[#111111] border border-[#292929] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              placeholder="Search employee name, department, role, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#171717] text-[#D8D8D8] border border-[#292929] text-xs font-mono focus:outline-none focus:border-[#F2D35E]"
            />
          </div>

          {/* Department Filter Selector */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-[#171717] border border-[#292929] px-3 py-1.5 text-xs text-[#D8D8D8] focus:outline-none focus:border-[#F2D35E] font-mono"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'ALL' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-[#A0A0A0] font-mono">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#171717] border border-[#292929] px-2.5 py-1 text-xs text-white focus:outline-none font-mono"
          >
            <option value="bdi">Behavioral Deviation (BDI)</option>
            <option value="risk">Risk Score</option>
            <option value="events">Activity Volume</option>
          </select>
        </div>
      </div>

      {/* Main Employees Table */}
      <div className="bg-[#111111] border border-[#292929] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292929] bg-[#171717] text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Activity Events</th>
                <th className="py-3 px-4 text-right">Profile Status</th>
                <th className="py-3 px-4 text-right">Unusual Activity %</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929] text-xs font-mono">
              {filteredEmployees.map((emp) => {
                const isHigh = emp.deviationIndex >= 50;
                const isSelected = selectedEntityId === emp.id;

                return (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEntityId(emp.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#1A1A1A] font-medium'
                        : 'hover:bg-[#161616]'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-3.5 h-3.5 text-[#F2D35E] shrink-0" />
                        <div>
                          <div className="text-white font-sans font-medium">{emp.name}</div>
                          <div className="text-[10px] text-[#777777] font-mono">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#D8D8D8] font-sans">{emp.role}</div>
                      <div className="text-[10px] text-[#777777] font-mono">{emp.department} • {emp.orgUnit}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 border font-mono ${
                        emp.employmentStatus === 'NOTICE_PERIOD'
                          ? 'border-[#52441A] bg-[#2E2812] text-[#F2D35E]'
                          : 'border-[#292929] bg-[#171717] text-[#A0A0A0]'
                      }`}>
                        {emp.employmentStatus === 'NOTICE_PERIOD' ? 'NOTICE PERIOD' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-white">
                      {emp.eventCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-[10px] px-2 py-0.5 border ${
                        emp.profileStatus === 'PROFILED'
                          ? 'border-[#292929] bg-[#171717] text-[#10B981]'
                          : 'border-amber-900 bg-amber-950/40 text-[#F59E0B]'
                      }`}>
                        {emp.profileStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`font-mono font-medium ${isHigh ? 'text-[#F2D35E]' : 'text-white'}`}>
                          {emp.deviationIndex}
                        </span>
                        <div className="w-12 bg-[#171717] h-1.5 overflow-hidden border border-[#292929]">
                          <div
                            className={`h-full ${isHigh ? 'bg-[#F2D35E]' : 'bg-[#777777]'}`}
                            style={{ width: `${Math.min(100, emp.deviationIndex)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntityId(emp.id);
                        }}
                        className="px-2.5 py-1 text-[11px] border border-[#292929] bg-[#171717] hover:border-[#F2D35E] text-[#D8D8D8] inline-flex items-center gap-1 font-mono"
                      >
                        Profile <ArrowUpRight className="w-3 h-3 text-[#F2D35E]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Profile Drawer / Behavioral Dossier */}
      {selectedEntityId && employeeDetail && (
        <div className="bg-[#111111] border-2 border-[#F2D35E]/40 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-[#292929] pb-4 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl text-white">
                  {employeeDetail.employee.name}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 bg-[#171717] border border-[#292929] text-[#F2D35E]">
                  {employeeDetail.employee.id}
                </span>
                {employeeDetail.employee.employmentStatus === 'NOTICE_PERIOD' && (
                  <span className="text-[11px] px-2 py-0.5 bg-[#2E2812] border border-[#52441A] text-[#F2D35E] font-mono">
                    NOTICE PERIOD (HIGH ATTENTION)
                  </span>
                )}
                {employeeDetail.profile?.isAnomalous && (
                  <span className="text-[11px] px-2 py-0.5 bg-[#3D1414] border border-[#5E1E1E] text-[#FF7A7A] font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    BEHAVIORAL ANOMALY FLAGGED
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A0A0A0] mt-1 font-mono">
                {employeeDetail.employee.role} • {employeeDetail.employee.department} ({employeeDetail.employee.orgUnit}) • Devices: {employeeDetail.employee.associatedDevices?.join(', ') || 'WS-01'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onCreateInvestigationFromEntity(employeeDetail.employee.id)}
                className="px-3 py-1.5 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Initiate Case Investigation
              </button>
              <button
                onClick={() => setSelectedEntityId(null)}
                className="p-1.5 text-[#777777] hover:text-white hover:bg-[#171717] border border-[#292929]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Epistemic Reminder */}
          <div className="bg-[#141414] border border-[#292929] p-3 text-xs text-[#A0A0A0] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#F2D35E] shrink-0" />
            <span>
              <strong>Reviewer Note: </strong>
              Unusual activity indicators are alerts for human review. They help security teams verify if activity was authorized, not prove employee wrongdoing.
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#292929] space-x-6 text-xs font-mono">
            <button
              onClick={() => setActiveTab('fingerprint')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'fingerprint' ? 'text-[#F2D35E] font-medium border-b-2 border-[#F2D35E]' : 'text-[#777777] hover:text-white'
              }`}
            >
              Activity Hours & Histogram
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'features' ? 'text-[#F2D35E] font-medium border-b-2 border-[#F2D35E]' : 'text-[#777777] hover:text-white'
              }`}
            >
              Activity Breakdown & Metrics ({employeeDetail.profile?.featureDeviations.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'events' ? 'text-[#F2D35E] font-medium border-b-2 border-[#F2D35E]' : 'text-[#777777] hover:text-white'
              }`}
            >
              Recent Activity Log ({employeeEvents.length})
            </button>
          </div>

          {/* TAB 1: Diurnal Histogram & Baseline Analysis */}
          {activeTab === 'fingerprint' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#141414] border border-[#292929] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#F2D35E] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-white font-mono">Employee Activity Summary</div>
                  <p className="text-xs text-[#D8D8D8] mt-1 leading-relaxed font-light">
                    {employeeDetail.profile?.explanation}
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-[#777777] flex flex-wrap gap-4">
                    <span>Unusual Activity Score: <strong className="text-white">{employeeDetail.profile?.behavioralDeviationIndex} / 100</strong></span>
                    <span>Risk Level: <strong className="text-[#F2D35E]">{employeeDetail.profile?.isolationForestRiskScore ?? employeeDetail.employee.riskScore} / 100</strong></span>
                    <span>Baseline Records: <strong className="text-white">{employeeDetail.profile?.baselineEventCount || 0}</strong></span>
                    <span>Recent Records: <strong className="text-white">{employeeDetail.profile?.currentEventCount || 0}</strong></span>
                  </div>
                </div>
              </div>

              {/* 24-Hour Activity Baseline vs Current */}
              <div className="p-4 border border-[#292929] bg-[#141414]">
                <div className="flex items-center justify-between mb-3 border-b border-[#292929] pb-2">
                  <div>
                    <h4 className="text-xs font-medium text-white font-mono">24-Hour Activity Pattern</h4>
                    <p className="text-[11px] text-[#777777]">Comparing typical daily activity hours against recent activity</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#333333] inline-block" /> Historical Baseline
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#F2D35E] inline-block" /> Current Window
                    </span>
                  </div>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(employeeDetail.profile?.hourlyBaseline || []).map((val, h) => ({
                        hour: `${h.toString().padStart(2, '0')}:00`,
                        baseline: val,
                        current: employeeDetail.profile?.hourlyCurrent?.[h] || 0
                      }))}
                    >
                      <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#777777', fontFamily: 'monospace' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: '#777777', fontFamily: 'monospace' }} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111111',
                          border: '1px solid #292929',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          color: '#D8D8D8'
                        }}
                      />
                      <Bar dataKey="baseline" fill="#333333" barSize={8} name="Historical Baseline" />
                      <Bar dataKey="current" fill="#F2D35E" barSize={8} name="Current Window" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Quantitative Feature Deviations */}
          {activeTab === 'features' && (
            <div className="overflow-x-auto border border-[#292929]">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[#292929] bg-[#171717] text-[10px] text-[#777777] uppercase">
                    <th className="py-2.5 px-3">Activity Metric</th>
                    <th className="py-2.5 px-3 text-right">Baseline Average</th>
                    <th className="py-2.5 px-3 text-right">Observed Value</th>
                    <th className="py-2.5 px-3 text-right">Change</th>
                    <th className="py-2.5 px-3 text-right">Deviation</th>
                    <th className="py-2.5 px-3 text-center">Alert Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929]">
                  {(employeeDetail.profile?.featureDeviations || []).map((feat, idx) => {
                    const isSevere = feat.severity === 'HIGH';
                    return (
                      <tr key={idx} className="hover:bg-[#161616] text-[#A0A0A0]">
                        <td className="py-2.5 px-3 text-white font-medium">{feat.feature}</td>
                        <td className="py-2.5 px-3 text-right">{feat.baseline_value}</td>
                        <td className="py-2.5 px-3 text-right text-white font-medium">{feat.current_value}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={feat.percentage_change > 0 ? 'text-[#F2D35E]' : 'text-[#A0A0A0]'}>
                            {feat.percentage_change > 0 ? `+${feat.percentage_change}%` : `${feat.percentage_change}%`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-white font-semibold">
                          +{feat.z_score.toFixed(2)} σ
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 text-[10px] border ${
                            isSevere
                              ? 'bg-[#3D1414] text-[#FF7A7A] border-[#5E1E1E]'
                              : feat.severity === 'MEDIUM'
                              ? 'bg-[#2E2812] text-[#F2D35E] border-[#52441A]'
                              : 'bg-[#171717] text-[#A0A0A0] border-[#292929]'
                          }`}>
                            {feat.severity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Event Telemetry */}
          {activeTab === 'events' && (
            <div className="overflow-x-auto border border-[#292929]">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[#292929] bg-[#171717] text-[10px] text-[#777777] uppercase">
                    <th className="py-2.5 px-3">Event ID</th>
                    <th className="py-2.5 px-3">Timestamp (UTC)</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Target / Process</th>
                    <th className="py-2.5 px-3">Destination IP</th>
                    <th className="py-2.5 px-3 text-right">Bytes Transferred</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929]">
                  {employeeEvents.map((evt) => (
                    <tr key={evt.event_id} className="hover:bg-[#161616] text-[#A0A0A0]">
                      <td className="py-2.5 px-3 text-[#F2D35E]">{evt.event_id}</td>
                      <td className="py-2.5 px-3 text-[11px]">{new Date(evt.timestamp).toUTCString().slice(5, 25)}</td>
                      <td className="py-2.5 px-3 text-white">{evt.event_type}</td>
                      <td className="py-2.5 px-3 truncate max-w-xs">{evt.process_name || evt.target_resource}</td>
                      <td className="py-2.5 px-3">{evt.destination_ip}</td>
                      <td className="py-2.5 px-3 text-right text-white">
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
      )}
    </div>
  );
};
