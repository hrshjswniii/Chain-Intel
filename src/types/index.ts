export type BlockchainType = 
  | 'Ethereum' 
  | 'Bitcoin' 
  | 'Tron' 
  | 'BNB' 
  | 'Solana' 
  | 'Polygon';

export type DataSourceTag = 
  | 'LIVE' 
  | 'PUBLIC BLOCKCHAIN DATA' 
  | 'KNOWN ADDRESS INTELLIGENCE' 
  | 'DEMO' 
  | 'REPRESENTATIVE DATA';

export type AttributionTier = 
  | 'CONFIRMED' 
  | 'HIGHLY_LIKELY' 
  | 'PROBABLE' 
  | 'POSSIBLE' 
  | 'INSUFFICIENT_DATA';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type NodeType = 
  | 'WALLET' 
  | 'UNHOSTED_WALLET'
  | 'EXCHANGE_DEPOSIT_WALLET'
  | 'EXCHANGE_HOT_WALLET'
  | 'EXCHANGE_CLUSTER'
  | 'VASP' 
  | 'MIXER_TUMBLER' 
  | 'DEFI_BRIDGE' 
  | 'CROSS_CHAIN_SWAP_SERVICE'
  | 'CONTRACT' 
  | 'UNKNOWN';

export type TypologySeverity = 'INFO' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type TypologyCode = 
  | 'PEEL_CHAIN' 
  | 'LAYERING' 
  | 'RAPID_CONSOLIDATION' 
  | 'CHAIN_HOPPING' 
  | 'MIXER_INTERACTION'
  | 'RANSOMWARE_OUTFLOW'
  | 'DARKNET_PROCEEDS'
  | 'TERRORISM_FINANCING_RISK';

export type CooperationPriority = 
  | 'DOMESTIC' 
  | 'CROSS_BORDER_STANDARD' 
  | 'CROSS_BORDER_PRIORITY' 
  | 'URGENT_REVIEW';

export interface TypologyItem {
  id: string;
  code: TypologyCode;
  name: string;
  severity: TypologySeverity;
  explanation: string;
  affectedNodes: string[];
  affectedTxHashes: string[];
}

export interface VASPMatch {
  name: string;
  jurisdiction: string;
  countryCode: string;
  cooperationPriority: CooperationPriority;
  addressCount: number;
  verifiedDate: string;
  confidenceLevel: string;
  category: string;
  knownAddressMatches: number;
  complianceContact?: string;
  isDomestic?: boolean;
  isDirectDepositAccepting?: boolean;
  clusterName?: string;
}

export interface ScoringFactor {
  label: string;
  impact: number;
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  category: string;
  description: string;
}

export interface DirectDepositVASPCandidate {
  vaspName: string;
  depositAddress: string;
  hopDistance: number;
  confidenceScore: number;
  isNearestDirectDeposit: boolean;
  clusterRelationship: string;
  cooperationPriority: CooperationPriority;
}

export interface AttributionScore {
  tier: AttributionTier;
  percentage: number;
  baseScore: number;
  finalScore: number;
  factors: ScoringFactor[];
  primaryVASP: string;
  nearestDirectDepositVASP: string;
  nearestDirectDepositAddress?: string;
  isDirectDeposit: boolean;
  candidateVASPs?: DirectDepositVASPCandidate[];
  primaryVASPDetails?: VASPMatch;
  hopDistance: number;
  pathContinuity: string;
}

export interface HopDetail {
  hopIndex: number;
  fromAddress: string;
  toAddress: string;
  txHash: string;
  amount: number;
  asset: string;
  usdValue: number;
  timestamp: string;
  typology?: string;
  isVASP: boolean;
  isDirectDeposit?: boolean;
  vaspName?: string;
  entityType?: NodeType;
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  chain: BlockchainType;
  txCount: number;
  totalVolume: number;
  riskLevel: RiskLevel;
  role: string;
  isTarget?: boolean;
  isNearestDirectDeposit?: boolean;
  isDestinationVASP?: boolean;
  vaspName?: string;
  lastActive: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  asset: string;
  txHash: string;
  timestamp: string;
  typology?: string;
  isSuspicious?: boolean;
}

export interface HighRiskAlert {
  id: string;
  severity: RiskLevel;
  walletAddress: string;
  chain: BlockchainType;
  alertType: 'RANSOMWARE' | 'DARKNET_MARKET' | 'TERRORISM_FINANCING' | 'SANCTIONED_MIXER' | 'FRAUD_SCAM';
  evidence: string;
  source: string;
  timestamp: string;
  confidenceScore: number;
  recommendedReview: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'ADDRESS_MATCH' | 'PATH_CONTINUITY' | 'TYPOLOGY_FLAG' | 'VERIFICATION_AGE' | 'CLUSTER_RELATION' | 'DIRECT_DEPOSIT_MATCH';
  source: string;
  address?: string;
  txHash?: string;
  hopIndex?: number;
  lastVerified: string;
  strength: 'STRONG' | 'MODERATE' | 'WEAK';
  description: string;
}

export interface ForensicTimelineEvent {
  id: string;
  timestamp: string;
  type: 'FUND_RECEIVED' | 'HOP_TRANSFER' | 'SPLIT_TRANSACTION' | 'MIXER_ENTRY' | 'BRIDGE_LOCK' | 'VASP_DEPOSIT' | 'DIRECT_DEPOSIT_SWEEP';
  description: string;
  from: string;
  to: string;
  amount: string;
  txHash: string;
  risk: RiskLevel;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  caseId: string;
  details: string;
  ipAddress: string;
}

export interface SahyogPayload {
  caseReference: string;
  agency: string;
  investigatorId: string;
  targetWallet: string;
  blockchain: BlockchainType;
  nearestDirectDepositVASP: string;
  confidenceTier: AttributionTier;
  confidenceScore: number;
  evidenceSummary: string;
  reportHash: string;
  timestamp: string;
}

export interface InvestigationCase {
  id: string;
  caseReference: string;
  investigator: string;
  incidentType: string;
  targetInput: string;
  inputType: 'WALLET' | 'TX_HASH';
  chain: BlockchainType;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'NEEDS_REVIEW';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  riskLevel: RiskLevel;
  vaspDestination: string;
  nearestDirectDepositVASP: string;
  confidenceTier: AttributionTier;
  confidenceScore: number;
  dataSource: DataSourceTag;
  createdDate: string;
  updatedDate: string;
  maxHops: number;
  minTransferValue: number;
  notes: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  hops: HopDetail[];
  typologies: TypologyItem[];
  attribution: AttributionScore;
  evidenceList: EvidenceItem[];
  timeline: ForensicTimelineEvent[];
  alerts?: HighRiskAlert[];
  narrative: string;
  sha256Hash?: string;
  hashTimestamp?: string;
}

export interface BatchCaseRecord {
  caseId: string;
  walletAddress: string;
  chain: BlockchainType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes: string;
  status?: 'COMPLETED' | 'FAILED' | 'PENDING';
  risk?: RiskLevel;
  vaspMatch?: string;
  confidenceScore?: number;
}

export * from './settings';

