import React, { useState } from 'react';
import { FileText, Copy, Edit3, Check, RefreshCw } from 'lucide-react';
import { generateInvestigatorNarrative } from '../../engine/narrative/narrativeEngine';
import { InvestigationCase } from '../../types';

interface InvestigatorStoryCardProps {
  caseData: Partial<InvestigationCase>;
}

export const InvestigatorStoryCard: React.FC<InvestigatorStoryCardProps> = ({ caseData }) => {
  const [narrativeText, setNarrativeText] = useState(() => caseData.narrative || generateInvestigatorNarrative(caseData));
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(narrativeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const fresh = generateInvestigatorNarrative(caseData);
    setNarrativeText(fresh);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Investigator's Story (Plain-Language Summary)</h3>
            <p className="text-xs text-slate-500">Deterministic plain-English forensic explanation for legal documentation</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRegenerate}
            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-slate-200 text-xs flex items-center space-x-1"
            title="Regenerate Narrative"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-slate-200 text-xs flex items-center space-x-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Save Edit' : 'Edit Text'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center space-x-1 transition shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Story'}</span>
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={narrativeText}
          onChange={(e) => setNarrativeText(e.target.value)}
          rows={7}
          className="w-full p-3 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs leading-relaxed text-slate-800 space-y-3 font-sans">
          {narrativeText.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
};
