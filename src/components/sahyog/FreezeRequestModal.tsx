import React, { useState } from 'react';
import { InvestigationCase } from '../../types';
import { generateFreezeRequestDraft } from '../../engine/legal/legalNoticeEngine';
import { X, Copy, Printer, Check, ShieldAlert, Lock } from 'lucide-react';

interface FreezeRequestModalProps {
  currentCase: InvestigationCase;
  isOpen: boolean;
  onClose: () => void;
}

export const FreezeRequestModal: React.FC<FreezeRequestModalProps> = ({ currentCase, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const freezeDraftText = generateFreezeRequestDraft(currentCase);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(freezeDraftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-300 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-rose-50/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold uppercase flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Account Freeze Order</span>
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Section 102 Cr.P.C. / BNSS Asset Restraint Notice
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lawful order to prevent diversion of crime proceeds at nearest direct-deposit VASP
            </p>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Legal Freeze Order Text */}
        <div className="p-5 flex-1 overflow-y-auto font-mono text-xs text-slate-800 bg-slate-50 leading-relaxed whitespace-pre-wrap border-b border-slate-200">
          {freezeDraftText}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3 bg-white flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-sans">
            Target VASP: {currentCase.nearestDirectDepositVASP || currentCase.vaspDestination}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-300 transition flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Freeze Order'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Freeze Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
