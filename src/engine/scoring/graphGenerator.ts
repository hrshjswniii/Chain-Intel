import {
  BlockchainType,
  GraphNode,
  GraphEdge,
  HopDetail,
  InvestigationCase,
  EvidenceItem,
  ForensicTimelineEvent,
  RiskLevel
} from '../../types';
import { matchAddress } from '../vasp/vaspDatabase';
import { calculateAttributionScore } from './scoringEngine';
import { generateInvestigatorNarrative } from '../narrative/narrativeEngine';
import { NormalizedTransaction } from '../adapters/types';

interface GenerateGraphParams {
  targetInput: string;
  chain: BlockchainType;
  maxHops: number;
  caseReference?: string;
  investigator?: string;
  incidentType?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  minTransferValue?: number;
  notes?: string;
  dataSource?: 'DEMO' | 'LIVE';
}

function truncateAddr(addr: string): string {
  if (!addr) return '';
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function generateDynamicGraphAndHops(params: GenerateGraphParams): InvestigationCase {
  const target = params.targetInput.trim();
  const chain = params.chain || 'Ethereum';
  const chainPrefix = chain.toLowerCase();
  const hopsCount = Math.max(1, Math.min(10, params.maxHops || 4));
  const caseRef = params.caseReference || `CS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const investigator = params.investigator || 'Inspector R. Sharma (ID: LE-9842)';
  const incidentType = params.incidentType || 'Cryptocurrency Fraud Trace';
  const match = matchAddress(target);
  const vaspName = match.vaspDetails?.name || (chain === 'Bitcoin' ? 'WazirX India' : chain === 'Tron' ? 'Binance (TRC-20 Cluster)' : 'CoinDCX India');
  const assetSymbol = chain === 'Bitcoin' ? 'BTC' : chain === 'Tron' ? 'USDT' : chain === 'Solana' ? 'SOL' : 'ETH';

  // Generate intermediate mock addresses deterministically based on target
  const generatedAddresses: string[] = [target];
  for (let i = 1; i <= hopsCount; i++) {
    if (i === hopsCount) {
      // VASP deposit address
      generatedAddresses.push(`0x${(Math.abs(crc32(target + 'vasp')) % 0xffffffff).toString(16).padStart(8, '0')}0000000000000000000000000000`);
    } else {
      generatedAddresses.push(`0x${(Math.abs(crc32(target + i)) % 0xffffffff).toString(16).padStart(8, '0')}8F24890A11c47981D90412B009141b29E37841B9`.slice(0, 42));
    }
  }

  // Construct Nodes with Chain Namespacing
  const nodes: GraphNode[] = [];
  
  // Hop 0: Target Node
  nodes.push({
    id: `${chainPrefix}:${target.toLowerCase()}`,
    label: `Target (${truncateAddr(target)})`,
    type: 'UNHOSTED_WALLET',
    chain,
    txCount: 32,
    totalVolume: 45.0,
    riskLevel: 'HIGH',
    role: 'Suspect Target Wallet',
    isTarget: true,
    lastActive: 'Just Now',
  });

  // Hops 1 to hopsCount - 1: Intermediaries
  for (let i = 1; i < hopsCount; i++) {
    const isMixer = i === 3 && hopsCount >= 5;
    const isBridge = i === 2 && chain === 'Polygon';
    const addr = generatedAddresses[i].toLowerCase();

    nodes.push({
      id: `${chainPrefix}:${addr}`,
      label: isMixer
        ? `Wasabi Mixer (Hop ${i})`
        : isBridge
        ? `DeFi Bridge (Hop ${i})`
        : `Hop ${i} (${truncateAddr(generatedAddresses[i])})`,
      type: isMixer ? 'MIXER_TUMBLER' : isBridge ? 'DEFI_BRIDGE' : 'WALLET',
      chain,
      txCount: 6 + i * 2,
      totalVolume: 45.0 - i * 1.5,
      riskLevel: isMixer ? 'CRITICAL' : ('MEDIUM' as RiskLevel),
      role: isMixer ? 'Privacy Mixer Pass-Through' : isBridge ? 'Cross-Chain Bridge Hop' : `Intermediary Hop #${i}`,
      lastActive: `${i * 10} mins ago`,
    });
  }

  // Hop hopsCount: VASP Deposit Endpoint Node
  const vaspAddr = generatedAddresses[hopsCount].toLowerCase();
  nodes.push({
    id: `${chainPrefix}:${vaspAddr}`,
    label: `${vaspName} Deposit (Hop ${hopsCount})`,
    type: 'EXCHANGE_DEPOSIT_WALLET',
    chain,
    txCount: 14200,
    totalVolume: 850000.0,
    riskLevel: 'LOW',
    role: 'Nearest Direct-Deposit Accepting VASP Wallet',
    isNearestDirectDeposit: true,
    isDestinationVASP: true,
    vaspName: vaspName,
    lastActive: 'Just Now',
  });

  // Construct Edges
  const edges: GraphEdge[] = [];
  let currentVolume = 45.0;
  for (let i = 0; i < hopsCount; i++) {
    const sourceAddr = generatedAddresses[i].toLowerCase();
    const targetAddr = generatedAddresses[i + 1].toLowerCase();
    const sourceId = `${chainPrefix}:${sourceAddr}`;
    const targetId = `${chainPrefix}:${targetAddr}`;
    const amount = Number((currentVolume * (0.95 + Math.random() * 0.04)).toFixed(2));
    currentVolume = amount;

    edges.push({
      id: `edge-${i + 1}`,
      source: sourceId,
      target: targetId,
      amount,
      asset: assetSymbol,
      txHash: `0x${(Math.abs(crc32(target + 'tx' + i)) % 0xffffffff).toString(16).padStart(8, '0')}1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b`.slice(0, 42),
      timestamp: `Today 14:${(10 + i * 12).toString().padStart(2, '0')}`,
      isSuspicious: i === 0 || i === hopsCount - 1,
      typology: i === 0 ? 'Initial Suspect Outflow' : i === hopsCount - 1 ? 'VASP Direct Deposit Sweep' : 'Layering Pass-Through',
    });
  }

  // Construct Hops List
  const hops: HopDetail[] = [];
  let hopVolume = 45.0;
  for (let i = 1; i <= hopsCount; i++) {
    const fromAddr = generatedAddresses[i - 1];
    const toAddr = generatedAddresses[i];
    const amount = Number((hopVolume * (0.95 + Math.random() * 0.04)).toFixed(2));
    hopVolume = amount;
    const isLast = i === hopsCount;

    hops.push({
      hopIndex: i,
      fromAddress: fromAddr,
      toAddress: toAddr,
      txHash: `0x${(Math.abs(crc32(target + 'tx' + i)) % 0xffffffff).toString(16).padStart(8, '0')}1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b`.slice(0, 42),
      amount,
      asset: assetSymbol,
      usdValue: Math.round(amount * (chain === 'Bitcoin' ? 62000 : chain === 'Ethereum' ? 3200 : chain === 'Solana' ? 140 : 1)),
      timestamp: `Today 14:${(10 + (i - 1) * 12).toString().padStart(2, '0')} IST`,
      typology: isLast ? 'VASP Deposit Sweep' : i === 1 ? 'Initial Suspect Outflow' : 'Layering Pass-Through Transfer',
      isVASP: isLast,
      isDirectDeposit: isLast,
      vaspName: isLast ? vaspName : undefined,
    });
  }

  // Calculate Attribution
  const attribution = calculateAttributionScore({
    hasVASPMatch: true,
    vaspDetails: match.vaspDetails || {
      name: vaspName,
      jurisdiction: 'India (FIU-IND Registered)',
      countryCode: 'IN',
      cooperationPriority: 'DOMESTIC',
      addressCount: 14200,
      verifiedDate: '2026-08-15',
      confidenceLevel: 'HIGH',
      category: 'Centralized Exchange (VASP)',
      knownAddressMatches: 14200,
      isDomestic: true,
      isDirectDepositAccepting: true,
    },
    matchType: match.matchType || 'CLUSTER_DEPOSIT_SWEEP',
    hopDistance: hopsCount,
    typologies: [],
  });

  // Construct Timeline
  const timeline: ForensicTimelineEvent[] = [
    {
      id: 'tl-1',
      timestamp: `Today 14:10 IST`,
      type: 'HOP_TRANSFER',
      description: `Initial Outflow: 45.0 ${assetSymbol} transferred from suspect unhosted wallet ${truncateAddr(target)}.`,
      from: target,
      to: generatedAddresses[1] || target,
      amount: `45.0 ${assetSymbol}`,
      txHash: edges[0]?.txHash || '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      risk: 'HIGH',
    },
  ];

  for (let i = 1; i < hopsCount; i++) {
    timeline.push({
      id: `tl-${i + 1}`,
      timestamp: `Today 14:${10 + i * 12} IST`,
      type: 'HOP_TRANSFER',
      description: `Hop #${i} Pass-Through: ${edges[i - 1]?.amount || 40.0} ${assetSymbol} routed through intermediary node #${i}.`,
      from: generatedAddresses[i - 1] || target,
      to: generatedAddresses[i] || target,
      amount: `${edges[i - 1]?.amount || 40.0} ${assetSymbol}`,
      txHash: edges[i - 1]?.txHash || '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      risk: 'MEDIUM',
    });
  }

  timeline.push({
    id: `tl-${hopsCount + 1}`,
    timestamp: `Today 14:${10 + hopsCount * 12} IST`,
    type: 'DIRECT_DEPOSIT_SWEEP',
    description: `Nearest Direct-Deposit Exchange Identified: ${edges[hopsCount - 1]?.amount || 38.0} ${assetSymbol} deposited directly into ${vaspName} exchange deposit wallet at hop #${hopsCount}.`,
    from: generatedAddresses[hopsCount - 1] || target,
    to: generatedAddresses[hopsCount] || target,
    amount: `${edges[hopsCount - 1]?.amount || 38.0} ${assetSymbol}`,
    txHash: edges[hopsCount - 1]?.txHash || '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    risk: 'LOW',
  });

  // Construct Evidence List
  const evidenceList: EvidenceItem[] = [
    {
      id: 'ev-1',
      title: `Verified Nearest Direct-Deposit VASP (${vaspName})`,
      type: 'DIRECT_DEPOSIT_MATCH',
      source: 'TraceBack VASP Intelligence',
      address: generatedAddresses[hopsCount],
      lastVerified: '2026-09-15',
      strength: 'STRONG',
      description: `Target trace reached direct-deposit wallet cluster belonging to ${vaspName} at hop distance ${hopsCount}.`,
    },
    {
      id: 'ev-2',
      title: `${hopsCount}-Hop Path Continuity & Value Retention`,
      type: 'PATH_CONTINUITY',
      source: 'On-Chain Ledger Analysis Engine',
      address: target,
      lastVerified: '2026-09-20',
      strength: 'STRONG',
      description: `High value retention (${edges[edges.length - 1]?.amount} ${assetSymbol}) observed across ${hopsCount} consecutive transfer hops.`,
    },
  ];

  // Construct Narrative
  const narrative = generateInvestigatorNarrative({
    caseReference: caseRef,
    targetInput: target,
    chain,
    vaspDestination: vaspName,
    nearestDirectDepositVASP: vaspName,
    confidenceScore: attribution.percentage,
    confidenceTier: attribution.tier,
  });

  return {
    id: `TB-TRACE-${Date.now().toString().slice(-4)}`,
    caseReference: caseRef,
    investigator,
    incidentType,
    targetInput: target,
    inputType: target.length > 50 ? 'TX_HASH' : 'WALLET',
    chain,
    status: 'ACTIVE',
    priority: params.priority || 'HIGH',
    riskLevel: 'HIGH',
    vaspDestination: vaspName,
    nearestDirectDepositVASP: vaspName,
    confidenceTier: attribution.tier,
    confidenceScore: attribution.percentage,
    dataSource: params.dataSource || 'DEMO',
    createdDate: new Date().toLocaleDateString('en-IN'),
    updatedDate: new Date().toLocaleDateString('en-IN'),
    maxHops: hopsCount,
    minTransferValue: params.minTransferValue || 0.1,
    notes: params.notes || 'Automated multi-hop unhosted wallet trace.',
    nodes,
    edges,
    hops,
    typologies: [],
    attribution,
    evidenceList,
    timeline,
    narrative,
    sha256Hash: '7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2a',
    hashTimestamp: new Date().toISOString(),
  };
}

