import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

export async function fetchBitcoinTransfers(address, options = {}) {
  const targetAddress = address.trim();

  // Bitcoin address validation (Bech32 bc1... or Base58 1... 3...)
  if (!/^(bc1|[13])[a-zA-HJ-NP-Za-km-z0-9]{25,62}$/.test(targetAddress)) {
    return {
      status: 'INVALID_INPUT',
      transactions: [],
      message: 'Invalid Bitcoin address format. Must be Bech32 (bc1...) or Base58 (1... or 3...).',
    };
  }

  const endpoints = [
    `https://blockchain.info/rawaddr/${targetAddress}?limit=25`,
    `https://mempool.space/api/address/${targetAddress}/txs`,
    `https://blockstream.info/api/address/${targetAddress}/txs`,
  ];

  let rawTxs = null;
  let successfulProvider = 'Blockchain.info API Provider';

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ChainIntel/3.0',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          rawTxs = data;
          successfulProvider = endpoint.includes('blockstream')
            ? 'Blockstream API Bitcoin Provider'
            : 'Mempool.space Bitcoin Provider';
          break;
        } else if (data && Array.isArray(data.txs)) {
          // Blockchain.info format
          rawTxs = data.txs.map((t) => ({
            txid: t.hash,
            status: { block_height: t.block_height || 0, block_time: t.time, confirmed: Boolean(t.block_height) },
            vin: (t.inputs || []).map((i) => ({ prevout: { scriptpubkey_address: i.prev_out?.addr || 'Bitcoin Input' } })),
            vout: (t.out || []).map((o) => ({ scriptpubkey_address: o.addr || 'Bitcoin Output', value: o.value || 0 })),
          }));
          successfulProvider = 'Blockchain.info API Provider';
          break;
        }
      }
    } catch {
      // try next fallback endpoint
    }
  }

  if (!rawTxs) {
    return {
      status: 'LIVE_DATA_UNAVAILABLE',
      transactions: [],
      message: 'Bitcoin blockchain API providers (Mempool / Blockstream) unavailable.',
    };
  }

  const normalizedList = [];

  for (const tx of rawTxs) {
    const isInput = (tx.vin || []).some(
      (vin) => vin.prevout && vin.prevout.scriptpubkey_address === targetAddress
    );

    let fromAddr = targetAddress;
    let toAddr = 'Bitcoin Output Cluster';
    let valueSatoshis = 0;

    if (isInput) {
      // Target address spent funds (OUTBOUND UTXO)
      fromAddr = targetAddress;
      const nonChangeOutput = (tx.vout || []).find(
        (vout) => vout.scriptpubkey_address && vout.scriptpubkey_address !== targetAddress
      ) || tx.vout?.[0];

      toAddr = nonChangeOutput?.scriptpubkey_address || 'Bitcoin Output';
      valueSatoshis = nonChangeOutput?.value || 0;
    } else {
      // Target address received funds (INBOUND UTXO)
      const primaryVin = tx.vin?.[0];
      fromAddr = primaryVin?.prevout?.scriptpubkey_address || 'Bitcoin Input Cluster';

      const matchingOutput = (tx.vout || []).find(
        (vout) => vout.scriptpubkey_address === targetAddress
      );
      toAddr = targetAddress;
      valueSatoshis = matchingOutput?.value || 0;
    }

    const valBtc = (valueSatoshis / 1e8).toString();
    const isoTs = tx.status?.block_time
      ? new Date(tx.status.block_time * 1000).toISOString()
      : 'Not available';

    normalizedList.push({
      chain: 'Bitcoin',
      txHash: tx.txid,
      from: fromAddr,
      to: toAddr,
      value: valBtc,
      asset: 'BTC',
      blockNumber: tx.status?.block_height || 0,
      timestamp: isoTs,
      direction: isInput ? 'OUT' : 'IN',
      category: 'utxo-transfer',
      source: successfulProvider,
      chainSpecificMetadata: {
        vinCount: tx.vin?.length || 0,
        voutCount: tx.vout?.length || 0,
        confirmed: tx.status?.confirmed || false,
        utxoModel: true,
      },
    });
  }

  return {
    status: 'SUCCESS_WITH_DATA',
    transactions: normalizedList,
  };
}

export async function recursiveTraceBitcoin(startAddress, options = {}) {
  const maxHops = Math.max(1, Math.min(5, options.maxHops || 2));
  const rootAddress = startAddress.trim();

  const res = await fetchBitcoinTransfers(rootAddress, options);
  if (res.status === 'LIVE_DATA_UNAVAILABLE') {
    return res;
  }

  const txs = res.transactions || [];
  const nodes = [
    {
      id: `bitcoin:${rootAddress}`,
      label: `Target (${rootAddress.slice(0, 6)}...${rootAddress.slice(-4)})`,
      type: 'UNHOSTED_WALLET',
      chain: 'Bitcoin',
      address: rootAddress,
      hop: 0,
      isTarget: true,
      txCount: txs.length,
      totalVolume: txs.reduce((acc, t) => acc + (parseFloat(t.value) || 0), 0),
      sourceProvider: 'Mempool.space Bitcoin Provider',
    },
  ];

  const edges = txs.map((tx, idx) => ({
    id: `btc-edge-${tx.txHash.slice(0, 10)}-${idx}`,
    source: `bitcoin:${tx.from}`,
    target: `bitcoin:${tx.to}`,
    amount: parseFloat(tx.value) || 0,
    value: tx.value,
    asset: 'BTC',
    txHash: tx.txHash,
    blockNumber: tx.blockNumber,
    timestamp: tx.timestamp,
    direction: tx.direction,
    hop: 1,
    sourceProvider: 'Mempool.space Bitcoin Provider',
  }));

  txs.forEach((tx, idx) => {
    const counterparty = tx.from === rootAddress ? tx.to : tx.from;
    const cpId = `bitcoin:${counterparty}`;
    if (!nodes.some((n) => n.id === cpId)) {
      nodes.push({
        id: cpId,
        label: `BTC Hop #1 (${counterparty.slice(0, 6)}...${counterparty.slice(-4)})`,
        type: 'WALLET',
        chain: 'Bitcoin',
        address: counterparty,
        hop: 1,
        isTarget: false,
        txCount: 1,
        totalVolume: parseFloat(tx.value) || 0,
        sourceProvider: 'Mempool.space Bitcoin Provider',
      });
    }
  });

  return {
    status: txs.length > 0 ? 'SUCCESS_WITH_DATA' : 'SUCCESS_NO_TRANSFERS',
    target: startAddress,
    chain: 'Bitcoin',
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
