import { BlockchainType } from '../../types';

export type LiveDataStatus =
  | 'SUCCESS_WITH_DATA'
  | 'SUCCESS_NO_TRANSFERS'
  | 'LIVE_DATA_UNAVAILABLE'
  | 'INVALID_INPUT';

export type TraceDirection = 'OUT' | 'IN' | 'BOTH';

export interface NormalizedTransaction {
  chain: BlockchainType;
  txHash: string;
  from: string;
  to: string;
  value: string; // String type to prevent JS floating-point precision loss
  asset: string;
  blockNumber: number;
  blockHash?: string | null;
  timestamp: string;
  direction: 'IN' | 'OUT';
  category?: string;
  uniqueId?: string | null;
  hop?: number;
  source?: string;
}

export interface TraceQueryOptions {
  maxHops?: number;
  maxCounterpartiesPerNode?: number;
  direction?: TraceDirection;
  minimumTransferValue?: number;
  limit?: number;
  pageKey?: string;
}

export interface TraceStatistics {
  nodesDiscovered: number;
  edgesDiscovered: number;
  walletsTraversed: number;
  hopsCompleted: number;
  transactionsFetched: number;
}

export interface ChainAdapterResponse {
  status: LiveDataStatus;
  target?: string;
  chain?: BlockchainType;
  maxHops?: number;
  direction?: TraceDirection;
  maxCounterpartiesPerNode?: number;
  transactions: NormalizedTransaction[];
  nodes?: any[];
  edges?: any[];
  statistics?: TraceStatistics;
  pageKey?: string;
  message?: string;
  warnings?: string[];
}

export interface ChainAdapter {
  chain: BlockchainType;
  getTransactions(address: string, options?: TraceQueryOptions): Promise<ChainAdapterResponse>;
}
