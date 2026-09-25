const blockTimestampCache = new Map();

async function resolveBlockTimestamp(blockNumHex, endpoint, headers) {
  if (!blockNumHex) return 'Not available';
  if (blockTimestampCache.has(blockNumHex)) return blockTimestampCache.get(blockNumHex);

  try {
    const payload = {
      id: 99,
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [blockNumHex, false],
    };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      const hexTs = data.result?.timestamp;
      if (hexTs) {
        const sec = parseInt(hexTs, 16);
        const iso = new Date(sec * 1000).toISOString();
        blockTimestampCache.set(blockNumHex, iso);
        return iso;
      }
    }
  } catch {
    // block lookup error fallback
  }
  const fallback = 'Not available';
  blockTimestampCache.set(blockNumHex, fallback);
  return fallback;
}

export async function fetchEthereumTransfers(address, options = {}) {
  const apiKey = process.env.ALCHEMY_API_KEY || 'docs-demo';
  const targetAddress = address.trim().toLowerCase();
  const dir = (options.direction || 'BOTH').toUpperCase();

  // Validate EVM format
  if (!/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
    return {
      status: 'INVALID_INPUT',
      transactions: [],
      message: 'Invalid Ethereum address format. Must be 0x followed by 40 hex characters.',
    };
  }

  const endpoint = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  try {
    const promises = [];

    // 1. Fetch Outgoing Transfers (fromAddress) if dir is OUT or BOTH
    if (dir === 'OUT' || dir === 'BOTH') {
      const outgoingPayload = {
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: '0x0',
            toBlock: 'latest',
            fromAddress: targetAddress,
            category: ['external', 'erc20'],
            maxCount: '0x1e', // 30 transfers per wallet call
            withMetadata: true,
            pageKey: options.pageKey || undefined,
          },
        ],
      };
      promises.push(
        fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(outgoingPayload),
        }).then((res) => (res.ok ? res.json() : { error: { message: `HTTP ${res.status}` } }))
      );
    } else {
      promises.push(Promise.resolve({ result: { transfers: [] } }));
    }

    // 2. Fetch Incoming Transfers (toAddress) if dir is IN or BOTH
    if (dir === 'IN' || dir === 'BOTH') {
      const incomingPayload = {
        id: 2,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: '0x0',
            toBlock: 'latest',
            toAddress: targetAddress,
            category: ['external', 'erc20'],
            maxCount: '0x1e', // 30 transfers per wallet call
            withMetadata: true,
            pageKey: options.pageKey || undefined,
          },
        ],
      };
      promises.push(
        fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(incomingPayload),
        }).then((res) => (res.ok ? res.json() : { error: { message: `HTTP ${res.status}` } }))
      );
    } else {
      promises.push(Promise.resolve({ result: { transfers: [] } }));
    }

    const [outData, inData] = await Promise.all(promises);

    if (outData?.error || inData?.error) {
      const errMessage = outData?.error?.message || inData?.error?.message || 'Alchemy RPC error';
      return {
        status: 'LIVE_DATA_UNAVAILABLE',
        transactions: [],
        message: errMessage,
      };
    }

    const rawOutTransfers = outData.result?.transfers || [];
    const rawInTransfers = inData.result?.transfers || [];
    const nextPageKey = outData.result?.pageKey || inData.result?.pageKey || undefined;

    const allRawTransfers = [...rawOutTransfers, ...rawInTransfers];

    if (allRawTransfers.length === 0) {
      return {
        status: 'SUCCESS_NO_TRANSFERS',
        transactions: [],
        message: 'No on-chain asset transfers found for this address on Ethereum Mainnet.',
      };
    }

    // Deduplicate by txHash + category + from + to
    const seenHashes = new Set();
    const normalized = [];

    for (const item of allRawTransfers) {
      const key = `${item.hash}-${item.from}-${item.to}-${item.category}`;
      if (seenHashes.has(key)) continue;
      seenHashes.add(key);

      const blockNum = item.blockNum ? parseInt(item.blockNum, 16) : 0;
      const isOut = item.from?.toLowerCase() === targetAddress;

      // Monetary value as string to prevent JS floating-point issues
      const valueStr =
        item.value !== null && item.value !== undefined
          ? String(item.value)
          : item.rawContract?.value
          ? String(parseInt(item.rawContract.value, 16) / 1e18)
          : '0';

      // Obtain timestamp from Alchemy metadata or block RPC lookup
      let timestamp = item.metadata?.blockTimestamp;
      if (!timestamp && item.blockNum) {
        timestamp = await resolveBlockTimestamp(item.blockNum, endpoint, headers);
      }
      if (!timestamp) {
        timestamp = 'Not available';
      }

      normalized.push({
        chain: 'Ethereum',
        txHash: item.hash || 'Not available',
        from: item.from ? item.from.toLowerCase() : 'Not available',
        to: item.to ? item.to.toLowerCase() : 'Not available',
        value: valueStr,
        asset: item.asset || (item.category === 'erc20' ? 'TOKEN' : 'ETH'),
        blockNumber: blockNum,
        blockHash: item.blockHash || null,
        timestamp,
        direction: isOut ? 'OUT' : 'IN',
        category: item.category || 'external',
        uniqueId: item.uniqueId || null,
        source: 'Alchemy',
      });
    }

    // Sort descending by block number
    normalized.sort((a, b) => b.blockNumber - a.blockNumber);

    return {
      status: 'SUCCESS_WITH_DATA',
      transactions: normalized,
      pageKey: nextPageKey,
    };
  } catch (error) {
    return {
      status: 'LIVE_DATA_UNAVAILABLE',
      transactions: [],
      message: error.message || 'Network connection to Alchemy failed.',
    };
  }
}

