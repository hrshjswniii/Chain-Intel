export interface NetworkMatch {
  chain: string;
  chainId: number;
  name: string;
  hasActivity: boolean;
  evidence?: {
    transactionCount: number;
    latestBlock?: string;
    latestActivity?: string;
  };
}

export interface ChainResolutionResult {
  address: string;
  isValidAddress: boolean;
  status: 'RESOLVED' | 'MULTIPLE_NETWORKS' | 'NO_ACTIVITY' | 'LIVE_DATA_UNAVAILABLE' | 'INVALID_ADDRESS';
  matches: NetworkMatch[];
  message?: string;
}

export async function resolveAddressNetworksClient(address: string): Promise<ChainResolutionResult> {
  const trimmed = address ? address.trim() : '';

  if (!trimmed) {
    return {
      address: '',
      isValidAddress: false,
      status: 'INVALID_ADDRESS',
      matches: [],
      message: 'Address parameter is empty.',
    };
  }

  // Pre-validate supported address format syntax across all 6 networks (EVM, Solana, TRON, Bitcoin)
  const isEvmFormat = /^0x[a-fA-F0-9]{40}$/.test(trimmed) || /^0x[a-fA-F0-9]{64}$/.test(trimmed);
  const isSolanaFormat = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed);
  const isTronFormat = /^T[a-zA-HJ-NP-Z0-9]{33}$/.test(trimmed);
  const isBtcFormat = /^(bc1|[13])[a-zA-HJ-NP-Za-km-z0-9]{25,62}$/.test(trimmed);

  const isValidSupportedSyntax = isEvmFormat || isSolanaFormat || isTronFormat || isBtcFormat;

  if (!isValidSupportedSyntax) {
    return {
      address: trimmed,
      isValidAddress: false,
      status: 'INVALID_ADDRESS',
      matches: [],
      message: 'Invalid address format. Supplied input does not match valid address syntax for any supported network (Ethereum, Polygon, BNB, Solana, TRON, Bitcoin).',
    };
  }

  try {
    const primaryUrl = '/api/v1/resolve-network';
    let response: Response;

    try {
      response = await fetch(primaryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: trimmed }),
      });
    } catch {
      // Fallback to explicit localhost backend URL if relative endpoint fetch fails
      response = await fetch('http://localhost:3001/api/v1/resolve-network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: trimmed }),
      });
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        address: trimmed,
        isValidAddress: true,
        status: errData.status === 'LIVE_DATA_UNAVAILABLE' ? 'LIVE_DATA_UNAVAILABLE' : 'LIVE_DATA_UNAVAILABLE',
        matches: [],
        message: errData.message || `Backend service error: ${response.status}`,
      };
    }

    const data: ChainResolutionResult = await response.json();
    return data;
  } catch (err: any) {
    return {
      address: trimmed,
      isValidAddress: true,
      status: 'LIVE_DATA_UNAVAILABLE',
      matches: [],
      message: err.message || 'Network resolution service is currently unavailable.',
    };
  }
}
