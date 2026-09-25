import React, { useEffect, useRef } from 'react';
import cytoscape, { Core } from 'cytoscape';
// @ts-ignore dagre layout extension
import dagre from 'cytoscape-dagre';
import { GraphNode, GraphEdge } from '../../types';
import { Maximize2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

if (typeof window !== 'undefined') {
  try {
    cytoscape.use(dagre);
  } catch {
    // Registered
  }
}

interface CytoscapeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId?: string;
  selectedEdgeId?: string;
  onSelectNode: (node: GraphNode | null) => void;
  onSelectEdge?: (edge: GraphEdge | null) => void;
  activeHopIndex?: number;
  filterSuspiciousOnly?: boolean;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
  activeHopIndex = -1,
  filterSuspiciousOnly = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const filteredNodes = filterSuspiciousOnly
      ? nodes.filter(n => n.riskLevel === 'HIGH' || n.riskLevel === 'CRITICAL' || n.isDestinationVASP || n.isTarget)
      : nodes;

    const cyNodes = filteredNodes.map((n) => ({
      data: {
        id: n.id,
        label: n.label,
        type: n.type,
        risk: n.riskLevel,
        isTarget: n.isTarget,
        isNearestDeposit: n.isNearestDirectDeposit,
        isVASP: n.isDestinationVASP,
        vaspName: n.vaspName,
      },
    }));

    const cyEdges = edges.map((e) => ({
      data: {
        id: e.id,
        source: e.source,
        target: e.target,
        label: `${e.value || e.amount} ${e.asset}`,
        isSuspicious: e.isSuspicious,
        typology: e.typology,
      },
    }));

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...cyNodes, ...cyEdges],
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#0f172a',
            'font-size': '11px',
            'font-weight': 700,
            'text-valign': 'bottom',
            'text-margin-y': 8,
            'text-wrap': 'wrap',
            'text-max-width': '130px',
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.95,
            'text-background-padding': '4px',
            'text-border-width': '1px',
            'text-border-color': '#cbd5e1',
            'text-border-opacity': 0.9,
            'background-color': '#64748b',
            'width': '44px',
            'height': '44px',
            'border-width': '2px',
            'border-color': '#94a3b8',
          },
        },
        {
          selector: 'node[type = "EXCHANGE_DEPOSIT_WALLET"]',
          style: {
            'shape': 'rectangle',
            'background-color': '#1d4ed8',
            'border-color': '#059669',
            'border-width': '4px',
            'color': '#1e40af',
            'width': '58px',
            'height': '46px',
          },
        },
        {
          selector: 'node[type = "EXCHANGE_HOT_WALLET"], node[type = "EXCHANGE_CLUSTER"], node[type = "VASP"]',
          style: {
            'shape': 'rectangle',
            'background-color': '#1e40af',
            'border-color': '#1e3a8a',
            'border-width': '3px',
            'color': '#1e40af',
            'width': '54px',
            'height': '44px',
          },
        },
        {
          selector: 'node[type = "MIXER_TUMBLER"], node[type = "MIXER"]',
          style: {
            'shape': 'diamond',
            'background-color': '#dc2626',
            'border-color': '#991b1b',
            'border-width': '3px',
            'width': '48px',
            'height': '48px',
          },
        },
        {
          selector: 'node[type = "DEFI_BRIDGE"], node[type = "CROSS_CHAIN_SWAP_SERVICE"], node[type = "BRIDGE"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#d97706',
            'border-color': '#b45309',
            'border-width': '3px',
            'width': '50px',
            'height': '42px',
          },
        },
        {
          selector: 'node[isTarget]',
          style: {
            'border-color': '#2563eb',
            'border-width': '4px',
            'background-color': '#3b82f6',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#059669',
            'border-width': '4px',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'font-weight': 600,
            'color': '#334155',
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.95,
            'text-background-padding': '3px',
            'text-border-width': '1px',
            'text-border-color': '#e2e8f0',
          },
        },
        {
          selector: 'edge[isSuspicious]',
          style: {
            'line-color': '#ea580c',
            'target-arrow-color': '#ea580c',
            'width': 3,
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#059669',
            'target-arrow-color': '#059669',
            'width': 4,
          },
        },
      ] as any,
      layout: {
        name: 'dagre',
        // @ts-ignore
        rankDir: 'LR',
        nodeSep: 70,
        rankSep: 140,
        padding: 50,
      },
    });

    cy.on('tap', 'node', (evt) => {
      const nodeData = evt.target.data();
      const matched = nodes.find((n) => n.id === nodeData.id);
      if (matched) {
        onSelectNode(matched);
        if (onSelectEdge) onSelectEdge(null);
      }
    });

    cy.on('tap', 'edge', (evt) => {
      const edgeData = evt.target.data();
      const matched = edges.find((e) => e.id === edgeData.id);
      if (matched && onSelectEdge) {
        onSelectEdge(matched);
        onSelectNode(null);
      }
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        onSelectNode(null);
        if (onSelectEdge) onSelectEdge(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [nodes, edges, filterSuspiciousOnly]);

  useEffect(() => {
    if (!cyRef.current) return;
    if (selectedNodeId) {
      cyRef.current.$(`node[id = "${selectedNodeId}"]`).select();
    } else {
      cyRef.current.$('node:selected').unselect();
    }
  }, [selectedNodeId]);

  useEffect(() => {
    if (!cyRef.current) return;
    if (selectedEdgeId) {
      cyRef.current.$(`edge[id = "${selectedEdgeId}"]`).select();
    } else {
      cyRef.current.$('edge:selected').unselect();
    }
  }, [selectedEdgeId]);

  useEffect(() => {
    if (!cyRef.current) return;
    if (activeHopIndex >= 0 && activeHopIndex < edges.length) {
      const targetEdge = edges[activeHopIndex];
      if (targetEdge) {
        cyRef.current.edges().removeClass('highlighted-edge');
        const edgeEl = cyRef.current.$(`edge[id = "${targetEdge.id}"]`);
        edgeEl.animate({
          style: {
            'line-color': '#2563eb',
            'target-arrow-color': '#2563eb',
            'width': 4,
          },
          duration: 300,
        });
      }
    }
  }, [activeHopIndex, edges]);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 30);
  const handleResetLayout = () => {
    (cyRef.current as any)?.layout({
      name: 'dagre',
      rankDir: 'LR',
      nodeSep: 60,
      rankSep: 100,
      padding: 40,
    }).run();
  };

  return (
    <div className="relative w-full h-[480px] bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 text-xs text-slate-600 font-medium z-10">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 font-semibold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Transaction Graph View</span>
          </span>
          <span className="text-slate-300">|</span>
          <span>{nodes.length} Nodes</span>
          <span>{edges.length} Edges</span>
        </div>

        <div className="flex items-center space-x-1">
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleFit} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition" title="Fit to Screen">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button onClick={handleResetLayout} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition" title="Reset Layout">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="w-full flex-1 bg-slate-50 cursor-grab active:cursor-grabbing" />

      {/* Forensic Graph Legend */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-white border-t border-slate-200 text-[11px] text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            <span>Suspect Target</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-2.5 bg-blue-700 border border-emerald-500 rounded-xs inline-block"></span>
            <span>Direct Deposit Wallet</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-2.5 bg-blue-900 rounded-xs inline-block"></span>
            <span>Hot Wallet / Cluster</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-amber-600 rounded-xs inline-block"></span>
            <span>Bridge / Swap</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-rose-600 transform rotate-45 inline-block"></span>
            <span>Mixer / Tumbler</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Layout: Dagre (Hierarchical)</span>
        </div>
      </div>
    </div>
  );
};
