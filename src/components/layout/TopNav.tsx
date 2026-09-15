import React, { useState } from 'react';
import { Search, Database } from 'lucide-react';
import { detectChainAndType } from '../../engine/adapters/chainAdapter';
import { InvestigationCase } from '../../types';

interface TopNavProps {
  onSearchInput: (query: string) => void;
  activeCase: InvestigationCase;
  dataSourceMode: 'DEMO' | 'LIVE';
  onToggleDataSourceMode: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onSearchInput,
  activeCase,
  dataSourceMode,
  onToggleDataSourceMode,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [detectedChain, setDetectedChain] = useState<{ chain: string; isValid: boolean } | null>(null);

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (val.trim()) {
      const res = detectChainAndType(val);
      setDetectedChain(res);
    } else {
      setDetectedChain(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchInput(searchInput.trim());
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-14 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Search Input Bar with Auto Chain Detection */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Enter wallet address (0x... / bc1...), transaction hash, or case reference..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-24 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />

          {detectedChain && detectedChain.isValid && (
            <span className="absolute right-2 text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-sans uppercase">
              {detectedChain.chain} Detected
            </span>
          )}
        </div>
      </form>

      {/* Header Right Status & Profile Controls */}
      <div className="flex items-center space-x-4">
        {/* Data Source Mode Toggle Tag */}
        <button
          onClick={onToggleDataSourceMode}
          className={`px-2.5 py-1 rounded border text-[11px] font-semibold flex items-center space-x-1.5 transition ${
            dataSourceMode === 'LIVE'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
          }`}
          title="Click to toggle between Demo Dataset and Live Public Node Mode"
        >
          <Database className="w-3.5 h-3.5" />
          <span>DATA SOURCE: {dataSourceMode === 'LIVE' ? 'PUBLIC BLOCKCHAIN DATA' : 'DEMO DATASET'}</span>
        </button>

        {/* Active Case Indicator */}
        <div className="hidden md:flex items-center space-x-2 text-xs border-l border-slate-200 pl-4">
          <span className="text-slate-400 font-medium">Active Investigation:</span>
          <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {activeCase.caseReference}
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4 text-xs font-medium text-slate-700">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            RS
          </div>
          <div className="hidden lg:block text-left">
            <span className="block font-bold text-slate-900 leading-none">Inspector R. Sharma</span>
            <span className="text-[10px] text-slate-400 leading-none block mt-0.5">I4C Cyber Cell (LE-9842)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
