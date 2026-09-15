import React, { useState } from 'react';
import { InvestigationCase } from '../../types';
import { generateLegalNoticeDraft } from '../../engine/legal/legalNoticeEngine';
import { X, Copy, Printer, Check } from 'lucide-react';

interface LegalNoticeModalProps {
  currentCase: InvestigationCase;
  isOpen: boolean;
  onClose: () => void;
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({ currentCase, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const draftText = generateLegalNoticeDraft(currentCase);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
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
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase">
                Legal Draft Mode
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Section 91 Cr.P.C. / BNSS Disclosure Notice Draft
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Requires review & official signature by designated Investigating Officer prior to submission
            </p>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Legal Notice Content */}
        <div className="p-5 flex-1 overflow-y-auto font-mono text-xs text-slate-800 bg-slate-50 leading-relaxed whitespace-pre-wrap border-b border-slate-200">
          {draftText}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3 bg-white flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-sans">
            Auto-populated from Case #{currentCase.caseReference}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-300 transition flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Notice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
