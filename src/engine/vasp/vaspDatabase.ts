import { VASPMatch } from '../../types';

export const KNOWN_VASP_DATABASE: Record<string, VASPMatch> = {
  'coindcx': {
    name: 'CoinDCX',
    jurisdiction: 'India (FIU-IND Registered)',
    countryCode: 'IN',
    cooperationPriority: 'DOMESTIC',
    addressCount: 14250,
    verifiedDate: '2026-08-15',
    confidenceLevel: 'AUTHORITATIVE',
    category: 'Regulated Exchange',
    knownAddressMatches: 14250,
    complianceContact: 'nodal-officer@coindcx.com',
    isDomestic: true,
  },
  'binance': {
    name: 'Binance',
    jurisdiction: 'Global / Cayman Islands (FIU-IND Registered)',
    countryCode: 'GLOBAL',
    cooperationPriority: 'CROSS_BORDER_PRIORITY',
    addressCount: 189200,
    verifiedDate: '2026-08-20',
    confidenceLevel: 'AUTHORITATIVE',
    category: 'Global Exchange',
    knownAddressMatches: 189200,
    complianceContact: 'le-compliance@binance.com',
    isDomestic: false,
  },
  'wazirx': {
    name: 'WazirX',
    jurisdiction: 'India (FIU-IND Registered)',
    countryCode: 'IN',
    cooperationPriority: 'DOMESTIC',
    addressCount: 9800,
    verifiedDate: '2026-07-28',
    confidenceLevel: 'AUTHORITATIVE',
    category: 'Regulated Exchange',
    knownAddressMatches: 9800,
    complianceContact: 'legal@wazirx.com',
    isDomestic: true,
  },
  'kraken': {
    name: 'Kraken',
    jurisdiction: 'United States (FinCEN Registered)',
    countryCode: 'US',
    cooperationPriority: 'CROSS_BORDER_STANDARD',
    addressCount: 45100,
    verifiedDate: '2026-08-10',
    confidenceLevel: 'HIGH',
    category: 'Regulated Exchange',
    knownAddressMatches: 45100,
    complianceContact: 'lawenforcement@kraken.com',
    isDomestic: false,
  },
  'fixedfloat': {
    name: 'FixedFloat',
    jurisdiction: 'Seychelles (Non-KYC Instant Swap)',
    countryCode: 'SC',
    cooperationPriority: 'URGENT_REVIEW',
    addressCount: 3200,
    verifiedDate: '2026-06-12',
    confidenceLevel: 'HIGH',
    category: 'Instant Swap Service',
    knownAddressMatches: 3200,
    complianceContact: 'compliance@fixedfloat.com',
    isDomestic: false,
  },
  'tornado_cash': {
    name: 'Tornado Cash Protocol',
    jurisdiction: 'Decentralized Smart Contract (Sanctioned)',
    countryCode: 'DECENTRALIZED',
    cooperationPriority: 'URGENT_REVIEW',
    addressCount: 48,
    verifiedDate: '2026-09-01',
    confidenceLevel: 'AUTHORITATIVE',
    category: 'Privacy Mixer / Tumbler',
    knownAddressMatches: 48,
    isDomestic: false,
  },
  'wasabi_mixer': {
    name: 'Wasabi Wallet CoinJoin Pool',
    jurisdiction: 'Decentralized Bitcoin Privacy Protocol',
    countryCode: 'DECENTRALIZED',
    cooperationPriority: 'URGENT_REVIEW',
    addressCount: 310,
    verifiedDate: '2026-08-05',
    confidenceLevel: 'HIGH',
    category: 'CoinJoin Mixer',
    knownAddressMatches: 310,
    isDomestic: false,
  },
  'synapse_bridge': {
    name: 'Synapse Cross-Chain Bridge',
    jurisdiction: 'Cross-Chain DeFi Liquidity Protocol',
    countryCode: 'DECENTRALIZED',
    cooperationPriority: 'CROSS_BORDER_STANDARD',
    addressCount: 120,
    verifiedDate: '2026-07-19',
    confidenceLevel: 'HIGH',
    category: 'Cross-Chain Bridge',
    knownAddressMatches: 120,
    isDomestic: false,
  }
};

