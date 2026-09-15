import React from 'react';
import { GraphNode } from '../../types';
import { X, ExternalLink, Copy } from 'lucide-react';

interface RightNodeDrawerProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const RightNodeDrawer: React.FC<RightNodeDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(node.label);
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 h-full p-4 flex flex-col justify-between shadow-lg z-20">
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h3 className="text-sm font-bold text-slate-900 truncate">Node Intelligence Drawer</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Node Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">{node.type} Node</span>
          <h4 className="text-xs font-mono font-bold text-slate-900 break-all">{node.label}</h4>
          <span className="text-[11px] text-slate-500 block mt-1">Role: {node.role}</span>
        </div>

        {/* Node Properties List */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Blockchain Network:</span>
            <span className="font-semibold text-slate-900">{node.chain}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Total Transaction Count:</span>
            <span className="font-mono font-semibold text-slate-900">{node.txCount} txs</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Total Volume Processed:</span>
            <span className="font-mono font-semibold text-slate-900">{node.totalVolume} ETH / BTC</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Risk Assessment:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                node.riskLevel === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-800'
                  : node.riskLevel === 'HIGH'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {node.riskLevel}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Last Active Timestamp:</span>
            <span className="text-slate-700">{node.lastActive}</span>
          </div>

          {node.isDestinationVASP && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-2">
              <span className="text-[11px] font-bold text-blue-900 block mb-0.5">VASP Match Confirmed</span>
              <span className="text-xs font-bold text-blue-700 block">{node.vaspName}</span>
              <span className="text-[10px] text-blue-600 block mt-1">FIU-IND Regulated Exchange Infrastructure</span>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <button
          onClick={handleCopyAddress}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Address to Clipboard</span>
        </button>
        <a
          href={`https://etherscan.io/address/${node.label}`}
          target="_blank"
          rel="noreferrer"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View on Public Block Explorer</span>
        </a>
      </div>
    </div>
  );
};
