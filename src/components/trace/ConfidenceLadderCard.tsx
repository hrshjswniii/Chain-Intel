import React, { useState } from 'react';
import { AttributionScore, AttributionTier } from '../../types';
import { HelpCircle, ChevronDown, ChevronUp, Building2 } from 'lucide-react';

interface ConfidenceLadderCardProps {
  attribution: AttributionScore;
  vaspDestination: string;
}

export const ConfidenceLadderCard: React.FC<ConfidenceLadderCardProps> = ({ attribution, vaspDestination }) => {
  const [showFactors, setShowFactors] = useState(true);

  const getTierBadgeStyle = (tier: AttributionTier) => {
    switch (tier) {
      case 'CONFIRMED':
        return { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700', label: 'CONFIRMED' };
      case 'HIGHLY_LIKELY':
        return { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700', label: 'HIGHLY LIKELY' };
      case 'PROBABLE':
        return { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-700', label: 'PROBABLE' };
      case 'POSSIBLE':
        return { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-700', label: 'POSSIBLE' };
      case 'INSUFFICIENT_DATA':
      default:
        return { bg: 'bg-slate-600', text: 'text-white', border: 'border-slate-700', label: 'INSUFFICIENT DATA' };
    }
  };

  const badgeStyle = getTierBadgeStyle(attribution.tier);
  const nearestVasp = attribution.nearestDirectDepositVASP || vaspDestination;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      {/* Explicit Nearest Direct-Deposit VASP Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3.5 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="p-2 bg-blue-600 text-white rounded-md mt-0.5 shadow-2xs">
            <Building2 className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-widest block">
              Nearest Direct-Deposit Accepting VASP
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span>{nearestVasp}</span>
              {attribution.isDirectDeposit && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold">
                  Direct Deposit Endpoint
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Nearest direct deposit exchange identified at <strong className="text-slate-900 font-semibold">{attribution.hopDistance} hops</strong> distance.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`px-2.5 py-1 text-[11px] font-bold rounded uppercase ${badgeStyle.bg} ${badgeStyle.text} shadow-2xs`}>
            {badgeStyle.label}
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{attribution.percentage}%</div>
        </div>
      </div>

      {/* Attribution Confidence Ladder Visual Spectrum */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
          <span>Attribution Confidence Ladder Spectrum</span>
          <span>Normalized Score: {attribution.finalScore} / 100</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex space-x-0.5">
          <div className={`h-full flex-1 transition-all ${attribution.percentage < 30 ? 'bg-slate-500' : 'bg-slate-200'}`} title="Insufficient Data (<30%)" />
          <div className={`h-full flex-1 transition-all ${attribution.percentage >= 30 && attribution.percentage < 60 ? 'bg-orange-500' : attribution.percentage >= 60 ? 'bg-amber-200' : 'bg-slate-200'}`} title="Possible (30-60%)" />
          <div className={`h-full flex-1 transition-all ${attribution.percentage >= 60 && attribution.percentage < 85 ? 'bg-amber-500' : attribution.percentage >= 85 ? 'bg-blue-200' : 'bg-slate-200'}`} title="Probable (60-85%)" />
          <div className={`h-full flex-1 transition-all ${attribution.percentage >= 85 && attribution.percentage < 95 ? 'bg-blue-600' : attribution.percentage >= 95 ? 'bg-blue-200' : 'bg-slate-200'}`} title="Highly Likely (>85%)" />
          <div className={`h-full flex-1 transition-all ${attribution.percentage >= 95 ? 'bg-emerald-600' : 'bg-slate-200'}`} title="Confirmed Direct (95%+)" />
        </div>
      </div>

      {/* Candidate Direct-Deposit VASP Rankings */}
      {attribution.candidateVASPs && attribution.candidateVASPs.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
              Identified Direct-Deposit VASP Candidates
            </span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
              Explicit Ranking
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            {attribution.candidateVASPs.map((cand, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono shrink-0">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-900">{cand.vaspName}</span>
                      {cand.isNearestDirectDeposit && (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-bold">
                          Nearest Direct Deposit
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{cand.clusterRelationship}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0">
                  <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                    {cand.hopDistance} Hops
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-bold rounded font-mono border border-blue-200">
                    {cand.confidenceScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explainable Factor Breakdown ("WHY THIS RESULT?") */}
      <div className="border border-slate-200 rounded-md bg-slate-50 overflow-hidden">
        <button
          onClick={() => setShowFactors(!showFactors)}
          className="w-full px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between hover:bg-slate-50 transition text-xs font-bold text-slate-800 uppercase tracking-wider"
        >
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Why this attribution score? (Explainable Factor Breakdown)</span>
          </div>
          {showFactors ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {showFactors && (
          <div className="p-3 space-y-2 text-xs">
            {attribution.factors.map((factor, idx) => (
              <div key={idx} className="flex items-start justify-between bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                <div className="flex items-start space-x-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold mt-0.5 ${
                      factor.impact > 0
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : factor.impact < 0
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {factor.impact > 0 ? `+${factor.impact}` : factor.impact < 0 ? `${factor.impact}` : 'BASE'}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 block">{factor.label}</span>
                    <span className="text-slate-500 text-[11px] block">{factor.description}</span>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                  {factor.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VASP Compliance & Jurisdiction Context */}
      {attribution.primaryVASPDetails && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-900 block">Jurisdiction Context: {attribution.primaryVASPDetails.jurisdiction}</span>
            <span className="text-slate-500 text-[11px]">Cooperation Level: {attribution.primaryVASPDetails.cooperationPriority}</span>
          </div>
          {attribution.primaryVASPDetails.complianceContact && (
            <span className="text-blue-800 font-mono text-[11px] bg-white px-2 py-1 rounded border border-slate-200">
              {attribution.primaryVASPDetails.complianceContact}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
