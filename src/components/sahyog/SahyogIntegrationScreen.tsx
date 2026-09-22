import React, { useState } from 'react';
import { MOCK_SAHYOG_ENDPOINTS, createSahyogPayload } from '../../engine/sahyog/sahyogService';
import { InvestigationCase } from '../../types';
import { Code, Send, CheckCircle2 } from 'lucide-react';

interface SahyogIntegrationScreenProps {
  currentCase: InvestigationCase;
}

export const SahyogIntegrationScreen: React.FC<SahyogIntegrationScreenProps> = ({ currentCase }) => {
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [simulationResponse, setSimulationResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const endpoint = MOCK_SAHYOG_ENDPOINTS[activeEndpointIndex];
  const sahyogPayload = createSahyogPayload(currentCase);

  const handleSimulateWebhook = () => {
    setIsSimulating(true);
    setSimulationResponse(null);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResponse(JSON.stringify({
        status: 'SUCCESS',
        sahyogTraceId: `SAHYOG-LE-${Math.floor(10000 + Math.random() * 90000)}`,
        syncTimestamp: new Date().toISOString(),
        destinationVASP: sahyogPayload.nearestDirectDepositVASP,
        confidenceTier: sahyogPayload.confidenceTier,
        confidenceScore: sahyogPayload.confidenceScore,
        reportHashStamp: sahyogPayload.reportHash,
        message: 'Case lead successfully synchronized into Law Enforcement Central Database.',
      }, null, 2));
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
              <Code className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">SAHYOG Integration Prototype</h1>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase">
              Prototype API Layer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Government workflow integration layer for seamless law-enforcement portal interoperability & disclosure requests
          </p>
        </div>

        <button
          onClick={handleSimulateWebhook}
          disabled={isSimulating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center space-x-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSimulating ? 'Sending Payload...' : 'Test Sync Active Case'}</span>
        </button>
      </div>

      {/* API Endpoint Documentation & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint Navigation Sidebar */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available API Endpoints</h3>
          {MOCK_SAHYOG_ENDPOINTS.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveEndpointIndex(idx);
                setSimulationResponse(null);
              }}
              className={`w-full p-3 rounded-md border text-left transition ${
                activeEndpointIndex === idx
                  ? 'bg-blue-50 border-blue-300 text-blue-950'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    ep.method === 'POST' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-bold truncate">{ep.path}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{ep.description}</p>
            </button>
          ))}
        </div>

        {/* Live Payload Code Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-md">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{endpoint.method} {endpoint.path}</span>
              <span>JSON Payload</span>
            </div>

            <div className="p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1 font-sans">
                Request Payload (Active Case: {currentCase.caseReference})
              </span>
              <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-3 bg-slate-950/80 rounded border border-slate-800">
                {JSON.stringify(sahyogPayload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Simulated API Response View */}
          {simulationResponse && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-md">
              <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-mono">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>200 OK (SAHYOG Response)</span>
                </span>
                <span>Response Payload</span>
              </div>
              <div className="p-4">
                <pre className="text-xs font-mono text-blue-300 overflow-x-auto p-3 bg-slate-950/80 rounded border border-slate-800">
                  {simulationResponse}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
