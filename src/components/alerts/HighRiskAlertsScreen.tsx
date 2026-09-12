import React from 'react';
import { HighRiskAlert, InvestigationCase } from '../../types';
import { DEMO_INVESTIGATION_CASES } from '../../demo/demoCases';
import { ShieldAlert, AlertTriangle, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

interface HighRiskAlertsScreenProps {
  onSelectCase: (caseItem: InvestigationCase) => void;
  onOpenFreezeModal: (caseItem: InvestigationCase) => void;
}

export const HighRiskAlertsScreen: React.FC<HighRiskAlertsScreenProps> = ({
  onSelectCase,
  onOpenFreezeModal,
}) => {
  // Flatten alerts from demo cases
  const allAlerts: { alert: HighRiskAlert; caseItem: InvestigationCase }[] = [];

  DEMO_INVESTIGATION_CASES.forEach((c) => {
    if (c.alerts && c.alerts.length > 0) {
      c.alerts.forEach((alt) => {
        allAlerts.push({ alert: alt, caseItem: c });
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-rose-50 text-rose-700 rounded-md">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">High-Risk Intelligence Alerting Console</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated intelligence alerts for Ransomware, Darknet Market proceeds, Terrorism Financing indicators & Sanctioned Mixers
          </p>
        </div>

        <span className="px-3 py-1.5 bg-rose-100 text-rose-800 border border-rose-200 rounded font-mono font-bold text-xs">
          {allAlerts.length} Critical Alerts Active
        </span>
      </div>

      {/* Alerts Matrix Grid */}
      <div className="grid grid-cols-1 gap-4">
        {allAlerts.map(({ alert, caseItem }) => (
          <div
            key={alert.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                  {alert.alertType.replace('_', ' ')}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">{alert.id}</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-mono text-slate-600">{alert.timestamp}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span className="font-mono">{alert.walletAddress}</span>
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                  {alert.chain}
                </span>
              </h3>

              <p className="text-xs text-slate-600 font-medium">{alert.evidence}</p>

              <div className="flex items-center space-x-4 text-[11px] text-slate-500 font-mono">
                <span>Source: <strong className="text-slate-700">{alert.source}</strong></span>
                <span>Confidence: <strong className="text-blue-900">{alert.confidenceScore}%</strong></span>
                <span>Action: <strong className="text-slate-800">{alert.recommendedReview}</strong></span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onOpenFreezeModal(caseItem)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Prepare Freeze Order</span>
              </button>

              <button
                onClick={() => onSelectCase(caseItem)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
              >
                <span>Investigate Lead</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
