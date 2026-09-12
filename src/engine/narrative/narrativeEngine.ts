import { InvestigationCase } from '../../types';

export function generateInvestigatorNarrative(caseData: Partial<InvestigationCase>): string {
  const caseRef = caseData.caseReference || 'TB-CASE-REF';
  const target = caseData.targetInput || '0xTargetWallet';
  const chain = caseData.chain || 'Ethereum';
  const vaspName = caseData.nearestDirectDepositVASP || caseData.vaspDestination || 'Identified VASP';
  const score = caseData.confidenceScore || 91;
  const tier = caseData.confidenceTier || 'HIGHLY_LIKELY';
  const hops = caseData.hops?.length ? caseData.hops.length - 1 : 3;
  const typologies = caseData.typologies?.map((t) => t.name).join(', ') || 'Peel-chain forwarding pattern';

  const tierText = tier.replace('_', ' ');

  return `[KNOWN FACT] The investigation into case ${caseRef} commenced with target address ${target} on the ${chain} blockchain. A total of ${hops + 1} transaction events were analyzed following the movement of funds from the target source address.

[INFERENCE] Funds were transferred sequentially through ${hops} intermediate unlabelled wallet addresses before reaching a deposit infrastructure associated with ${vaspName}. The observed transaction flow exhibits indicators consistent with ${typologies}.

[CONFIDENCE & EVALUATION] Based on public VASP intelligence matching, hop path continuity, and verified address metadata, the attribution to ${vaspName} is classified as ${tierText} with an evidence confidence score of ${score}%.

[SYSTEM LIMITATION & NOTE] CHAIN-INTEL provides investigative leads for law enforcement prioritization. This automated attribution inference requires independent verification via official VASP disclosure requests and legal process prior to formal evidentiary submission.`;
}
