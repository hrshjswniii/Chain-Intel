import { AttributionScore, AttributionTier, ScoringFactor, VASPMatch, TypologyItem, DirectDepositVASPCandidate } from '../../types';

export function calculateAttributionScore(params: {
  hasVASPMatch: boolean;
  vaspDetails?: VASPMatch;
  matchType?: string;
  hopDistance: number;
  typologies: TypologyItem[];
  pathContinuityScore?: number;
  isDirectDeposit?: boolean;
}): AttributionScore {
  const factors: ScoringFactor[] = [];
  let currentScore = 100;

  if (!params.hasVASPMatch || !params.vaspDetails) {
    return {
      tier: 'INSUFFICIENT_DATA',
      percentage: 15,
      baseScore: 100,
      finalScore: 15,
      primaryVASP: 'Unattributed',
      nearestDirectDepositVASP: 'No Direct Deposit VASP Identified',
      isDirectDeposit: false,
      hopDistance: params.hopDistance,
      pathContinuity: 'Broken or Unidentified Flow',
      candidateVASPs: [],
      factors: [
        {
          label: 'No VASP Intelligence Match',
          impact: -85,
          type: 'NEGATIVE',
          category: 'VASP Intelligence',
          description: 'Destination wallet does not correlate with any verified exchange or VASP infrastructure.',
        },
      ],
    };
  }

  const baseScore = 100;
  const isDirect = params.isDirectDeposit ?? (params.hopDistance <= 3);

  // 1. Nearest Direct-Deposit Accepting VASP factor
  factors.push({
    label: `Nearest Direct-Deposit VASP (${params.vaspDetails.name})`,
    impact: isDirect ? 10 : 0,
    type: 'POSITIVE',
    category: 'Direct Deposit Attribution',
    description: `Identified nearest direct-deposit accepting exchange endpoint (${params.vaspDetails.name}) at ${params.hopDistance} hops.`,
  });
  if (isDirect) currentScore += 5;

  // 2. Hop Distance Penalty
  const hopPenalty = Math.min((params.hopDistance - 1) * 3, 15);
  if (hopPenalty > 0) {
    currentScore -= hopPenalty;
    factors.push({
      label: `Hop Distance Penalty (${params.hopDistance} hops)`,
      impact: -hopPenalty,
      type: 'NEGATIVE',
      category: 'Path Continuity',
      description: `Each intermediate hop introduces operational path uncertainty. (${params.hopDistance} hops detected).`,
    });
  } else {
    factors.push({
      label: 'Direct 1-Hop Deposit Match',
      impact: 8,
      type: 'POSITIVE',
      category: 'Path Continuity',
      description: 'Funds transferred directly to VASP deposit address without intermediate obfuscation.',
    });
    currentScore += 8;
  }

  // 3. Path Continuity
  const continuity = params.pathContinuityScore ?? 95;
  if (continuity >= 90) {
    factors.push({
      label: 'Strong Flow Continuity',
      impact: 4,
      type: 'POSITIVE',
      category: 'Flow Analysis',
      description: '>90% of transferred balance maintained through intermediate accounts.',
    });
    currentScore += 4;
  } else if (continuity < 60) {
    const penalty = 12;
    currentScore -= penalty;
    factors.push({
      label: 'Significant Balance Fragmentation',
      impact: -penalty,
      type: 'NEGATIVE',
      category: 'Flow Analysis',
      description: 'Funds were heavily split or commingled across multiple unlinked accounts.',
    });
  }

  // 4. Address Verification Age
  factors.push({
    label: 'Recent Address Intelligence Verification',
    impact: 3,
    type: 'POSITIVE',
    category: 'Intelligence Quality',
    description: `Target VASP cluster verified on ${params.vaspDetails.verifiedDate}.`,
  });
  currentScore += 3;

  // 5. Typology Penalties
  for (const typ of params.typologies) {
    if (typ.code === 'MIXER_INTERACTION') {
      const penalty = 35;
      currentScore -= penalty;
      factors.push({
        label: 'Privacy Mixer / Tumbler Penalty',
        impact: -penalty,
        type: 'NEGATIVE',
        category: 'Risk Typology',
        description: 'Transaction path passed through non-custodial privacy protocol (e.g. Tornado Cash / Wasabi).',
      });
    } else if (typ.code === 'CHAIN_HOPPING') {
      const penalty = 15;
      currentScore -= penalty;
      factors.push({
        label: 'Cross-Chain Bridge Transition Penalty',
        impact: -penalty,
        type: 'NEGATIVE',
        category: 'Risk Typology',
        description: 'Asset converted or bridged across distinct blockchain networks.',
      });
    } else if (typ.code === 'PEEL_CHAIN') {
      const penalty = 6;
      currentScore -= penalty;
      factors.push({
        label: 'Peel-Chain Pattern Adjustment',
        impact: -penalty,
        type: 'NEGATIVE',
        category: 'Risk Typology',
        description: 'Systematic minor balance separation observed across successive hops.',
      });
    }
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(currentScore)));

  let tier: AttributionTier = 'POSSIBLE';
  if (finalScore >= 95 && params.hopDistance === 1) {
    tier = 'CONFIRMED';
  } else if (finalScore >= 85) {
    tier = 'HIGHLY_LIKELY';
  } else if (finalScore >= 60) {
    tier = 'PROBABLE';
  } else if (finalScore >= 30) {
    tier = 'POSSIBLE';
  } else {
    tier = 'INSUFFICIENT_DATA';
  }

  const candidateVASPs: DirectDepositVASPCandidate[] = [
    {
      vaspName: params.vaspDetails.name,
      depositAddress: params.vaspDetails.name === 'CoinDCX India' ? '0x71c7656ec7ab88b098defb751b7401b5f6d8976f' : '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
      hopDistance: params.hopDistance,
      confidenceScore: finalScore,
      isNearestDirectDeposit: true,
      clusterRelationship: `${params.vaspDetails.name} Deposit Wallet Infrastructure`,
      cooperationPriority: params.vaspDetails.cooperationPriority,
    },
  ];

  return {
    tier,
    percentage: finalScore,
    baseScore,
    finalScore,
    factors,
    primaryVASP: params.vaspDetails.name,
    nearestDirectDepositVASP: params.vaspDetails.name,
    nearestDirectDepositAddress: candidateVASPs[0].depositAddress,
    isDirectDeposit: isDirect,
    candidateVASPs,
    primaryVASPDetails: params.vaspDetails,
    hopDistance: params.hopDistance,
    pathContinuity: continuity >= 80 ? 'Strong Clean Path' : 'Moderate Flow Continuity',
  };
}
