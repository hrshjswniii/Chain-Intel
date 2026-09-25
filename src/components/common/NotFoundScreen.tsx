import React, { useState } from 'react';
import { Search, AlertTriangle, ArrowLeft, Shield, RefreshCw } from 'lucide-react';
import { BlockchainType } from '../../types';

interface NotFoundScreenProps {
  searchedTerm?: string;
  errorMessage?: string;
  statusBadge?: string;
  onReturnToWorkstation: () => void;
  onSearchNewTrace: (query: string, selectedChain?: BlockchainType) => void;
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  searchedTerm = '',
  errorMessage,
  statusBadge = '404 — TRACE NOT FOUND / UNKNOWN REFERENCE',
  onReturnToWorkstation,
  onSearchNewTrace,
}) => {
  const [query, setQuery] = useState(searchedTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchNewTrace(query.trim());
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
      {/* Badge Header */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-mono font-bold mb-6">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <span>{statusBadge}</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        {errorMessage ? 'Live Blockchain Query Failed' : 'Case Reference or Target Address Not Found'}
      </h1>

      <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-8 leading-relaxed">
        {errorMessage ? (
          <span className="text-rose-700 font-medium block bg-rose-50 p-3 rounded border border-rose-200 font-mono text-xs">
            {errorMessage}
          </span>
        ) : (
          <>
            The requested wallet address, transaction hash, or case identifier{' '}
            {searchedTerm ? <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-xs font-bold">{searchedTerm}</code> : 'you queried'}{' '}
            could not be resolved in active intelligence indices or requires a fresh multi-chain query.
          </>
        )}
      </p>

      {/* Search Input Card */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8 text-left">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
          Initiate Target Lookup / Re-query
        </label>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter valid EVM (0x...), BTC, SOL, TRON address or Case ID (e.g. TB-001)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-lg transition flex items-center justify-center space-x-2 shrink-0 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Search Intelligence</span>
          </button>
        </form>
      </div>

      {/* Troubleshooting Tips / Diagnostic Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left mb-8">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 mb-1.5">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Format & Network Check</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ensure Ethereum addresses start with <code className="font-mono bg-white px-1 border rounded">0x</code> (42 chars) and explicit network is selected in the search dropdown bar.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 mb-1.5">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Demo Preset Cases</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            You can load pre-indexed investigation benchmarks like <button onClick={() => onSearchNewTrace('TB-001')} className="text-blue-600 font-mono font-bold hover:underline">TB-001</button>, <button onClick={() => onSearchNewTrace('TB-002')} className="text-blue-600 font-mono font-bold hover:underline">TB-002</button>, or <button onClick={() => onSearchNewTrace('TB-004')} className="text-blue-600 font-mono font-bold hover:underline">TB-004</button> from the presets menu.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onReturnToWorkstation}
          className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workstation Dashboard</span>
        </button>
      </div>
    </div>
  );
};
