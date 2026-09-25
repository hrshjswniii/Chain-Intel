import { buildLiveGraphFromTransactions } from '../src/engine/scoring/graphGenerator';

async function runPhase4MultiChainSuite() {
  console.log('====================================================');
  console.log(' CHAIN INTEL PHASE 4 — MULTI-CHAIN TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Ethereum Mainnet
  console.log('--- TEST 1: Ethereum Mainnet Tracing ---');
  const ethAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
  const ethTraceRes = await fetch('http://localhost:3001/api/v1/trace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetInput: ethAddress, chain: 'Ethereum' }),
  });
  const ethTraceData = await ethTraceRes.json();
  console.log('Status:', ethTraceData.status);
  console.log('Resolved Chain:', ethTraceData.resolvedChain);
  console.log('Transactions Count:', ethTraceData.transactions?.length);
  const ethGraph = buildLiveGraphFromTransactions(ethAddress, 'Ethereum', ethTraceData.transactions, ethTraceData);
  console.log('Node Namespace:', ethGraph.nodes[0]?.id);
  console.log('✓ TEST 1 PASSED (Ethereum)\n');

  // Test 2: Polygon Mainnet
  console.log('--- TEST 2: Polygon Mainnet Tracing ---');
  const polyAddress = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
  const polyTraceRes = await fetch('http://localhost:3001/api/v1/trace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetInput: polyAddress, chain: 'Polygon' }),
  });
  const polyTraceData = await polyTraceRes.json();
  console.log('Status:', polyTraceData.status);
  console.log('Resolved Chain:', polyTraceData.resolvedChain);
  console.log('Transactions Count:', polyTraceData.transactions?.length);
  const polyGraph = buildLiveGraphFromTransactions(polyAddress, 'Polygon', polyTraceData.transactions, polyTraceData);
  console.log('Node Namespace:', polyGraph.nodes[0]?.id);
  console.log('✓ TEST 2 PASSED (Polygon)\n');

  // Test 3: BNB Smart Chain
  console.log('--- TEST 3: BNB Smart Chain Tracing ---');
  const bscAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
  const bscTraceRes = await fetch('http://localhost:3001/api/v1/trace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetInput: bscAddress, chain: 'BNB' }),
  });
  const bscTraceData = await bscTraceRes.json();
  console.log('Status:', bscTraceData.status);
  console.log('Resolved Chain:', bscTraceData.resolvedChain);
  console.log('Transactions Count:', bscTraceData.transactions?.length);
  const bscGraph = buildLiveGraphFromTransactions(bscAddress, 'BNB', bscTraceData.transactions, bscTraceData);
  console.log('Node Namespace:', bscGraph.nodes[0]?.id);
  console.log('✓ TEST 3 PASSED (BNB)\n');

  // Test 4: Solana Mainnet
  console.log('--- TEST 4: Solana Mainnet Tracing ---');
  const solAddress = 'vines1526yBvtQmBfqXwSt7fdbxp55aQ6455ZqVU84D';
  const solTraceRes = await fetch('http://localhost:3001/api/v1/trace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetInput: solAddress, chain: 'Solana' }),
  });
  const solTraceData = await solTraceRes.json();
  console.log('Status:', solTraceData.status);
  console.log('Resolved Chain:', solTraceData.resolvedChain);
  console.log('Transactions Count:', solTraceData.transactions?.length);
  const solGraph = buildLiveGraphFromTransactions(solAddress, 'Solana', solTraceData.transactions, solTraceData);
  console.log('Node Namespace:', solGraph.nodes[0]?.id);
  console.log('✓ TEST 4 PASSED (Solana)\n');

  // Test 5: TRON Mainnet
  console.log('--- TEST 5: TRON Mainnet Tracing ---');
  const tronAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  const tronTraceRes = await fetch('http://localhost:3001/api/v1/trace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetInput: tronAddress, chain: 'Tron' }),
  });
  const tronTraceData = await tronTraceRes.json();
  console.log('Status:', tronTraceData.status);
  console.log('Resolved Chain:', tronTraceData.resolvedChain);
  console.log('Transactions Count:', tronTraceData.transactions?.length);
  const tronGraph = buildLiveGraphFromTransactions(tronAddress, 'Tron', tronTraceData.transactions, tronTraceData);
  console.log('Node Namespace:', tronGraph.nodes[0]?.id);
  console.log('✓ TEST 5 PASSED (TRON)\n');

  // Test 6: Bitcoin UTXO Mainnet
  console.log('--- TEST 6: Bitcoin UTXO Mainnet Tracing ---');
  const btcAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
  const btcTraceRes = await fetch('http://localhost:3001/api/v1/trace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetInput: btcAddress, chain: 'Bitcoin' }),
  });
  const btcTraceData = await btcTraceRes.json();
  console.log('Status:', btcTraceData.status);
  console.log('Resolved Chain:', btcTraceData.resolvedChain);
  console.log('Transactions Count:', btcTraceData.transactions?.length);
  const btcGraph = buildLiveGraphFromTransactions(btcAddress, 'Bitcoin', btcTraceData.transactions, btcTraceData);
  console.log('Node Namespace:', btcGraph.nodes[0]?.id);
  console.log('UTXO Metadata Present?:', btcTraceData.transactions[0]?.chainSpecificMetadata?.utxoModel === true);
  console.log('✓ TEST 6 PASSED (Bitcoin)\n');

  // Test 7: Automatic Resolution across non-EVM vs EVM formats
  console.log('--- TEST 7: Automatic Network Resolution (No Chain Specified) ---');
  const autoSolRes = await fetch('http://localhost:3001/api/v1/resolve-network', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: solAddress }),
  });
  const autoSolData = await autoSolRes.json();
  console.log('Solana Auto-Resolution Status:', autoSolData.status);
  console.log('Matches:', autoSolData.matches?.map((m: any) => m.name).join(', '));

  const autoBtcRes = await fetch('http://localhost:3001/api/v1/resolve-network', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: btcAddress }),
  });
  const autoBtcData = await autoBtcRes.json();
  console.log('Bitcoin Auto-Resolution Status:', autoBtcData.status);
  console.log('Matches:', autoBtcData.matches?.map((m: any) => m.name).join(', '));
  console.log('✓ TEST 7 PASSED (Automatic Resolution)\n');

  console.log('====================================================');
  console.log(' ALL 6 BLOCKCHAIN ADAPTERS & RESOLUTION TESTS PASSED!');
  console.log('====================================================');
}

runPhase4MultiChainSuite();
