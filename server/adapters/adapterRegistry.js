import { fetchEthereumTransfers, recursiveTraceEthereum } from './ethereumAdapter.js';
import { fetchPolygonTransfers, recursiveTracePolygon } from './polygonAdapter.js';
import { fetchBnbTransfers, recursiveTraceBnb } from './bnbAdapter.js';
import { fetchSolanaTransfers, recursiveTraceSolana } from './solanaAdapter.js';
import { fetchTronTransfers, recursiveTraceTron } from './tronAdapter.js';
import { fetchBitcoinTransfers, recursiveTraceBitcoin } from './bitcoinAdapter.js';

export const chainAdapters = {
  Ethereum: {
    chain: 'Ethereum',
    chainId: 1,
    name: 'Ethereum Mainnet',
    validateAddress: (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim()),
    fetchTransfers: fetchEthereumTransfers,
    recursiveTrace: recursiveTraceEthereum,
  },
  Polygon: {
    chain: 'Polygon',
    chainId: 137,
    name: 'Polygon Mainnet',
    validateAddress: (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim()),
    fetchTransfers: fetchPolygonTransfers,
    recursiveTrace: recursiveTracePolygon,
  },
  BNB: {
    chain: 'BNB',
    chainId: 56,
    name: 'BNB Smart Chain',
    validateAddress: (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim()),
    fetchTransfers: fetchBnbTransfers,
    recursiveTrace: recursiveTraceBnb,
  },
  Solana: {
    chain: 'Solana',
    chainId: 101,
    name: 'Solana Mainnet',
    validateAddress: (addr) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr.trim()),
    fetchTransfers: fetchSolanaTransfers,
    recursiveTrace: recursiveTraceSolana,
  },
  Tron: {
    chain: 'Tron',
    chainId: 728126428,
    name: 'TRON Mainnet',
    validateAddress: (addr) => /^T[a-zA-HJ-NP-Z0-9]{33}$/.test(addr.trim()),
    fetchTransfers: fetchTronTransfers,
    recursiveTrace: recursiveTraceTron,
  },
  Bitcoin: {
    chain: 'Bitcoin',
    chainId: 0,
    name: 'Bitcoin Mainnet',
    validateAddress: (addr) => /^(bc1|[13])[a-zA-HJ-NP-Za-km-z0-9]{25,62}$/.test(addr.trim()),
    fetchTransfers: fetchBitcoinTransfers,
    recursiveTrace: recursiveTraceBitcoin,
  },
};

export function getAdapter(chainName) {
  if (!chainName) return null;
  const key = Object.keys(chainAdapters).find(
    (k) => k.toLowerCase() === chainName.trim().toLowerCase()
  );
  return key ? chainAdapters[key] : null;
}

export function getAdaptersForAddressFormat(address) {
  const clean = (address || '').trim();
  if (!clean) return [];

  const candidateAdapters = [];

  // EVM 0x address format
  if (/^0x[a-fA-F0-9]{40}$/.test(clean)) {
    candidateAdapters.push(chainAdapters.Ethereum, chainAdapters.Polygon, chainAdapters.BNB);
  }
  // TRON T address format
  else if (/^T[a-zA-HJ-NP-Z0-9]{33}$/.test(clean)) {
    candidateAdapters.push(chainAdapters.Tron);
  }
  // Bitcoin address format
  else if (/^(bc1|[13])[a-zA-HJ-NP-Za-km-z0-9]{25,62}$/.test(clean)) {
    candidateAdapters.push(chainAdapters.Bitcoin);
  }
  // Solana Base58 format (excluding TRON T format)
  else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean)) {
    candidateAdapters.push(chainAdapters.Solana);
  }

  return candidateAdapters;
}
