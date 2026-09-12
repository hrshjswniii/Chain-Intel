import React from 'react';
import { EvidenceItem } from '../../types';
import { ShieldCheck, Database, Calendar, Link, AlertTriangle } from 'lucide-react';

interface EvidenceExplorerTabProps {
  evidenceList: EvidenceItem[];
}

export const EvidenceExplorerTab: React.FC<EvidenceExplorerTabProps> = ({ evidenceList }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Evidentiary Item Explorer</h3>
          <p className="text-xs text-slate-500">Every attribution conclusion is backed by traceable underlying evidence records</p>
        </div>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded border border-blue-200">
          {evidenceList.length} Evidence Artifacts Verified
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {evidenceList.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span
                  className={`p-2 rounded-md ${
                    item.strength === 'STRONG'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  item.strength === 'STRONG' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.strength} Evidence
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Source</span>
                <span className="font-semibold text-slate-800">{item.source}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Address / Hash</span>
                <span className="font-mono text-slate-800 truncate block">
                  {item.address || item.txHash || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Verification</span>
                <span className="text-slate-700">{item.lastVerified}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Evidence Category</span>
                <span className="text-slate-700">{item.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
