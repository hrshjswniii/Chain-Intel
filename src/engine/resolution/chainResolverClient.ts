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

  // Address format pre-validation (EVM 0x hex format check)
  const isEvmFormat = /^0x[a-fA-F0-9]{40}$/.test(trimmed);
  if (!isEvmFormat) {
    return {
      address: trimmed,
      isValidAddress: false,
      status: 'INVALID_ADDRESS',
      matches: [],
      message: 'Invalid address format. Address must be a valid 42-character EVM address (0x...).',
    };
  }

  try {
    const response = await fetch('http://localhost:3001/api/v1/resolve-network', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: trimmed }),
    });

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
