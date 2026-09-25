import React, { useState } from 'react';
import { GraphNode } from '../../types';
import { X, ExternalLink, Copy, Check } from 'lucide-react';
import { getExplorerAddressUrl, getChainExplorerName } from '../../utils/explorerLinks';

interface RightNodeDrawerProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const RightNodeDrawer: React.FC<RightNodeDrawerProps> = ({ node, onClose }) => {
  const [copiedAddr, setCopiedAddr] = useState(false);

  if (!node) return null;

  const rawAddress = node.address || (node.id ? node.id.replace(/^[^:]+:/, '') : node.label);
  const displayAddress = node.id || `${(node.chain || 'ethereum').toLowerCase()}:${rawAddress}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(rawAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const explorerAddressUrl = getExplorerAddressUrl(node.chain, rawAddress);
  const explorerName = getChainExplorerName(node.chain);

  return (
    <div className="w-84 bg-white border-l border-slate-200 h-full p-4 flex flex-col justify-between shadow-xl z-30 overflow-y-auto">
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Wallet Node Intelligence</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Node Summary Header */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {node.isTarget ? 'Suspect Target Wallet' : `Hop #${node.hop ?? 1} Counterparty`}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
              Hop #{node.hop ?? 1}
            </span>
          </div>
          <h4 className="text-xs font-mono font-bold text-slate-900 break-all">{displayAddress}</h4>
        </div>

        {/* Observed Node Statistics */}
        <div className="space-y-3 text-xs">
          <div className="pb-2 border-b border-slate-100">
            <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Observed Address</span>
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
              <span className="font-mono text-[11px] text-slate-900 break-all">{rawAddress}</span>
              <button
                onClick={handleCopyAddress}
                className="ml-1.5 p-1 hover:bg-slate-200 rounded text-slate-600 shrink-0"
                title="Copy Address"
              >
                {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Transactions Observed:</span>
            <span className="font-mono font-bold text-slate-900">{node.txCount || node.inboundTransactionCount! + node.outboundTransactionCount!}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-slate-100 bg-slate-50 p-2 rounded border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Inbound Transfers</span>
              <span className="font-mono font-bold text-emerald-700">{node.inboundTransactionCount ?? 'N/A'} txs</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Outbound Transfers</span>
              <span className="font-mono font-bold text-amber-700">{node.outboundTransactionCount ?? 'N/A'} txs</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-slate-100 bg-slate-50 p-2 rounded border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Inbound Volume</span>
              <span className="font-mono font-bold text-slate-900">{node.inboundVolume ?? node.totalVolume} ETH</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Outbound Volume</span>
              <span className="font-mono font-bold text-slate-900">{node.outboundVolume ?? '0'} ETH</span>
            </div>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">First Observed Activity:</span>
            <span className="font-mono text-[11px] text-slate-800">{node.firstSeen || 'Not available'}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Last Observed Activity:</span>
            <span className="font-mono text-[11px] text-slate-800">{node.lastSeen || node.lastActive || 'Not available'}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Data Source:</span>
            <span className="font-semibold text-blue-900">{node.sourceProvider || 'Alchemy — Ethereum Mainnet'}</span>
          </div>
        </div>
      </div>

      {/* Drawer Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-slate-100 mt-4">
        <button
          onClick={handleCopyAddress}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition"
        >
          {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedAddr ? 'Address Copied!' : 'Copy Address to Clipboard'}</span>
        </button>
        {explorerAddressUrl && (
          <a
            href={explorerAddressUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View on {explorerName}</span>
          </a>
        )}
      </div>
    </div>
  );
};
