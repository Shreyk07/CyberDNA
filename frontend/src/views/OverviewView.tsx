import React from 'react';
import {
  ShieldAlert,
  Fingerprint,
  Activity,
  Layers,
  ArrowUpRight,
  AlertTriangle,
  Server,
  CheckCircle2,
  Users,
  HardDrive,
  FileText,
  Clock,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface OverviewViewProps {
  stats: any;
  onNavigateToEntity: (entityId: string) => void;
  onNavigateToInvestigation: (invId: string) => void;
  onNavigateToView: (view: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  onNavigateToEntity,
  onNavigateToInvestigation,
  onNavigateToView
}) => {
  if (!stats) {
    return (
      <div className="p-8 flex items-center justify-center text-[#A0A0A0] text-sm font-mono">
        <Activity className="w-4 h-4 animate-spin mr-2 text-[#F2D35E]" />
        Loading organizational telemetry baselines...
      </div>
    );
  }

  const {
    organizationName = 'Apex Global Technologies (Fictional)',
    isSyntheticDemo = true,
    demoNotice = 'DEMO ENVIRONMENT: Operating on synthetic behavioral telemetry conforming to CERT Insider Threat Test Dataset schemas. Ground-truth research datasets remain isolated.',
    totalEmployees = 12,
    totalEventsProcessed = 2173,
    totalProfilesGenerated = 12,
    anomaliesIdentified = 3,
    pendingFindingsReviewCount = 3,
    openInvestigationsCount = 3,
    activityByCategory = {
      logonLogoff: 780,
      fileActivity: 690,
      removableDevice: 8,
      webCloud: 510,
      emailActivity: 185
    },
    departmentSummaries = [],
    volumeTrends = [],
    topDeviatingEmployees = [],
    recentInvestigations = [],
    pipelineMetadata = {}
  } = stats;

  const statCards = [
    {
      label: 'Total Employees',
      value: totalEmployees.toString(),
      subtext: 'Across 6 departments',
      icon: Users,
      color: 'text-white'
    },
    {
      label: 'Total Activity Events',
      value: totalEventsProcessed.toLocaleString(),
      subtext: 'Cleaned and processed',
      icon: Activity,
      color: 'text-white'
    },
    {
      label: 'Unusual Activities Detected',
      value: anomaliesIdentified.toString(),
      subtext: 'Flagged by security rules',
      icon: AlertTriangle,
      color: 'text-[#F2D35E]',
      highlight: true
    },
    {
      label: 'Alerts Requiring Review',
      value: pendingFindingsReviewCount.toString(),
      subtext: 'Needs analyst review',
      icon: Clock,
      color: 'text-[#F2D35E]'
    },
    {
      label: 'Employee Profiles',
      value: totalProfilesGenerated.toString(),
      subtext: 'Activity summaries',
      icon: Fingerprint,
      color: 'text-white'
    },
    {
      label: 'Active Cases',
      value: openInvestigationsCount.toString(),
      subtext: 'Investigations in progress',
      icon: ShieldAlert,
      color: 'text-white'
    }
  ];

  const categoryBarData = [
    { name: 'Logon / Logoff', count: activityByCategory.logonLogoff || 0 },
    { name: 'File Access / Copy', count: activityByCategory.fileActivity || 0 },
    { name: 'Web & Cloud', count: activityByCategory.webCloud || 0 },
    { name: 'Removable USB', count: activityByCategory.removableDevice || 0 },
    { name: 'Email Activity', count: activityByCategory.emailActivity || 0 }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#0A0A0A] text-[#D8D8D8] animate-fade-in">
      {/* Synthetic Demo Banner Notice */}
      {isSyntheticDemo && (
        <div className="bg-[#141414] border border-[#292929] border-l-2 border-l-[#F2D35E] p-3 text-xs text-[#A0A0A0] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#F2D35E] shrink-0" />
            <span>
              <strong className="text-white uppercase font-mono tracking-wider mr-1.5">[Synthetic Demo Dataset]</strong>
              {demoNotice}
            </span>
          </div>
          <span className="shrink-0 text-[10px] font-mono text-[#777777] border border-[#292929] px-2 py-0.5">
            Apex Global Technologies
          </span>
        </div>
      )}

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">
            Employee Activity Monitoring
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-white mt-1">
            Activity & Security <span className="italic text-[#F2D35E]">Overview</span>
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1.5 font-light max-w-2xl leading-relaxed">
            Monitoring employee activity records across the company. The platform summarizes daily activity and flags unusual actions—such as unexpected login hours, heavy file access, or USB usage—for human review.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono bg-[#111111] border border-[#292929] text-[#10B981]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            Pipeline Engine: PySpark & PyArrow
          </span>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 bg-[#111111] border transition-all ${
                card.highlight
                  ? 'border-[#52441A] bg-[#14120A] shadow-[0_0_15px_rgba(242,211,94,0.06)]'
                  : 'border-[#292929] hover:border-[#3E3E3E]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#777777] mb-2 font-mono">
                <span className="truncate">{card.label}</span>
                <Icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
              <div className={`text-2xl font-mono font-medium ${card.color}`}>
                {card.value}
              </div>
              <div className="text-[10px] text-[#A0A0A0] mt-1 truncate">
                {card.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid: Activity Volume Over Time & Activity Breakdown by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Volume Over Time */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#292929] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
                Activity Volume Over Time
              </h2>
              <p className="text-[11px] text-[#777777] font-light">
                Daily activity events across all monitored workstations and servers
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#F2D35E] border border-[#52441A] bg-[#1A180D] px-2 py-0.5">
              18-Day Observation Window
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeTrends}>
                <XAxis
                  dataKey="date"
                  stroke="#555555"
                  tick={{ fill: '#777777', fontSize: 10, fontFamily: 'monospace' }}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis
                  stroke="#555555"
                  tick={{ fill: '#777777', fontSize: 10, fontFamily: 'monospace' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#292929',
                    color: '#D8D8D8',
                    fontSize: 11,
                    fontFamily: 'monospace'
                  }}
                  formatter={(val: any) => [`${val} events`, 'Volume']}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                />
                <Bar dataKey="count" fill="#F2D35E" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Breakdown by Category */}
        <div className="lg:col-span-5 bg-[#111111] border border-[#292929] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
                Activity Breakdown by Type
              </h2>
              <p className="text-[11px] text-[#777777] font-light">
                Distribution of recorded events across activity types
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {categoryBarData.map((cat, idx) => {
              const maxVal = Math.max(...categoryBarData.map(c => c.count), 1);
              const pct = Math.round((cat.count / maxVal) * 100);
              const isRemovable = cat.name.includes('Removable');

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#A0A0A0]">{cat.name}</span>
                    <span className={isRemovable && cat.count > 0 ? 'text-[#F2D35E] font-semibold' : 'text-white'}>
                      {cat.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#1A1A1A] border border-[#292929]">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isRemovable && cat.count > 0 ? 'bg-[#F2D35E]' : 'bg-[#555555]'
                      }`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#1F1F1F] text-[11px] text-[#777777]">
            <span className="text-[#F2D35E] font-medium">* Note: </span>
            Removable USB connections are strictly restricted by corporate policy, rendering any non-zero count a high-priority deviation vector.
          </div>
        </div>
      </div>

      {/* Department Summaries Table & Top Deviating Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Summaries */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#292929] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
              Department Activity Summaries
            </h2>
            <button
              onClick={() => onNavigateToView('entities')}
              className="text-xs text-[#F2D35E] hover:underline flex items-center gap-1 font-mono"
            >
              View all employees <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#141414] border-b border-[#292929] text-[10px] text-[#777777] uppercase">
                <tr>
                  <th className="p-2.5">Department</th>
                  <th className="p-2.5">Employees</th>
                  <th className="p-2.5">Total Activity</th>
                  <th className="p-2.5 text-right">Anomalies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {departmentSummaries.length > 0 ? (
                  departmentSummaries.map((dept: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#161616] text-[#A0A0A0]">
                      <td className="p-2.5 text-white font-medium">{dept.department}</td>
                      <td className="p-2.5">{dept.employeesCount} staff</td>
                      <td className="p-2.5">{dept.eventsCount.toLocaleString()} events</td>
                      <td className="p-2.5 text-right">
                        {dept.anomalousCount > 0 ? (
                          <span className="px-2 py-0.5 bg-[#3D1414] text-[#FF7A7A] border border-[#5E1E1E] text-[10px]">
                            {dept.anomalousCount} FLAGGED
                          </span>
                        ) : (
                          <span className="text-[#10B981] text-[10px]">NORMAL</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-[#777777]">
                      Computing department baselines...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Deviating Employees */}
        <div className="lg:col-span-5 bg-[#111111] border border-[#292929] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
              Employees with Unusual Activity
            </h2>
            <button
              onClick={() => onNavigateToView('findings')}
              className="text-xs text-[#F2D35E] hover:underline flex items-center gap-1 font-mono"
            >
              Security alerts <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topDeviatingEmployees.map((emp: any) => {
              const isHigh = emp.deviationIndex >= 70;
              return (
                <div
                  key={emp.id}
                  onClick={() => onNavigateToEntity(emp.id)}
                  className="p-3 bg-[#141414] border border-[#292929] hover:border-[#F2D35E] cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-medium text-white flex items-center gap-2">
                      <span>{emp.name || emp.label}</span>
                      {emp.employmentStatus === 'NOTICE_PERIOD' && (
                        <span className="px-1.5 py-0.2 bg-[#3D2C12] text-[#F2D35E] text-[9px] border border-[#52441A]">
                          NOTICE PERIOD
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#777777] font-mono mt-0.5">
                      {emp.department} • {emp.role}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-mono font-bold ${isHigh ? 'text-[#FF7A7A]' : 'text-[#F2D35E]'}`}>
                      Deviation {emp.deviationIndex}%
                    </div>
                    <div className="text-[10px] text-[#777777] font-mono">
                      {emp.anomalous ? 'FLAGGED FOR REVIEW' : 'TYPICAL'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Forensic Investigations Workspace Teaser */}
      <div className="bg-[#111111] border border-[#292929] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
              Active Security Investigations
            </h2>
            <p className="text-[11px] text-[#777777] font-light">
              Unusual activity cases under active review
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('investigations')}
            className="px-3 py-1 bg-[#171717] border border-[#292929] text-xs text-[#D8D8D8] hover:text-[#F2D35E] hover:border-[#F2D35E] transition-colors font-mono flex items-center gap-1.5"
          >
            Open Case Workspace <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentInvestigations.slice(0, 3).map((inv: any) => (
            <div
              key={inv.id}
              onClick={() => onNavigateToInvestigation(inv.id)}
              className="p-4 bg-[#141414] border border-[#292929] hover:border-[#3E3E3E] cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#F2D35E]">{inv.id}</span>
                <span className="px-1.5 py-0.5 bg-[#1F1F1F] text-white border border-[#292929]">
                  {inv.status}
                </span>
              </div>
              <h3 className="text-xs font-medium text-white line-clamp-2">
                {inv.title}
              </h3>
              <p className="text-[11px] text-[#A0A0A0] line-clamp-2 font-light">
                {inv.summary}
              </p>
              <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between text-[10px] text-[#777777] font-mono">
                <span>Confidence: {Math.round((inv.confidence || 0.85) * 100)}%</span>
                <span className="text-[#F2D35E] flex items-center gap-1">
                  Examine case <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
