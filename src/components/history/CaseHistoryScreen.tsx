import React, { useState } from 'react';
import { InvestigationCase } from '../../types';
import { DEMO_INVESTIGATION_CASES } from '../../demo/demoCases';
import { History, Search, Filter, Download, ArrowRight } from 'lucide-react';

interface CaseHistoryScreenProps {
  onSelectCase: (caseItem: InvestigationCase) => void;
}

export const CaseHistoryScreen: React.FC<CaseHistoryScreenProps> = ({ onSelectCase }) => {
  const [search, setSearch] = useState('');
  const [filterChain, setFilterChain] = useState('ALL');

  const filteredCases = DEMO_INVESTIGATION_CASES.filter((c) => {
    const matchesSearch =
      c.caseReference.toLowerCase().includes(search.toLowerCase()) ||
      c.targetInput.toLowerCase().includes(search.toLowerCase()) ||
      c.vaspDestination.toLowerCase().includes(search.toLowerCase());

    const matchesChain = filterChain === 'ALL' || c.chain === filterChain;

    return matchesSearch && matchesChain;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Historical Investigation Archive</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Searchable repository of archived blockchain traces, legal disclosure requests, and VASP attributions
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search case ref, address, or VASP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterChain}
            onChange={(e) => setFilterChain(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Chains</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Bitcoin">Bitcoin</option>
          </select>
        </div>
      </div>

      {/* Case History Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Target Address / Hash</th>
              <th className="px-4 py-3">Chain</th>
              <th className="px-4 py-3">Attributed VASP</th>
              <th className="px-4 py-3">Confidence Tier</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredCases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-mono font-bold text-blue-900">{c.caseReference}</td>
                <td className="px-4 py-3 font-mono text-slate-800">
                  {c.targetInput.slice(0, 10)}...{c.targetInput.slice(-6)}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">{c.chain}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{c.vaspDestination}</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">
                  {c.confidenceTier.replace('_', ' ')} ({c.confidenceScore}%)
                </td>
                <td className="px-4 py-3 text-slate-500">{c.createdDate}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onSelectCase(c)}
                    className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 rounded text-[11px] font-semibold transition"
                  >
                    View Case Lead
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
