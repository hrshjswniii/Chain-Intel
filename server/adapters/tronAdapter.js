import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

export async function fetchTronTransfers(address, options = {}) {
  const targetAddress = address.trim();

  // TRON Base58 address validation (starts with T, 34 chars)
  if (!/^T[a-zA-HJ-NP-Z0-9]{33}$/.test(targetAddress)) {
    return {
      status: 'INVALID_INPUT',
      transactions: [],
      message: 'Invalid TRON address format. Must be 34-character Base58 string starting with T.',
    };
  }

  const endpoint = `https://api.trongrid.io/v1/accounts/${targetAddress}/transactions/trc20?limit=25`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return {
        status: 'LIVE_DATA_UNAVAILABLE',
        transactions: [],
        message: `TronGrid API HTTP error: ${res.status}`,
      };
    }

    const data = await res.json();
    if (!data.success && !Array.isArray(data.data)) {
      return {
        status: 'LIVE_DATA_UNAVAILABLE',
        transactions: [],
        message: `TronGrid API Error: ${data.error || 'Failed to query TRON network.'}`,
      };
    }

    const rawTxs = Array.isArray(data.data) ? data.data : [];
    const normalizedList = [];

    for (const raw of rawTxs) {
      const fromAddr = raw.from || targetAddress;
      const toAddr = raw.to || 'TRON-Contract';
      const direction = fromAddr === targetAddress ? 'OUT' : 'IN';
      const rawValue = parseFloat(raw.value || '0');
      const decimals = parseInt(raw.token_info?.decimals || '6');
      const formattedVal = (rawValue / Math.pow(10, decimals)).toString();
      const isoTs = raw.block_timestamp
        ? new Date(raw.block_timestamp).toISOString()
        : 'Not available';

      normalizedList.push({
        chain: 'Tron',
        txHash: raw.transaction_id || `0xtron${Math.random().toString(16).slice(2, 10)}`,
        from: fromAddr,
        to: toAddr,
        value: formattedVal,
        asset: raw.token_info?.symbol || 'USDT',
        blockNumber: raw.block_number || 0,
        timestamp: isoTs,
        direction,
        category: 'trc20-token-transfer',
        source: 'TronGrid Mainnet Provider',
        chainSpecificMetadata: {
          tokenName: raw.token_info?.name || 'Tether USD',
          tokenAddress: raw.token_info?.address || null,
        },
      });
    }

    return {
      status: 'SUCCESS_WITH_DATA',
      transactions: normalizedList,
    };
  } catch (err) {
    return {
      status: 'LIVE_DATA_UNAVAILABLE',
      transactions: [],
      message: `TRON provider exception: ${err.message}`,
    };
  }
}

export async function recursiveTraceTron(startAddress, options = {}) {
  const maxHops = Math.max(1, Math.min(5, options.maxHops || 2));
  const rootAddress = startAddress.trim();

  const res = await fetchTronTransfers(rootAddress, options);
  if (res.status === 'LIVE_DATA_UNAVAILABLE') {
    return res;
  }

  const txs = res.transactions || [];
  const nodes = [
    {
      id: `tron:${rootAddress}`,
      label: `Target (${rootAddress.slice(0, 4)}...${rootAddress.slice(-4)})`,
      type: 'UNHOSTED_WALLET',
      chain: 'Tron',
      address: rootAddress,
      hop: 0,
      isTarget: true,
      txCount: txs.length,
      totalVolume: txs.reduce((acc, t) => acc + (parseFloat(t.value) || 0), 0),
      sourceProvider: 'TronGrid Mainnet Provider',
    },
  ];

  const edges = txs.map((tx, idx) => ({
    id: `tron-edge-${tx.txHash.slice(0, 10)}-${idx}`,
    source: `tron:${tx.from}`,
    target: `tron:${tx.to}`,
    amount: parseFloat(tx.value) || 0,
    value: tx.value,
    asset: tx.asset,
    txHash: tx.txHash,
    blockNumber: tx.blockNumber,
    timestamp: tx.timestamp,
    direction: tx.direction,
    hop: 1,
    sourceProvider: 'TronGrid Mainnet Provider',
  }));

  txs.forEach((tx, idx) => {
    const counterparty = tx.from === rootAddress ? tx.to : tx.from;
    const cpId = `tron:${counterparty}`;
    if (!nodes.some((n) => n.id === cpId)) {
      nodes.push({
        id: cpId,
        label: `TRON Hop #1 (${counterparty.slice(0, 4)}...${counterparty.slice(-4)})`,
        type: 'WALLET',
        chain: 'Tron',
        address: counterparty,
        hop: 1,
        isTarget: false,
        txCount: 1,
        totalVolume: parseFloat(tx.value) || 0,
        sourceProvider: 'TronGrid Mainnet Provider',
      });
    }
  });

  return {
    status: txs.length > 0 ? 'SUCCESS_WITH_DATA' : 'SUCCESS_NO_TRANSFERS',
    target: startAddress,
    chain: 'Tron',
    maxHops,
    transactions: txs,
    nodes,
    edges,
    statistics: {
      nodesDiscovered: nodes.length,
      edgesDiscovered: edges.length,
      walletsTraversed: 1,
      hopsCompleted: 1,
      transactionsFetched: txs.length,
    },
  };
}
