import React, { useState } from 'react';
import { ForensicTimelineEvent } from '../../types';
import { ArrowRight, ExternalLink, Copy, Check, Filter } from 'lucide-react';
import { getExplorerTxUrl, getChainExplorerName } from '../../utils/explorerLinks';

interface CaseTimelineTabProps {
  timeline: ForensicTimelineEvent[];
  onSelectTxHash?: (txHash: string) => void;
}

export const CaseTimelineTab: React.FC<CaseTimelineTabProps> = ({ timeline, onSelectTxHash }) => {
  const [filter, setFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyTxHash = (hash: string) => {
    if (!hash || hash === 'Not available') return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredTimeline = timeline.filter((event) => {
    if (filter === 'ALL') return true;
    if (filter === 'IN') return event.direction === 'IN';
    if (filter === 'OUT') return event.direction === 'OUT';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      {/* Header & Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Fund-Flow Timeline</h3>
          <p className="text-xs text-slate-500">Chronological execution sequence of observed transfers</p>
        </div>

        {/* Direction Filters */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded transition ${
                filter === 'ALL' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ALL ({timeline.length})
            </button>
            <button
              onClick={() => setFilter('IN')}
              className={`px-3 py-1 rounded transition ${
                filter === 'IN' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IN ({timeline.filter((e) => e.direction === 'IN').length})
            </button>
            <button
              onClick={() => setFilter('OUT')}
              className={`px-3 py-1 rounded transition ${
                filter === 'OUT' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OUT ({timeline.filter((e) => e.direction === 'OUT').length})
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredTimeline.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-md border border-dashed border-slate-200">
          No transactions match the selected direction filter ({filter}).
        </div>
      ) : (
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filteredTimeline.map((event) => {
            const isEtherscan = event.txHash && event.txHash.startsWith('0x') && event.txHash.length === 66;

            return (
              <div
                key={event.id}
                className="relative group cursor-pointer"
                onClick={() => onSelectTxHash && event.txHash && onSelectTxHash(event.txHash)}
              >
                {/* Timeline Marker Dot */}
                <span
                  className={`absolute -left-[23px] top-2.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${
                    event.direction === 'OUT' ? 'bg-amber-600 ring-amber-100' : 'bg-emerald-600 ring-emerald-100'
                  }`}
                />

                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 hover:border-blue-400 hover:shadow-2xs transition">
                  {/* Top Line: Timestamp & Badges */}
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <span className="text-xs font-mono font-bold text-slate-800">{event.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        HOP {event.hop ?? 1}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          event.direction === 'OUT'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {event.direction || 'OUT'}
                      </span>
                    </div>
                  </div>

                  {/* Flow Path */}
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono bg-white p-2 rounded border border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-700 font-semibold truncate">
                      <span className="truncate max-w-[140px]" title={event.from}>
                        {event.from.slice(0, 8)}...{event.from.slice(-4)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[140px]" title={event.to}>
                        {event.to.slice(0, 8)}...{event.to.slice(-4)}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">{event.amount}</span>
                  </div>

                  {/* Transaction Evidence Footer */}
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center space-x-1.5 font-mono truncate max-w-[70%]">
                      <span className="text-slate-400">TX:</span>
                      <span className="font-bold text-slate-700 truncate">{event.txHash}</span>
                      {event.txHash && event.txHash !== 'Not available' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyTxHash(event.txHash);
                          }}
                          className="hover:text-slate-900 p-0.5 rounded"
                          title="Copy Transaction Hash"
                        >
                          {copiedHash === event.txHash ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      )}
                    </div>

                    {(() => {
                      const explorerUrl = getExplorerTxUrl(event.chain, event.txHash);
                      const explorerName = getChainExplorerName(event.chain);
                      if (!explorerUrl) return null;
                      return (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 font-semibold hover:underline flex items-center space-x-1"
                        >
                          <span>{explorerName}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
