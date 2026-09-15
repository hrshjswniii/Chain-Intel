import React, { useState } from 'react';
import { BatchCaseRecord } from '../../types';
import { Upload, Download, Layers } from 'lucide-react';

export const BatchInvestigationScreen: React.FC = () => {
  const [batchRecords, setBatchRecords] = useState<BatchCaseRecord[]>([
    {
      caseId: 'BATCH-001',
      walletAddress: '0x71C7656EC7ab88b098defb751b7401b5f6d8976f',
      chain: 'Ethereum',
      priority: 'HIGH',
      notes: 'Investment fraud bulk victim pool',
      status: 'COMPLETED',
      risk: 'HIGH',
      vaspMatch: 'CoinDCX India',
      confidenceScore: 91,
    },
    {
      caseId: 'BATCH-002',
      walletAddress: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
      chain: 'Ethereum',
      priority: 'URGENT',
      notes: 'Ransomware extortion trace',
      status: 'COMPLETED',
      risk: 'CRITICAL',
      vaspMatch: 'Binance',
      confidenceScore: 87,
    },
    {
      caseId: 'BATCH-003',
      walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      chain: 'Bitcoin',
      priority: 'MEDIUM',
      notes: 'Darknet market proceeds',
      status: 'COMPLETED',
      risk: 'HIGH',
      vaspMatch: 'WazirX India',
      confidenceScore: 78,
    },
    {
      caseId: 'BATCH-004',
      walletAddress: '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc',
      chain: 'Ethereum',
      priority: 'HIGH',
      notes: 'Mixer contract deposit',
      status: 'COMPLETED',
      risk: 'CRITICAL',
      vaspMatch: 'Tornado Cash',
      confidenceScore: 24,
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsProcessing(false);

        // Add dummy newly uploaded parsed record
        setBatchRecords((prev) => [
          ...prev,
          {
            caseId: `BATCH-00${prev.length + 1}`,
            walletAddress: '0x28c6c06298d514db089934071355e5743bf21d60',
            chain: 'Ethereum',
            priority: 'HIGH',
            notes: 'Uploaded CSV Case Record',
            status: 'COMPLETED',
            risk: 'MEDIUM',
            vaspMatch: 'CoinDCX India',
            confidenceScore: 98,
          },
        ]);
      }
    }, 400);
  };

  const completedCount = batchRecords.filter((r) => r.status === 'COMPLETED').length;
  const highRiskCount = batchRecords.filter((r) => r.risk === 'HIGH' || r.risk === 'CRITICAL').length;
  const vaspMatchedCount = batchRecords.filter((r) => r.vaspMatch && r.vaspMatch !== 'Unattributed').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Batch Investigation Processor</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated multi-wallet CSV upload, high-throughput tracing, and batch VASP attribution summary
          </p>
        </div>

        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center space-x-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload CSV File</span>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Cases Uploaded</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{batchRecords.length}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Traces Completed</span>
          <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">{completedCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">High-Risk Targets</span>
          <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{highRiskCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">VASP Matches Identified</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{vaspMatchedCount}</div>
        </div>
      </div>

      {/* Processing Progress Indicator */}
      {isProcessing && (
        <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1">
            <span>Processing Batch Traces...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Batch Results Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Batch Execution Matrix</h3>
          <button className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export Batch CSV Summary</span>
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="px-4 py-2.5">Case ID</th>
              <th className="px-4 py-2.5">Target Wallet</th>
              <th className="px-4 py-2.5">Chain</th>
              <th className="px-4 py-2.5">Risk Rating</th>
              <th className="px-4 py-2.5">Attributed VASP</th>
              <th className="px-4 py-2.5">Confidence</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {batchRecords.map((row) => (
              <tr key={row.caseId} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-semibold text-blue-900">{row.caseId}</td>
                <td className="px-4 py-3 font-mono text-slate-800">
                  {row.walletAddress.slice(0, 10)}...{row.walletAddress.slice(-6)}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">{row.chain}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      row.risk === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : row.risk === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {row.risk}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">{row.vaspMatch}</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">{row.confidenceScore}%</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-semibold">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
