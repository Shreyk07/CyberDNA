import React, { useState } from 'react';
import {
  Sliders,
  Server,
  RefreshCw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:3001/api');
  const [zScoreThreshold, setZScoreThreshold] = useState('2.5');
  const [contamination, setContamination] = useState('0.15');
  const [minEvents, setMinEvents] = useState('10');
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function handleTestConnection() {
    setIsChecking(true);
    try {
      const res = await fetch('http://localhost:3001/health');
      if (res.ok) {
        const json = await res.json();
        setConnectionStatus(`Connected: ${json.system} (${json.status})`);
      } else {
        setConnectionStatus(`Server responded with code ${res.status}`);
      }
    } catch (err: any) {
      setConnectionStatus(`Connection error: ${err.message}`);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#777777] uppercase">Platform Configuration</div>
          <h1 className="text-3xl font-light tracking-tight text-[#D8D8D8] mt-1 font-serif">Settings & Research Parameters</h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-light max-w-2xl leading-relaxed">
            Adjust behavioral sensitivity thresholds, machine learning contamination hyperparameters, backend connection endpoints, and academic research configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 bg-[#111111] border border-[#292929] text-[#A0A0A0]">
            v1.0.0 Research Release
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend & Connectivity */}
        <div className="p-6 bg-[#111111] border border-[#292929] space-y-4">
          <div className="border-b border-[#292929] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-[#D8D8D8]">API Endpoint & Connectivity</h3>
              <p className="text-[11px] text-[#777777]">Node.js Express + Python Analytics Bridge</p>
            </div>
            <Server className="w-4 h-4 text-[#777777]" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#A0A0A0] mb-1 font-mono">API Base URL</label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full p-2 bg-[#171717] border border-[#292929] text-[#D8D8D8] font-mono focus:outline-none focus:border-[#F2D35E]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleTestConnection}
                disabled={isChecking}
                className="px-3 py-1.5 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:bg-[#202020] text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                Test Health Endpoint
              </button>

              {connectionStatus && (
                <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/30">
                  {connectionStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Statistical & ML Sensitivity */}
        <div className="p-6 bg-[#111111] border border-[#292929] space-y-4">
          <div className="border-b border-[#292929] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-[#D8D8D8]">Behavioral Baseline Thresholds</h3>
              <p className="text-[11px] text-[#777777]">Sensitivity factors for Z-score and Isolation Forest</p>
            </div>
            <Sliders className="w-4 h-4 text-[#777777]" />
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-[#A0A0A0] mb-1">
                <span>Z-Score Anomaly Threshold (&sigma;):</span>
                <span className="font-mono text-[#F2D35E] font-medium">{zScoreThreshold} &sigma;</span>
              </div>
              <select
                value={zScoreThreshold}
                onChange={(e) => setZScoreThreshold(e.target.value)}
                className="w-full p-2 bg-[#171717] border border-[#292929] text-[#D8D8D8] font-mono focus:outline-none focus:border-[#F2D35E]"
              >
                <option value="2.0">2.0 &sigma; (High Sensitivity - Flag 95.4% bounds)</option>
                <option value="2.5">2.5 &sigma; (Balanced - Institutional Baseline Standard)</option>
                <option value="3.0">3.0 &sigma; (Conservative - Flag extreme 99.7% bounds)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[#A0A0A0] mb-1">
                <span>Isolation Forest Contamination:</span>
                <span className="font-mono text-[#F2D35E] font-medium">{contamination}</span>
              </div>
              <select
                value={contamination}
                onChange={(e) => setContamination(e.target.value)}
                className="w-full p-2 bg-[#171717] border border-[#292929] text-[#D8D8D8] font-mono focus:outline-none focus:border-[#F2D35E]"
              >
                <option value="0.05">0.05 (5% Expected Contamination)</option>
                <option value="0.10">0.10 (10% Expected Contamination)</option>
                <option value="0.15">0.15 (15% Research Default)</option>
                <option value="0.20">0.20 (20% Aggressive Outlier Flagging)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[#A0A0A0] mb-1">
                <span>Minimum Events for Baseline:</span>
                <span className="font-mono text-[#F2D35E] font-medium">{minEvents} events</span>
              </div>
              <input
                type="number"
                min="5"
                max="50"
                value={minEvents}
                onChange={(e) => setMinEvents(e.target.value)}
                className="w-full p-2 bg-[#171717] border border-[#292929] text-[#D8D8D8] font-mono focus:outline-none focus:border-[#F2D35E]"
              />
              <span className="text-[10px] text-[#777777] block mt-1 font-mono">
                Enforces safeguard: entities under this volume are marked INSUFFICIENT_HISTORY.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Portfolio & Project Attribution */}
      <div className="p-6 bg-[#111111] border border-[#292929] space-y-4">
        <div className="border-b border-[#292929] pb-3">
          <h3 className="text-sm font-normal text-[#D8D8D8]">CyberDNA Master's in Cybersecurity Academic Attribution</h3>
          <p className="text-[11px] text-[#777777]">Project objectives, scope, and forensic principles</p>
        </div>

        <div className="text-xs text-[#A0A0A0] space-y-2 leading-relaxed font-light">
          <p>
            <strong className="text-[#D8D8D8] font-normal">Thesis Premise:</strong> Modern enterprise intrusions operate within valid access credentials and native operating system tools (Living off the Land). Static rule-based detections yield excessive false positives or fail against novel lateral movement.
          </p>
          <p>
            <strong className="text-[#D8D8D8] font-normal">Core CyberDNA Innovation:</strong> Builds continuous behavioral fingerprints across users, devices, servers, and domains. Distinguishes observed facts from hypotheses and empowers digital forensics investigators with verified telemetry evidence.
          </p>
          <div className="pt-3 border-t border-[#292929] flex items-center justify-between text-[11px] font-mono text-[#777777]">
            <span>Author: Master's in Cybersecurity Candidate Monish</span>
            <span>Academic Year 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
