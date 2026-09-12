import { BlockchainType, DataSourceTag, InvestigationCase } from '../../types';
import { matchAddress } from '../vasp/vaspDatabase';

export interface ChainAdapter {
  chain: BlockchainType;
  validateAddress(address: string): boolean;
  validateTxHash(txHash: string): boolean;
  fetchTrace(input: string, maxHops: number): Promise<Partial<InvestigationCase>>;
}

export function detectChainAndType(input: string): { chain: BlockchainType; inputType: 'WALLET' | 'TX_HASH'; isValid: boolean } {
  const clean = input.trim();
  
  // Ethereum / EVM Wallet Address: 0x + 40 hex chars
  if (/^0x[a-fA-F0-9]{40}$/.test(clean)) {
    return { chain: 'Ethereum', inputType: 'WALLET', isValid: true };
  }

  // EVM Tx Hash: 0x + 64 hex chars
  if (/^0x[a-fA-F0-9]{64}$/.test(clean)) {
    return { chain: 'Ethereum', inputType: 'TX_HASH', isValid: true };
  }

  // Bitcoin Address (Bech32 bc1... or Base58 1... 3...)
  if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(clean)) {
    return { chain: 'Bitcoin', inputType: 'WALLET', isValid: true };
  }

  // Solana (Base58 32-44 chars)
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean)) {
    return { chain: 'Solana', inputType: 'WALLET', isValid: true };
  }

  // Default fallback for heuristic matching
  if (clean.startsWith('0x')) {
    return { chain: 'Ethereum', inputType: 'WALLET', isValid: true };
  }
  if (clean.startsWith('bc1') || clean.startsWith('1') || clean.startsWith('3')) {
    return { chain: 'Bitcoin', inputType: 'WALLET', isValid: true };
  }

  return { chain: 'Ethereum', inputType: 'WALLET', isValid: false };
}

export class EthereumAdapter implements ChainAdapter {
  chain: BlockchainType = 'Ethereum';

  validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
  }

  validateTxHash(txHash: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(txHash.trim());
  }

  async fetchTrace(input: string, maxHops: number): Promise<Partial<InvestigationCase>> {
    const match = matchAddress(input);
    
    return {
      chain: 'Ethereum',
      targetInput: input,
      dataSource: 'DEMO' as DataSourceTag,
      maxHops,
      vaspDestination: match.isMatch ? match.vaspDetails?.name || 'VASP' : 'Unattributed',
    };
  }
}

export class BitcoinAdapter implements ChainAdapter {
  chain: BlockchainType = 'Bitcoin';

  validateAddress(address: string): boolean {
    return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address.trim());
  }

  validateTxHash(txHash: string): boolean {
    return /^[a-fA-F0-9]{64}$/.test(txHash.trim());
  }

  async fetchTrace(input: string, maxHops: number): Promise<Partial<InvestigationCase>> {
    return {
      chain: 'Bitcoin',
      targetInput: input,
      dataSource: 'DEMO' as DataSourceTag,
      maxHops,
      vaspDestination: 'Unattributed',
    };
  }
}