/**
 * Phase 2: Recursive BFS Fund-Flow Tracing Engine
 * Bounded multi-hop traversal with visited set, deduplication, and counterparty selection.
 */
export async function recursiveTraceEthereum(targetInput, options = {}) {
  const target = targetInput.trim().toLowerCase();
  const maxHops = Math.max(1, Math.min(5, options.maxHops || 2));
  const maxCounterpartiesPerNode = Math.max(1, Math.min(50, options.maxCounterpartiesPerNode || 10));
  const direction = (options.direction || 'BOTH').toUpperCase();
  const minVal = options.minimumTransferValue ? parseFloat(options.minimumTransferValue) : 0;

  // Validate format
  if (!/^0x[a-fA-F0-9]{40}$/.test(target)) {
    return {
      status: 'INVALID_INPUT',
      target,
      chain: 'ethereum',
      maxHops,
      direction,
      maxCounterpartiesPerNode,
      nodes: [],
      edges: [],
      transactions: [],
      statistics: {
        nodesDiscovered: 0,
        edgesDiscovered: 0,
        walletsTraversed: 0,
        hopsCompleted: 0,
        transactionsFetched: 0,
      },
      message: 'Invalid Ethereum address format. Must be 0x followed by 40 hex characters.',
    };
  }

  const visited = new Set();
  const walletCache = new Map(); // In-memory fetch cache per trace call
  const nodesMap = new Map();
  const edgesMap = new Map();
  const allTransactions = [];
  const seenTxKeys = new Set();
  const warnings = [];

  // Enqueue root target at hop 0
  const queue = [{ address: target, hop: 0 }];
  visited.add(`ethereum:${target}`);

  let walletsTraversed = 0;
  let hopsCompleted = 0;

  while (queue.length > 0) {
    const { address, hop } = queue.shift();
    walletsTraversed++;

    if (hop > hopsCompleted) {
      hopsCompleted = hop;
    }

    const nodeId = `ethereum:${address}`;
    if (!nodesMap.has(nodeId)) {
      nodesMap.set(nodeId, {
        id: nodeId,
        address,
        chain: 'Ethereum',
        type: address === target ? 'UNHOSTED_WALLET' : 'WALLET',
        hop,
        transactionCount: 0,
        totalVolume: 0,
        isTarget: address === target,
        lastActive: 'Live Query',
      });
    }

    // Stop counterparties expansion if maxHops reached
    if (hop >= maxHops) {
      continue;
    }

    // Fetch transactions using cache
    let fetchResult;
    if (walletCache.has(address)) {
      fetchResult = walletCache.get(address);
    } else {
      fetchResult = await fetchEthereumTransfers(address, { direction, pageKey: options.pageKey });
      walletCache.set(address, fetchResult);
    }

    if (fetchResult.status === 'LIVE_DATA_UNAVAILABLE') {
      if (address === target) {
        return {
          status: 'LIVE_DATA_UNAVAILABLE',
          target,
          chain: 'ethereum',
          maxHops,
          direction,
          maxCounterpartiesPerNode,
          nodes: [],
          edges: [],
          transactions: [],
          statistics: {
            nodesDiscovered: 0,
            edgesDiscovered: 0,
            walletsTraversed: 0,
            hopsCompleted: 0,
            transactionsFetched: 0,
          },
          message: fetchResult.message,
        };
      }
      warnings.push(`Live query failed for intermediate wallet ${address}: ${fetchResult.message}`);
      continue;
    }

    const txs = fetchResult.transactions || [];

    // Filter transactions by direction and minimum transfer value
    const filteredTxs = txs.filter((tx) => {
      const valNum = parseFloat(tx.value) || 0;
      if (minVal > 0 && valNum < minVal) return false;
      if (direction === 'OUT' && tx.direction !== 'OUT') return false;
      if (direction === 'IN' && tx.direction !== 'IN') return false;
      return true;
    });

    // Group counterparties and compute total transfer value for deterministic ranking
    const counterpartyMap = new Map();

    for (const tx of filteredTxs) {
      const isOut = tx.from.toLowerCase() === address;
      const counterparty = isOut ? tx.to.toLowerCase() : tx.from.toLowerCase();
      if (!counterparty || counterparty === address) continue;

      if (!counterpartyMap.has(counterparty)) {
        counterpartyMap.set(counterparty, {
          address: counterparty,
          totalValue: 0,
          txs: [],
        });
      }

      const cpObj = counterpartyMap.get(counterparty);
      cpObj.totalValue += parseFloat(tx.value) || 0;
      cpObj.txs.push(tx);
    }

    // Rank counterparties deterministically by highest total transfer volume
    const sortedCounterparties = Array.from(counterpartyMap.values()).sort(
      (a, b) => b.totalValue - a.totalValue
    );

    const selectedCounterparties = sortedCounterparties.slice(0, maxCounterpartiesPerNode);

    if (sortedCounterparties.length > maxCounterpartiesPerNode) {
      warnings.push(
        `Wallet ${address} had ${sortedCounterparties.length} counterparties. Truncated to top ${maxCounterpartiesPerNode} by transfer volume.`
      );
    }

    // Process selected counterparties
    for (const cp of selectedCounterparties) {
      const cpAddress = cp.address;
      const cpNodeId = `ethereum:${cpAddress}`;

      if (!nodesMap.has(cpNodeId)) {
        nodesMap.set(cpNodeId, {
          id: cpNodeId,
          address: cpAddress,
          chain: 'Ethereum',
          type: 'WALLET',
          hop: hop + 1,
          transactionCount: cp.txs.length,
          totalVolume: cp.totalValue,
          isTarget: false,
          lastActive: cp.txs[0]?.timestamp || 'Live Query',
        });
      }

      for (const tx of cp.txs) {
        const txKey = `${tx.txHash}-${tx.from}-${tx.to}`;
        if (!seenTxKeys.has(txKey)) {
          seenTxKeys.add(txKey);
          allTransactions.push({ ...tx, hop: hop + 1 });

          const edgeId = `edge-${tx.txHash.slice(0, 10)}-${tx.from.slice(-4)}-${tx.to.slice(-4)}`;
          const sourceId = `ethereum:${tx.from.toLowerCase()}`;
          const targetId = `ethereum:${tx.to.toLowerCase()}`;

          if (!edgesMap.has(edgeId)) {
            edgesMap.set(edgeId, {
              id: edgeId,
              source: sourceId,
              target: targetId,
              chain: 'Ethereum',
              txHash: tx.txHash,
              amount: parseFloat(tx.value) || 0,
              value: tx.value,
              asset: tx.asset || 'ETH',
              blockNumber: tx.blockNumber,
              timestamp: tx.timestamp,
              direction: tx.direction,
              hop: hop + 1,
              sourceProvider: 'Alchemy',
            });
          }
        }
      }

      // Enqueue counterparty for next hop if within maxHops
      if (!visited.has(cpNodeId) && hop + 1 < maxHops) {
        visited.add(cpNodeId);
        queue.push({ address: cpAddress, hop: hop + 1 });
      }
    }
  }

  const nodes = Array.from(nodesMap.values());
  const edges = Array.from(edgesMap.values());

  // Compute node-level forensic statistics from actual observed transactions
  for (const node of nodes) {
    const addr = node.address.toLowerCase();
    let inCount = 0;
    let outCount = 0;
    let inVol = 0;
    let outVol = 0;
    let firstSeen = null;
    let lastSeen = null;

    for (const tx of allTransactions) {
      if (tx.from?.toLowerCase() === addr || tx.to?.toLowerCase() === addr) {
        if (tx.to?.toLowerCase() === addr) {
          inCount++;
          inVol += parseFloat(tx.value) || 0;
        }
        if (tx.from?.toLowerCase() === addr) {
          outCount++;
          outVol += parseFloat(tx.value) || 0;
        }
        if (tx.timestamp && tx.timestamp !== 'Not available') {
          if (!firstSeen || tx.timestamp < firstSeen) firstSeen = tx.timestamp;
          if (!lastSeen || tx.timestamp > lastSeen) lastSeen = tx.timestamp;
        }
      }
    }

    node.transactionCount = inCount + outCount;
    node.inboundTransactionCount = inCount;
    node.outboundTransactionCount = outCount;
    node.inboundVolume = parseFloat(inVol.toFixed(6));
    node.outboundVolume = parseFloat(outVol.toFixed(6));
    node.totalVolume = parseFloat((inVol + outVol).toFixed(6));
    node.firstSeen = firstSeen || 'Not available';
    node.lastSeen = lastSeen || 'Not available';
    node.lastActive = lastSeen || node.lastActive || 'Live Query';
    node.sourceProvider = 'Alchemy — Ethereum Mainnet';
  }

  const status = nodes.length === 1 && edges.length === 0 ? 'SUCCESS_NO_TRANSFERS' : 'SUCCESS_WITH_DATA';

  return {
    status,
    target,
    chain: 'ethereum',
    maxHops,
    direction,
    maxCounterpartiesPerNode,
    nodes,
    edges,
    transactions: allTransactions,
    statistics: {
      nodesDiscovered: nodes.length,
      edgesDiscovered: edges.length,
      walletsTraversed,
      hopsCompleted,
      transactionsFetched: allTransactions.length,
    },
    pagination: {},
    warnings,
  };
}
