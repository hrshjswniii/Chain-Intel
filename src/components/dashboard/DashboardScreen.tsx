import React from 'react';
import { InvestigationCase } from '../../types';
import { DEMO_INVESTIGATION_CASES } from '../../demo/demoCases';
import { PlusCircle, ArrowRight } from 'lucide-react';

interface DashboardScreenProps {
  onSelectCase: (caseItem: InvestigationCase) => void;
  onNewInvestigation: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onSelectCase,
  onNewInvestigation,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Welcome & Primary Action Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
            Enterprise Blockchain Forensic Workstation
          </span>
          <h1 className="text-xl font-bold text-slate-900">Cryptocurrency Investigation Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time wallet-to-VASP attribution, transaction flow analysis, and explainable evidence lead tracking
          </p>
        </div>

        <button
          onClick={onNewInvestigation}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start New Investigation</span>
        </button>
      </div>

      {/* Investigator Action Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">Active Cases</span>
          <div className="text-2xl font-extrabold text-blue-900 font-mono mt-1">4</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">High-Risk Targets</span>
          <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">2</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">Recent Traces</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">12</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">Pending Review</span>
          <div className="text-2xl font-extrabold text-slate-700 font-mono mt-1">1</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">VASP Matches</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">8</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">Reports Issued</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">14</div>
        </div>
      </div>

      {/* Presentation Prepared Demo Case Selectors */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h3 className="text-sm font-bold text-slate-900">Pre-configured Demo Scenarios (Investigation Cases)</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Instant One-Click Presentation Traces</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_INVESTIGATION_CASES.slice(0, 3).map((demoCase) => (
            <div
              key={demoCase.id}
              onClick={() => onSelectCase(demoCase)}
              className="bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 rounded-md p-3.5 cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-blue-900">{demoCase.caseReference}</span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                    {demoCase.chain}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                  {demoCase.incidentType}
                </h4>
                <p className="text-[11px] font-mono text-slate-500 truncate mt-1">
                  Target: {demoCase.targetInput.slice(0, 10)}...
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{demoCase.vaspDestination}</span>
                <span className="font-mono font-bold text-blue-700 flex items-center space-x-1">
                  <span>{demoCase.confidenceScore}%</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Investigations Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Active Cybercrime Investigation Queue
          </h3>
          <span className="text-xs text-slate-500 font-medium">Showing {DEMO_INVESTIGATION_CASES.length} Cases</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Target Address / Hash</th>
              <th className="px-4 py-3">Chain</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Destination VASP</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {DEMO_INVESTIGATION_CASES.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-mono font-semibold text-blue-900">{c.caseReference}</td>
                <td className="px-4 py-3 font-mono text-slate-800">
                  {c.targetInput.slice(0, 10)}...{c.targetInput.slice(-6)}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">{c.chain}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-semibold">
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.riskLevel === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : c.riskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {c.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">{c.vaspDestination}</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">
                  {c.confidenceTier.replace('_', ' ')} ({c.confidenceScore}%)
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onSelectCase(c)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition"
                  >
                    Open Trace
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