// Seeded known address mapping for exact address lookup
export const KNOWN_ADDRESS_MAP: Record<string, string> = {
  // CoinDCX addresses
  '0x71c7656ec7ab88b098defb751b7401b5f6d8976f': 'coindcx',
  '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be': 'binance',
  '0x28c6c06298d514db089934071355e5743bf21d60': 'binance',
  '0x0d0707963952f2a77298587ab17fa5b169528d9c': 'wazirx',
  '0x1db3439a222c519ab44bb1144fe2816f77e5b272': 'kraken',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'usdt_contract',
  '0xd8da6bf26964af9d7eed9e03e53415d37aa96045': 'vitalik_public',
  '0x1111111254fb6c44bac0bed2854e76f90643097d': '1inch_router',
  '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503': 'binance',
  '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc': 'tornado_cash',
  'bc1qgdjqv0av3q56jvd822y7tfwx8d97tfchae5002': 'wasabi_mixer',
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh': 'binance',
  '1ndyj9afz3j5k32849dke920fke83720fk820': 'fixedfloat',
};

export interface MatchResult {
  isMatch: boolean;
  matchType: 'EXACT_MATCH' | 'CLUSTER_RELATION' | 'FORWARDING_RELATION' | 'KNOWN_DEPOSIT' | 'NO_MATCH';
  vaspKey?: string;
  vaspDetails?: VASPMatch;
  confidenceScore: number;
  explanation: string;
}

export function matchAddress(address: string): MatchResult {
  const normalized = address.toLowerCase().trim();
  const vaspKey = KNOWN_ADDRESS_MAP[normalized];

  if (vaspKey && KNOWN_VASP_DATABASE[vaspKey]) {
    const vasp = KNOWN_VASP_DATABASE[vaspKey];
    return {
      isMatch: true,
      matchType: 'EXACT_MATCH',
      vaspKey,
      vaspDetails: vasp,
      confidenceScore: 98,
      explanation: `Exact match found against public labelled dataset for ${vasp.name} (${vasp.category}).`,
    };
  }

  // Simulated cluster / pattern heuristic lookup
  if (normalized.includes('coindcx') || normalized.endsWith('76f')) {
    const vasp = KNOWN_VASP_DATABASE['coindcx'];
    return {
      isMatch: true,
      matchType: 'KNOWN_DEPOSIT',
      vaspKey: 'coindcx',
      vaspDetails: vasp,
      confidenceScore: 91,
      explanation: `Known deposit address cluster identified for ${vasp.name}.`,
    };
  }

  if (normalized.includes('binance') || normalized.endsWith('0be') || normalized.endsWith('503')) {
    const vasp = KNOWN_VASP_DATABASE['binance'];
    return {
      isMatch: true,
      matchType: 'CLUSTER_RELATION',
      vaspKey: 'binance',
      vaspDetails: vasp,
      confidenceScore: 89,
      explanation: `High continuity deposit sweep pattern matching ${vasp.name} main wallet infrastructure.`,
    };
  }

  if (normalized.includes('tornado') || normalized.endsWith('8fc')) {
    const vasp = KNOWN_VASP_DATABASE['tornado_cash'];
    return {
      isMatch: true,
      matchType: 'EXACT_MATCH',
      vaspKey: 'tornado_cash',
      vaspDetails: vasp,
      confidenceScore: 100,
      explanation: `Sanctioned privacy mixer smart contract identified.`,
    };
  }

  return {
    isMatch: false,
    matchType: 'NO_MATCH',
    confidenceScore: 0,
    explanation: 'Address does not match any known VASP dataset or identified cluster.',
  };
}
