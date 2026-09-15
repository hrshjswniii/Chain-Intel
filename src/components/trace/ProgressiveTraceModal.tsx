import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Zap } from 'lucide-react';

interface ProgressiveTraceModalProps {
  isOpen: boolean;
  targetInput: string;
  chain: string;
  onComplete: () => void;
}

interface StageStep {
  id: number;
  label: string;
  detail: string;
}

const TRACE_STAGES: StageStep[] = [
  { id: 1, label: 'Target Input & Format Validation', detail: 'Validating cryptographic address checksum and input syntax...' },
  { id: 2, label: 'Multi-Chain Network Auto-Detection', detail: 'Auto-detecting blockchain protocol adapter & chain parameters...' },
  { id: 3, label: 'Hop-by-Hop Transaction Graph Construction', detail: 'Retrieving on-chain transaction ledger & constructing Cytoscape dagre layout...' },
  { id: 4, label: 'On-Chain Entity Classification', detail: 'Classifying Exchange Deposit Wallets, Hot Wallets, Clusters, Mixers, and Bridges...' },
  { id: 5, label: 'VASP Intelligence Database Cross-Reference', detail: 'Querying public labelled VASP dataset & FIU-IND registry entries...' },
  { id: 6, label: 'Nearest Direct-Deposit VASP Candidate Ranking', detail: 'Isolating nearest direct-deposit accepting exchange endpoint & hop distance...' },
  { id: 7, label: 'Risk Typology & Obfuscation Pattern Analysis', detail: 'Detecting Peel Chains, Layering, CoinJoin Mixers & Cross-Bridge Outflows...' },
  { id: 8, label: 'Explainable Attribution Score Calculation', detail: 'Evaluating 5-tier confidence ladder mathematical weight breakdown...' },
  { id: 9, label: 'Forensics Evidence Matrix Compilation', detail: 'Assembling legal notice evidence items & timeline event log...' },
  { id: 10, label: 'SHA-256 Report Integrity Stamping', detail: 'Generating deterministic SHA-256 chain-of-custody stamp in audit ledger...' },
];

export const ProgressiveTraceModal: React.FC<ProgressiveTraceModalProps> = ({
  isOpen,
  targetInput,
  chain,
  onComplete,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev >= TRACE_STAGES.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const currentStage = TRACE_STAGES[currentStageIndex];
  const progressPercent = Math.round(((currentStageIndex + 1) / TRACE_STAGES.length) * 100);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-300 rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-5 font-sans">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-blue-600 text-white rounded-lg shadow-sm">
              <Zap className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-widest block">
                CHAIN-INTEL Automated Tracing Pipeline
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <span>Generating Forensic Intelligence</span>
              </h2>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded font-mono font-bold text-xs">
            {progressPercent}%
          </span>
        </div>

        {/* Target Info Summary Strip */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs font-mono">
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">Target Input</span>
            <span className="font-bold text-slate-900 truncate block">{targetInput}</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">Network</span>
            <span className="font-bold text-blue-900 font-sans">{chain}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Active Stage Detail Box */}
        <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-md flex items-start space-x-3">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-blue-950 block">Stage {currentStage.id} of {TRACE_STAGES.length}: {currentStage.label}</span>
            <span className="text-blue-800 text-[11px] block mt-0.5">{currentStage.detail}</span>
          </div>
        </div>

        {/* Stage Execution Steps Checklist */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {TRACE_STAGES.map((stg, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={stg.id}
                className={`flex items-center justify-between p-2 rounded text-xs transition ${
                  isCurrent
                    ? 'bg-blue-100/70 border border-blue-300 font-bold text-blue-950'
                    : isDone
                    ? 'bg-slate-50 text-slate-700 font-semibold'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 text-[10px] flex items-center justify-center font-mono shrink-0">
                      {stg.id}
                    </span>
                  )}
                  <span className="truncate">{stg.label}</span>
                </div>
                {isDone && <span className="text-[10px] font-mono text-emerald-700 font-bold">COMPLETED</span>}
                {isCurrent && <span className="text-[10px] font-mono text-blue-800 font-bold animate-pulse">PROCESSING</span>}
              </div>
            );
          })}
        </div>

        {/* Footer Disclaimer */}
        <div className="text-[11px] text-slate-400 text-center font-mono pt-1">
          CHAIN-INTEL Workstation • Real-Time On-Chain Intelligence Pipeline
        </div>
      </div>
    </div>
  );
};
