import React from 'react';
import { getAuditLedger } from '../../engine/integrity/integrityManager';
import { Activity, ShieldCheck, Database, Cpu, CheckCircle2, Lock } from 'lucide-react';

export const SystemStatusScreen: React.FC = () => {
  const auditLogs = getAuditLedger();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
            <Activity className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">System Status & Forensic Audit Trail</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time service health monitoring, data source transparency, and cryptographic audit ledger
            </p>
          </div>
        </div>
      </div>

      {/* Services Operational Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Blockchain API Adapters</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-900">Operational / Demo Mode</div>
          <span className="text-[10px] text-slate-400 block mt-1">EVM & Bitcoin Node Sync</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">VASP Dataset</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-900">Loaded (250,000+ Records)</div>
          <span className="text-[10px] text-slate-400 block mt-1">FIU-IND Sync Active</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Graph Engine</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-900">Cytoscape Dagre Active</div>
          <span className="text-[10px] text-slate-400 block mt-1">Hierarchical Tracing</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">SHA-256 Audit Logger</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-900">Append-Only Active</div>
          <span className="text-[10px] text-slate-400 block mt-1">WebCrypto Native</span>
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Cryptographic Audit Log Stream
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Append-Only Ledger</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="px-4 py-2.5">Log ID</th>
              <th className="px-4 py-2.5">Timestamp</th>
              <th className="px-4 py-2.5">User</th>
              <th className="px-4 py-2.5">Action</th>
              <th className="px-4 py-2.5">Case Reference</th>
              <th className="px-4 py-2.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-blue-900">{log.id}</td>
                <td className="px-4 py-3 text-slate-600">{log.timestamp}</td>
                <td className="px-4 py-3 font-sans font-semibold text-slate-900">{log.user}</td>
                <td className="px-4 py-3 font-semibold text-blue-700">{log.action}</td>
                <td className="px-4 py-3 text-slate-800">{log.caseId}</td>
                <td className="px-4 py-3 text-slate-600 truncate max-w-md">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
