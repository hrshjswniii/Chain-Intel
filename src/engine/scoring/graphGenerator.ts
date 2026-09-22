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

  // Construct Nodes
  const nodes: GraphNode[] = [];
  
  // Hop 0: Target Node
  nodes.push({
    id: 'node-target',
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

    nodes.push({
      id: `node-hop-${i}`,
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
  nodes.push({
    id: `node-vasp-deposit`,
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
    const sourceId = i === 0 ? 'node-target' : `node-hop-${i}`;
    const targetId = i === hopsCount - 1 ? 'node-vasp-deposit' : `node-hop-${i + 1}`;
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

// Simple deterministic string hash helper
function crc32(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
