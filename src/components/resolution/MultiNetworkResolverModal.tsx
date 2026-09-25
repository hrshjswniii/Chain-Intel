import React from 'react';
import { NetworkMatch } from '../../engine/resolution/chainResolverClient';
import { Layers, ArrowRight, ShieldCheck, Activity, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  address: string;
  matches: NetworkMatch[];
  onSelectNetwork: (selectedMatch: NetworkMatch) => void;
  onClose: () => void;
}

export function MultiNetworkResolverModal({
  isOpen,
  address,
  matches,
  onSelectNetwork,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Multiple Networks Detected</h2>
              <p className="text-xs text-slate-400">
                Observable activity found on multiple supported blockchains
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-slate-300 flex items-center justify-between">
            <span className="text-slate-500">Target Address:</span>
            <span className="font-semibold text-amber-300">{address}</span>
          </div>

          <p className="text-xs text-slate-400">
            Select the primary blockchain scope for this investigation trace. The system will load evidence and build the fund flow graph for the selected network context.
          </p>

          <div className="space-y-3 pt-2">
            {matches.map((match) => (
              <div
                key={match.chain}
                onClick={() => onSelectNetwork(match)}
                className="group relative flex items-center justify-between p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all duration-150"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-slate-100">{match.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        Chain ID: {match.chainId}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center">
                        <Activity className="w-3 h-3 mr-1 text-emerald-400" />
                        {match.evidence?.transactionCount || 0} observed transfers
                      </span>
                      {match.evidence?.latestActivity && (
                        <span className="text-slate-500">
                          • Latest: {new Date(match.evidence.latestActivity).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs font-medium text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Select Scope</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
