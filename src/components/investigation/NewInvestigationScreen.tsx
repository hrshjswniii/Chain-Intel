import React, { useState } from 'react';
import { BlockchainType, InvestigationCase } from '../../types';
import { detectChainAndType } from '../../engine/adapters/chainAdapter';
import { DEMO_INVESTIGATION_CASES } from '../../demo/demoCases';
import { ProgressiveTraceModal } from '../trace/ProgressiveTraceModal';
import { PlusCircle, Sliders, ArrowRight, GitCommit } from 'lucide-react';

interface NewInvestigationScreenProps {
  onStartTrace: (newCase: Partial<InvestigationCase>) => void;
  onSelectPresetCase: (preset: InvestigationCase) => void;
}

export const NewInvestigationScreen: React.FC<NewInvestigationScreenProps> = ({
  onStartTrace,
  onSelectPresetCase,
}) => {
  const [caseRef, setCaseRef] = useState(`CS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [investigator, setInvestigator] = useState('Inspector R. Sharma (ID: LE-9842)');
  const [incidentType, setIncidentType] = useState('Investment Fraud / Phishing');
  const [targetInput, setTargetInput] = useState('0x71C7656EC7ab88b098defb751b7401b5f6d8976f');
  const [chain, setChain] = useState<BlockchainType>('Ethereum');
  const [maxHops, setMaxHops] = useState<number>(4);
  const [minTransferValue, setMinTransferValue] = useState<number>(0.1);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [notes, setNotes] = useState('Victim reported unauthorized outflow from personal web3 account.');

  const [detectedInfo, setDetectedInfo] = useState(() => detectChainAndType(targetInput));
  const [isTracingProgressive, setIsTracingProgressive] = useState(false);
  const [pendingCaseParams, setPendingCaseParams] = useState<Partial<InvestigationCase> | null>(null);
  const [pendingPreset, setPendingPreset] = useState<InvestigationCase | null>(null);

  const handleInputChange = (val: string) => {
    setTargetInput(val);
    const info = detectChainAndType(val);
    setDetectedInfo(info);
    if (info.isValid) {
      setChain(info.chain);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim()) return;

    setPendingPreset(null);
    setPendingCaseParams({
      id: `TB-CASE-${Date.now().toString().slice(-4)}`,
      caseReference: caseRef,
      investigator,
      incidentType,
      targetInput: targetInput.trim(),
      inputType: detectedInfo.inputType,
      chain,
      status: 'ACTIVE',
      priority,
      riskLevel: 'HIGH',
      maxHops,
      minTransferValue,
      notes,
    });
    setIsTracingProgressive(true);
  };

  const handleSelectPreset = (preset: InvestigationCase) => {
    setPendingCaseParams(null);
    setPendingPreset(preset);
    setIsTracingProgressive(true);
  };

  const handleTraceComplete = () => {
    setIsTracingProgressive(false);
    if (pendingPreset) {
      onSelectPresetCase(pendingPreset);
    } else if (pendingCaseParams) {
      onStartTrace(pendingCaseParams);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProgressiveTraceModal
        isOpen={isTracingProgressive}
        targetInput={pendingPreset ? pendingPreset.targetInput : pendingCaseParams?.targetInput || targetInput}
        chain={pendingPreset ? pendingPreset.chain : pendingCaseParams?.chain || chain}
        onComplete={handleTraceComplete}
      />

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
            <PlusCircle className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Initiate New Blockchain Trace</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter target wallet address or transaction hash to configure hop-by-hop automated VASP attribution
            </p>
          </div>
        </div>
      </div>

      {/* Quick Demo Preset Selector */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-blue-950 block">Quick Launch Demo Scenario</span>
          <span className="text-[11px] text-blue-700">Pre-loaded case parameters for instant live judge presentation</span>
        </div>

        <select
          onChange={(e) => {
            const found = DEMO_INVESTIGATION_CASES.find((c) => c.id === e.target.value);
            if (found) handleSelectPreset(found);
          }}
          className="px-3 py-1.5 bg-white border border-blue-300 rounded text-xs font-semibold text-blue-900 focus:outline-none cursor-pointer shadow-2xs"
        >
          <option value="">Select Prepared Demo Scenario...</option>
          {DEMO_INVESTIGATION_CASES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.caseReference} — {c.incidentType} ({c.chain})
            </option>
          ))}
        </select>
      </div>

      {/* Main Investigation Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Case Reference Number</label>
            <input
              type="text"
              value={caseRef}
              onChange={(e) => setCaseRef(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Investigating Officer</label>
            <input
              type="text"
              value={investigator}
              onChange={(e) => setInvestigator(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Target Address / Hash Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">Target Wallet Address or Transaction Hash</label>
            {detectedInfo.isValid && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded uppercase">
                {detectedInfo.chain} {detectedInfo.inputType} Auto-Detected
              </span>
            )}
          </div>

          <input
            type="text"
            placeholder="0x71C7656EC7ab88b098defb751b7401b5f6d8976f"
            value={targetInput}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Supports Ethereum/EVM addresses, Bitcoin Bech32/Base58, or transaction hash identifiers.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Blockchain Network</label>
            <select
              value={chain}
              onChange={(e) => setChain(e.target.value as BlockchainType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="Ethereum">Ethereum (EVM)</option>
              <option value="Bitcoin">Bitcoin (BTC)</option>
              <option value="Polygon">Polygon (EVM)</option>
              <option value="BNB">BNB Smart Chain</option>
              <option value="Tron">Tron (TRC-20)</option>
              <option value="Solana">Solana</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Incident Category</label>
            <input
              type="text"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High Priority</option>
              <option value="URGENT">Urgent / Critical</option>
            </select>
          </div>
        </div>

        {/* Tracing Controls & Parameters */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Trace Depth & Filtering Configuration</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Maximum Hop Depth</span>
                <span className="font-mono text-blue-700 font-bold">{maxHops} Hops</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={maxHops}
                onChange={(e) => setMaxHops(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 Hop</span>
                <span>3 Hops</span>
                <span>6 Hops</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Minimum Transfer Threshold (ETH / BTC)
              </label>
              <input
                type="number"
                step="0.05"
                value={minTransferValue}
                onChange={(e) => setMinTransferValue(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-mono font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Case Notes */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Investigative Context & Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add relevant cybercrime incident details or complaint reference numbers..."
          />
        </div>

        {/* Submit Primary Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-md transition flex items-center space-x-2"
          >
            <GitCommit className="w-4 h-4" />
            <span>Begin Automated Trace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
