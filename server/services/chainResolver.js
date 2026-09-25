import { getAdaptersForAddressFormat } from '../adapters/adapterRegistry.js';

/**
 * Multi-Chain Resolution Service
 * Probes supported blockchains using live RPC/provider context to determine
 * whether observable activity exists for a given wallet address across all 6 supported networks:
 * Ethereum, Polygon, BNB, Solana, TRON, Bitcoin.
 */
export async function resolveAddressNetworks(address) {
  const trimmed = address ? address.trim() : '';

  if (!trimmed) {
    return {
      address: '',
      isValidAddress: false,
      status: 'INVALID_ADDRESS',
      matches: [],
      message: 'Wallet address parameter is required.',
    };
  }

  // Get candidate adapters based on address format
  const candidateAdapters = getAdaptersForAddressFormat(trimmed);

  if (candidateAdapters.length === 0) {
    return {
      address: trimmed,
      isValidAddress: false,
      status: 'INVALID_ADDRESS',
      matches: [],
      message: 'Invalid address format. Supplied input does not match valid address syntax for any supported network (Ethereum, Polygon, BNB, Solana, TRON, Bitcoin).',
    };
  }

  const matches = [];
  let providerErrorOccurred = false;
  let lastErrorMessage = '';

  // Concurrently probe all candidate network adapters
  const probePromises = candidateAdapters.map(async (adapter) => {
    try {
      const res = await adapter.fetchTransfers(trimmed, { direction: 'BOTH' });
      if (res.status === 'LIVE_DATA_UNAVAILABLE') {
        return { adapter, status: 'ERROR', message: res.message };
      }
      if (res.transactions && res.transactions.length > 0) {
        return {
          adapter,
          status: 'ACTIVITY',
          evidence: {
            transactionCount: res.transactions.length,
            latestBlock: res.transactions[0]?.blockNumber || 'N/A',
            latestActivity: res.transactions[0]?.timestamp || new Date().toISOString(),
          },
        };
      }
      return { adapter, status: 'NO_ACTIVITY' };
    } catch (err) {
      return { adapter, status: 'ERROR', message: err.message };
    }
  });

  const probeResults = await Promise.all(probePromises);

  for (const r of probeResults) {
    if (r.status === 'ERROR') {
      providerErrorOccurred = true;
      lastErrorMessage = r.message || `${r.adapter.name} provider RPC error`;
    } else if (r.status === 'ACTIVITY') {
      matches.push({
        chain: r.adapter.chain,
        chainId: r.adapter.chainId,
        name: r.adapter.name,
        hasActivity: true,
        evidence: r.evidence,
      });
    }
  }

  if (matches.length === 1) {
    return {
      address: trimmed,
      isValidAddress: true,
      status: 'RESOLVED',
      matches,
    };
  }

  if (matches.length > 1) {
    return {
      address: trimmed,
      isValidAddress: true,
      status: 'MULTIPLE_NETWORKS',
      matches,
    };
  }

  if (providerErrorOccurred) {
    return {
      address: trimmed,
      isValidAddress: true,
      status: 'LIVE_DATA_UNAVAILABLE',
      matches: [],
      message: `Network resolution failed due to provider error: ${lastErrorMessage}. No fallback or mock data was used.`,
    };
  }

  return {
    address: trimmed,
    isValidAddress: true,
    status: 'NO_ACTIVITY',
    matches: [],
    message: 'The supplied address has no observable activity on the currently supported networks.',
  };
}
