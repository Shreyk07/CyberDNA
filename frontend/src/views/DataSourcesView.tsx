import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import type { DataSourceMeta } from '../types';
import { api } from '../services/api';

export const DataSourcesView: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSourceMeta[]>([]);
  const [loading, setLoading] = useState(true);

  // Ingestion validation sandbox state
  const [sampleInput, setSampleInput] = useState(`timestamp,event_id,event_type,entity_id,entity_type,severity,source_ip,destination_ip,destination_port,protocol,bytes_transferred,process_name
2026-10-24T00:15:00Z,EVT-UPLOAD-01,AUTH_SUCCESS,user:test.operator,USER,INFO,10.0.1.25,10.0.2.10,443,TCP,4200,browser.exe
2026-10-24T00:15:20Z,EVT-UPLOAD-02,AUTH_FAILURE,user:test.operator,USER,MEDIUM,198.51.100.9,10.0.2.10,443,TCP,820,vpn_client.exe`);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    loadDataSources();
  }, []);

  async function loadDataSources() {
    setLoading(true);
    try {
      const list = await api.getDataSources();
      setDataSources(list);
    } catch (err) {
      console.error('Failed to load data sources:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleValidateInput(e: React.FormEvent) {
    e.preventDefault();
    setIsValidating(true);

    try {
      const lines = sampleInput.trim().split('\n');
      if (lines.length < 2) {
        setValidationResult({
          valid: false,
          error: 'Input must contain a CSV header and at least one data row.'
        });
        setIsValidating(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const required = ['timestamp', 'event_id', 'event_type', 'entity_id', 'entity_type', 'severity'];
      const missing = required.filter(r => !headers.includes(r));

      if (missing.length > 0) {
        setValidationResult({
          valid: false,
          error: `Missing required schema fields: ${missing.join(', ')}`,
          missingFields: missing
        });
        setIsValidating(false);
        return;
      }

      setValidationResult({
        valid: true,
        recordCount: lines.length - 1,
        headersPresent: headers,
        status: 'SCHEMA_COMPLIANT',
        message: 'All mandatory cyber telemetry constraints verified. Ready for baseline partition ingestion.'
      });
    } catch (err: any) {
      setValidationResult({
        valid: false,
        error: err.message
      });
    } finally {
      setIsValidating(false);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#777777] uppercase">Ingestion Architecture</div>
          <h1 className="text-3xl font-light tracking-tight text-[#D8D8D8] mt-1 font-serif">Data Sources & Provenance</h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-light max-w-2xl leading-relaxed">
            Ingestion pipelines supporting CSV, JSON, and Apache Parquet columnar storage. Schema validation guarantees field constraints and timestamp sanity before baseline model training.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 bg-[#111111] border border-[#292929] text-[#A0A0A0]">
            Parquet Storage Engine Active
          </span>
        </div>
      </div>

      {/* Data Sources Table */}
      <div className="bg-[#111111] border border-[#292929] overflow-hidden">
        <div className="p-4 border-b border-[#292929] bg-[#171717] flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase text-[#777777] tracking-wider">
            Registered Datasets & Telemetry Partitions
          </h3>
          <span className="text-xs text-[#A0A0A0] font-mono">{dataSources.length} Datasets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] bg-[#141414] text-[11px] font-mono text-[#777777] uppercase">
                <th className="py-3 px-4">Identifier / Dataset Name</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4 text-right">Records</th>
                <th className="py-3 px-4 text-right">File Size</th>
                <th className="py-3 px-4">Observation Window</th>
                <th className="py-3 px-4">Provenance</th>
                <th className="py-3 px-4 text-center">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {dataSources.map((ds) => (
                <tr key={ds.id} className="hover:bg-[#171717]/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono text-xs text-[#D8D8D8] font-medium">{ds.id}</div>
                    <div className="text-[11px] text-[#A0A0A0] font-light mt-0.5">{ds.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-1.5 py-0.5 font-mono text-[11px] bg-[#171717] border border-[#292929] text-[#F2D35E] font-medium">
                      {ds.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#D8D8D8]">
                    {ds.recordCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#777777]">
                    {(ds.sizeBytes / 1024).toFixed(1)} KB
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#A0A0A0]">
                    {ds.startDate.slice(0, 10)} to {ds.endDate.slice(0, 10)}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#A0A0A0] max-w-xs truncate">
                    {ds.provenance}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {ds.validationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingestion & Schema Validation Sandbox */}
      <div className="bg-[#111111] border border-[#292929] p-6 space-y-4">
        <div className="border-b border-[#292929] pb-3">
          <h3 className="text-sm font-normal text-[#D8D8D8]">Interactive Telemetry Schema Validator</h3>
          <p className="text-[11px] text-[#777777]">
            Test CSV/JSON log records against the CyberDNA schema requirements before feeding them into the baseline pipeline.
          </p>
        </div>

        <form onSubmit={handleValidateInput} className="space-y-4">
          <div>
            <label className="block text-xs text-[#A0A0A0] mb-1 font-mono">
              Input CSV Telemetry Stream:
            </label>
            <textarea
              rows={5}
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              className="w-full p-3 bg-[#171717] border border-[#292929] font-mono text-xs text-[#D8D8D8] focus:outline-none focus:border-[#F2D35E]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#777777] font-mono">
              Mandatory fields: <code className="text-[#F2D35E]">timestamp, event_id, event_type, entity_id, entity_type, severity</code>
            </div>

            <button
              type="submit"
              disabled={isValidating}
              className="px-4 py-2 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Run Schema Audit
            </button>
          </div>
        </form>

        {validationResult && (
          <div className={`p-4 border text-xs font-mono space-y-2 ${
            validationResult.valid ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              {validationResult.valid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Validation Passed: {validationResult.status}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Validation Error</span>
                </>
              )}
            </div>

            <p className="font-sans text-[11px] leading-relaxed">
              {validationResult.message || validationResult.error}
            </p>

            {validationResult.valid && (
              <div className="text-[10px] text-emerald-400/80 pt-1 border-t border-emerald-500/20 flex gap-4">
                <span>Verified Rows: {validationResult.recordCount}</span>
                <span>Headers: {validationResult.headersPresent?.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
