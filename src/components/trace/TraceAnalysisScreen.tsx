import React, { useState } from 'react';
import { GraphNode, InvestigationCase } from '../../types';
import { HopPlaybackPlayer } from './HopPlaybackPlayer';
import { CytoscapeGraph } from './CytoscapeGraph';
import { ConfidenceLadderCard } from './ConfidenceLadderCard';
import { InvestigatorStoryCard } from './InvestigatorStoryCard';
import { RightNodeDrawer } from './RightNodeDrawer';
import { EvidenceExplorerTab } from './EvidenceExplorerTab';
import { CaseTimelineTab } from './CaseTimelineTab';
import { GitCommit, ShieldCheck, FileCheck, Lock, Building2 } from 'lucide-react';

interface TraceAnalysisScreenProps {
  activeCase: InvestigationCase;
  onOpenReport: () => void;
  onOpenLegalNotice: () => void;
  onOpenFreezeModal: () => void;
}

export const TraceAnalysisScreen: React.FC<TraceAnalysisScreenProps> = ({
  activeCase,
  onOpenReport,
  onOpenLegalNotice,
  onOpenFreezeModal,
}) => {
  const [activeHopIndex, setActiveHopIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVIDENCE' | 'TIMELINE'>('OVERVIEW');

  const nearestVasp = activeCase.nearestDirectDepositVASP || activeCase.vaspDestination;

  return (
    <div className="space-y-5 relative">
      {/* Top Case Summary Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-bold text-[11px]">
                {activeCase.caseReference}
              </span>
              <span className="text-xs font-semibold text-slate-500">{activeCase.incidentType}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <span className="font-mono">{activeCase.targetInput}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Investigating Officer: {activeCase.investigator} | Data provenance: <strong className="text-slate-700 font-mono">{activeCase.dataSource}</strong>
            </p>
          </div>

          {/* Key Metric Highlights Header */}
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-center">
              <span className="text-[10px] text-blue-800 font-bold block uppercase">Nearest Direct-Deposit VASP</span>
              <span className="font-bold text-slate-900">{nearestVasp}</span>
            </div>

            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Chain</span>
              <span className="font-bold text-slate-900">{activeCase.chain}</span>
            </div>

            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Wallets</span>
              <span className="font-mono font-bold text-slate-900">{activeCase.nodes.length}</span>
            </div>

            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Typologies</span>
              <span className="font-mono font-bold text-amber-600">{activeCase.typologies.length}</span>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
                activeTab === 'OVERVIEW'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Trace Overview & Graph
            </button>
            <button
              onClick={() => setActiveTab('EVIDENCE')}
              className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
                activeTab === 'EVIDENCE'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              View Evidence ({activeCase.evidenceList?.length || 3})
            </button>
            <button
              onClick={() => setActiveTab('TIMELINE')}
              className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
                activeTab === 'TIMELINE'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Forensic Timeline
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenFreezeModal}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold rounded-md border border-rose-200 transition flex items-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Freeze Request (Sec 102)</span>
            </button>

            <button
              onClick={onOpenLegalNotice}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md border border-slate-300 transition"
            >
              Disclosure Request (Sec 91)
            </button>

            <button
              onClick={onOpenReport}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-2xs transition flex items-center space-x-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Hop Animation Player & Transaction Graph */}
          <div className="lg:col-span-2 space-y-4">
            {activeCase.hops && activeCase.hops.length > 0 && (
              <HopPlaybackPlayer
                hops={activeCase.hops}
                activeHopIndex={activeHopIndex}
                onHopChange={(idx) => setActiveHopIndex(idx)}
                targetAddress={activeCase.targetInput}
                vaspDestination={nearestVasp}
              />
            )}

            <div className="relative">
              <CytoscapeGraph
                nodes={activeCase.nodes}
                edges={activeCase.edges}
                selectedNodeId={selectedNode?.id}
                onSelectNode={(node) => setSelectedNode(node)}
                activeHopIndex={activeHopIndex}
              />

              {selectedNode && (
                <div className="absolute right-0 top-0 bottom-0 z-20">
                  <RightNodeDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
                </div>
              )}
            </div>

            <InvestigatorStoryCard caseData={activeCase} />
          </div>

          {/* Right Column: Attribution Confidence Ladder & Risk Info */}
          <div className="space-y-4">
            <ConfidenceLadderCard
              attribution={activeCase.attribution}
              vaspDestination={nearestVasp}
            />

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Suspicious Indicators & Typologies
              </h3>
              <div className="space-y-2">
                {activeCase.typologies.map((typ) => (
                  <div key={typ.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                    <span className="font-semibold text-slate-900 block">{typ.name}</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">{typ.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EVIDENCE' && (
        <EvidenceExplorerTab evidenceList={activeCase.evidenceList || []} />
      )}

      {activeTab === 'TIMELINE' && (
        <CaseTimelineTab timeline={activeCase.timeline || []} />
      )}
    </div>
  );
};