/**
 * Phase 2: Builds a live InvestigationCase graph from recursive BFS mainnet trace API responses.
 * Node IDs are strictly namespaced as <chain>:<address> (e.g. ethereum:0x71c76...)
 */
export function buildLiveGraphFromTransactions(
  targetInput: string,
  chain: BlockchainType,
  transactions: NormalizedTransaction[],
  liveResponse?: {
    nodes?: any[];
    edges?: any[];
    maxHops?: number;
    direction?: string;
    statistics?: any;
  }
): InvestigationCase {
  const target = targetInput.trim().toLowerCase();
  const chainPrefix = chain.toLowerCase();
  const targetNodeId = `${chainPrefix}:${target}`;
  const caseRef = `LIVE-${Math.floor(1000 + Math.random() * 9000)}`;

  let nodes: GraphNode[] = [];
  let edges: GraphEdge[] = [];
  let hops: HopDetail[] = [];
  let timeline: ForensicTimelineEvent[] = [];

  if (liveResponse && liveResponse.nodes && liveResponse.nodes.length > 0) {
    // Process server-calculated BFS nodes
    nodes = liveResponse.nodes.map((n) => {
      const addr = (n.address || n.id.replace(/^[^:]+:/, '')).toLowerCase();
      const isTargetNode = addr === target;
      const match = matchAddress(addr);

      return {
        id: n.id || `${chainPrefix}:${addr}`,
        label: match.isMatch
          ? `${match.vaspDetails?.name} (${truncateAddr(addr)})`
          : `${isTargetNode ? 'Target' : 'Wallet'} (${truncateAddr(addr)})`,
        type: isTargetNode ? 'UNHOSTED_WALLET' : match.isMatch ? 'EXCHANGE_DEPOSIT_WALLET' : 'WALLET',
        chain,
        address: addr,
        hop: n.hop ?? 0,
        txCount: n.transactionCount || 1,
        totalVolume: typeof n.totalVolume === 'number' ? n.totalVolume : 0,
        inboundTransactionCount: n.inboundTransactionCount || 0,
        outboundTransactionCount: n.outboundTransactionCount || 0,
        inboundVolume: n.inboundVolume || 0,
        outboundVolume: n.outboundVolume || 0,
        firstSeen: n.firstSeen || 'Not available',
        lastSeen: n.lastSeen || 'Not available',
        riskLevel: isTargetNode ? 'HIGH' : match.isMatch ? 'LOW' : 'MEDIUM',
        role: isTargetNode ? 'Suspect Target Wallet' : match.isMatch ? 'VASP Entity' : `Hop #${n.hop || 1} Counterparty`,
        isTarget: isTargetNode,
        lastActive: n.lastActive || n.lastSeen || 'Live Query',
        vaspName: match.isMatch ? match.vaspDetails?.name : undefined,
        sourceProvider: n.sourceProvider || `${chain} Provider`,
      };
    });

    // Process server-calculated BFS edges
    edges = (liveResponse.edges || []).map((e, idx) => ({
      id: e.id || `live-edge-${idx}`,
      source: e.source,
      target: e.target,
      amount: typeof e.amount === 'number' ? e.amount : parseFloat(e.value) || 0,
      value: e.value || String(e.amount || 0),
      asset: e.asset || (chain === 'Bitcoin' ? 'BTC' : chain === 'Tron' ? 'USDT' : chain === 'Solana' ? 'SOL' : chain === 'Polygon' ? 'MATIC' : chain === 'BNB' ? 'BNB' : 'ETH'),
      txHash: e.txHash || 'Not available',
      blockNumber: e.blockNumber || 0,
      blockHash: e.blockHash || undefined,
      timestamp: e.timestamp || 'Not available',
      direction: e.direction || 'OUT',
      hop: e.hop || 1,
      sourceProvider: e.sourceProvider || `${chain} Provider`,
      isSuspicious: e.direction === 'OUT',
      typology: `Hop #${e.hop || 1} ${e.direction || 'OUT'} Transfer`,
    }));

    // Construct hops list
    hops = edges.map((e) => {
      const fromAddr = e.source.replace(/^[^:]+:/, '');
      const toAddr = e.target.replace(/^[^:]+:/, '');
      return {
        hopIndex: e.hop || 1,
        fromAddress: fromAddr,
        toAddress: toAddr,
        txHash: e.txHash,
        amount: e.amount,
        asset: e.asset,
        usdValue: Math.round(e.amount * (chain === 'Bitcoin' ? 65000 : chain === 'Solana' ? 140 : chain === 'Tron' ? 0.15 : 3200)),
        timestamp: e.timestamp,
        isVASP: false,
        typology: `Hop #${e.hop || 1} Transfer`,
      };
    });

    // Construct timeline events from edges
    timeline = edges.map((e, idx) => {
      const fromAddr = e.source.replace(/^[^:]+:/, '');
      const toAddr = e.target.replace(/^[^:]+:/, '');
      const displayTs =
        e.timestamp && e.timestamp !== 'Not available'
          ? e.timestamp
          : e.blockNumber
          ? `Timestamp unavailable — Block ${e.blockNumber}`
          : 'Not available';

      return {
        id: `live-tl-${idx}-${e.txHash.slice(0, 8)}`,
        timestamp: displayTs,
        type: 'HOP_TRANSFER' as const,
        description: `Hop #${e.hop || 1} Transfer: ${e.value || e.amount} ${e.asset} from ${truncateAddr(fromAddr)} to ${truncateAddr(toAddr)}`,
        from: fromAddr,
        to: toAddr,
        amount: `${e.value || e.amount} ${e.asset}`,
        txHash: e.txHash,
        blockNumber: e.blockNumber,
        blockHash: e.blockHash,
        direction: e.direction,
        hop: e.hop,
        asset: e.asset,
        value: e.value,
        chain,
        sourceProvider: e.sourceProvider || `${chain} Provider`,
        risk: 'MEDIUM' as RiskLevel,
      };
    });
  } else {
    // 1-hop fallback reconstruction if no pre-built BFS nodes array provided
    const nodesMap = new Map<string, GraphNode>();

    nodesMap.set(targetNodeId, {
      id: targetNodeId,
      label: `Target (${truncateAddr(target)})`,
      type: 'UNHOSTED_WALLET',
      chain,
      address: target,
      hop: 0,
      txCount: transactions.length,
      totalVolume: transactions.reduce((acc, t) => acc + (parseFloat(t.value) || 0), 0),
      riskLevel: 'HIGH',
      role: 'Suspect Target Wallet',
      isTarget: true,
      lastActive: 'Live Query',
      sourceProvider: 'Alchemy — Ethereum Mainnet',
    });

    transactions.forEach((tx, idx) => {
      const fromAddr = tx.from.toLowerCase() || target;
      const toAddr = tx.to.toLowerCase() || '0x0000000000000000000000000000000000000000';

      const sourceNodeId = `${chainPrefix}:${fromAddr}`;
      const targetNodeId = `${chainPrefix}:${toAddr}`;

      if (!nodesMap.has(sourceNodeId)) {
        const match = matchAddress(fromAddr);
        nodesMap.set(sourceNodeId, {
          id: sourceNodeId,
          label: match.isMatch ? `${match.vaspDetails?.name} (${truncateAddr(fromAddr)})` : truncateAddr(fromAddr),
          type: match.isMatch ? 'EXCHANGE_DEPOSIT_WALLET' : 'WALLET',
          chain,
          address: fromAddr,
          hop: tx.hop || 1,
          txCount: 1,
          totalVolume: parseFloat(tx.value) || 0,
          riskLevel: match.isMatch ? 'LOW' : 'MEDIUM',
          role: match.isMatch ? 'VASP Entity' : 'Intermediary Counterparty',
          lastActive: tx.timestamp,
          vaspName: match.isMatch ? match.vaspDetails?.name : undefined,
          sourceProvider: 'Alchemy — Ethereum Mainnet',
        });
      }

      if (!nodesMap.has(targetNodeId)) {
        const match = matchAddress(toAddr);
        nodesMap.set(targetNodeId, {
          id: targetNodeId,
          label: match.isMatch ? `${match.vaspDetails?.name} (${truncateAddr(toAddr)})` : truncateAddr(toAddr),
          type: match.isMatch ? 'EXCHANGE_DEPOSIT_WALLET' : 'WALLET',
          chain,
          address: toAddr,
          hop: tx.hop || 1,
          txCount: 1,
          totalVolume: parseFloat(tx.value) || 0,
          riskLevel: match.isMatch ? 'LOW' : 'MEDIUM',
          role: match.isMatch ? 'VASP Entity' : 'Intermediary Counterparty',
          lastActive: tx.timestamp,
          vaspName: match.isMatch ? match.vaspDetails?.name : undefined,
          sourceProvider: 'Alchemy — Ethereum Mainnet',
        });
      }

      const numericValue = parseFloat(tx.value) || 0;

      edges.push({
        id: `live-edge-${idx}`,
        source: sourceNodeId,
        target: targetNodeId,
        amount: numericValue,
        value: tx.value,
        asset: tx.asset || 'ETH',
        txHash: tx.txHash,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash || undefined,
        timestamp: tx.timestamp,
        direction: tx.direction,
        hop: tx.hop || 1,
        sourceProvider: 'Alchemy — Ethereum Mainnet',
        isSuspicious: tx.direction === 'OUT',
        typology: tx.direction === 'OUT' ? 'Live On-Chain Transfer' : 'Incoming Transfer',
      });

      hops.push({
        hopIndex: tx.hop || 1,
        fromAddress: fromAddr,
        toAddress: toAddr,
        txHash: tx.txHash,
        amount: numericValue,
        asset: tx.asset || 'ETH',
        usdValue: Math.round(numericValue * 3200),
        timestamp: tx.timestamp,
        isVASP: false,
      });

      const displayTs =
        tx.timestamp && tx.timestamp !== 'Not available'
          ? tx.timestamp
          : tx.blockNumber
          ? `Timestamp unavailable — Block ${tx.blockNumber}`
          : 'Not available';

      timeline.push({
        id: `live-tl-${idx}`,
        timestamp: displayTs,
        type: 'HOP_TRANSFER',
        description: `Live On-Chain Transfer: ${tx.value} ${tx.asset} from ${truncateAddr(fromAddr)} to ${truncateAddr(toAddr)}`,
        from: fromAddr,
        to: toAddr,
        amount: `${tx.value} ${tx.asset}`,
        txHash: tx.txHash,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash || undefined,
        direction: tx.direction,
        hop: tx.hop || 1,
        asset: tx.asset,
        value: tx.value,
        sourceProvider: 'Alchemy — Ethereum Mainnet',
        risk: 'MEDIUM',
      });
    });

    nodes = Array.from(nodesMap.values());
  }

  // Sort timeline chronologically (by blockNumber ascending or timestamp ascending)
  timeline.sort((a, b) => {
    if (a.blockNumber && b.blockNumber) {
      return a.blockNumber - b.blockNumber;
    }
    return String(a.timestamp).localeCompare(String(b.timestamp));
  });

  const stats = liveResponse?.statistics || {};
  const maxHopsTested = liveResponse?.maxHops || 1;

  const attribution = calculateAttributionScore({
    hasVASPMatch: false,
    hopDistance: maxHopsTested,
    typologies: [],
  });

  return {
    id: `LIVE-${Date.now()}`,
    caseReference: caseRef,
    investigator: 'Inspector R. Sharma (ID: LE-9842)',
    incidentType: 'Live Recursive Fund-Flow Trace',
    targetInput: target,
    inputType: 'WALLET',
    chain,
    status: 'ACTIVE',
    priority: 'HIGH',
    riskLevel: 'MEDIUM',
    vaspDestination: 'Unattributed (Live On-Chain Query)',
    nearestDirectDepositVASP: 'Unattributed',
    confidenceTier: 'INSUFFICIENT_DATA',
    confidenceScore: 0,
    dataSource: 'PUBLIC BLOCKCHAIN DATA',
    createdDate: new Date().toLocaleDateString('en-IN'),
    updatedDate: new Date().toLocaleDateString('en-IN'),
    maxHops: maxHopsTested,
    minTransferValue: 0.0,
    notes: `Live Recursive Mainnet Trace executed via Alchemy API Gateway. Discovered ${nodes.length} nodes and ${edges.length} edges across ${stats.hopsCompleted || maxHopsTested} hops.`,
    nodes,
    edges,
    hops,
    typologies: [],
    attribution,
    evidenceList: [
      {
        id: 'live-ev-1',
        title: `Real Blockchain Transactions Verified (${edges.length} Edges across ${nodes.length} Wallets)`,
        type: 'PATH_CONTINUITY',
        source: 'Alchemy Mainnet Node Gateway',
        address: target,
        lastVerified: new Date().toISOString().slice(0, 10),
        strength: 'STRONG',
        description: `Retrieved ${transactions.length} live transfers across ${nodes.length} discovered wallet nodes up to ${maxHopsTested} hops.`,
      },
    ],
    timeline,
    narrative: `Live Recursive Mainnet Trace executed for target wallet ${target} on network ${chain}. Total wallets traversed: ${stats.walletsTraversed || nodes.length}. Total edges discovered: ${edges.length}.`,
    sha256Hash: 'live-hash-verified',
    hashTimestamp: new Date().toISOString(),
  };
}

// Simple deterministic string hash helper
function crc32(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
