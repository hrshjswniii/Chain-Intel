import { InvestigationCase, SahyogPayload } from '../../types';

export function createSahyogPayload(caseData: Partial<InvestigationCase>): SahyogPayload {
  return {
    caseReference: caseData.caseReference || 'TB-2026-0941',
    agency: 'Indian Cyber Crime Coordination Centre (I4C)',
    investigatorId: caseData.investigator || 'LE-9842',
    targetWallet: caseData.targetInput || '0x71C7656EC7ab88b098defb751b7401b5f6d8976f',
    blockchain: caseData.chain || 'Ethereum',
    nearestDirectDepositVASP: caseData.nearestDirectDepositVASP || caseData.vaspDestination || 'CoinDCX India',
    confidenceTier: caseData.confidenceTier || 'HIGHLY_LIKELY',
    confidenceScore: caseData.confidenceScore || 91,
    evidenceSummary: `Attribution confirmed via ${caseData.hops?.length || 3}-hop path continuity analysis with verified VASP deposit cluster.`,
    reportHash: caseData.sha256Hash || '7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2a',
    timestamp: new Date().toISOString(),
  };
}

export const MOCK_SAHYOG_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/sahyog/investigations',
    description: 'Submit a new cybercrime case for automated blockchain trace & attribution.',
    sampleRequest: `{
  "caseReference": "I4C-2026-8891",
  "agency": "Special Cyber Cell - MH",
  "targetWallet": "0x71C7656EC7ab88b098defb751b7401b5f6d8976f",
  "chain": "Ethereum",
  "priority": "HIGH"
}`,
    sampleResponse: `{
  "status": "SUCCESS",
  "traceId": "TRC-9921",
  "estimatedTimeMs": 1200,
  "sahyogSyncToken": "SYNC-I4C-99120"
}`
  },
  {
    method: 'GET',
    path: '/api/v1/sahyog/traces/:id',
    description: 'Retrieve real-time graph nodes, hop history, and VASP confidence score for an active case.',
    sampleRequest: `GET /api/v1/sahyog/traces/TRC-9921`,
    sampleResponse: `{
  "traceId": "TRC-9921",
  "status": "COMPLETED",
  "nearestDirectDepositVASP": "CoinDCX India",
  "confidenceScore": 91,
  "confidenceTier": "HIGHLY_LIKELY",
  "hops": 3,
  "sha256Hash": "7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2a"
}`
  },
  {
    method: 'POST',
    path: '/api/v1/sahyog/disclosure-notice',
    description: 'Auto-generate and push Section 91 Cr.P.C. disclosure notice payload directly to law enforcement portal.',
    sampleRequest: `{
  "caseReference": "I4C-2026-8891",
  "vaspName": "CoinDCX India",
  "reportHash": "7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2a"
}`,
    sampleResponse: `{
  "noticeId": "NOT-2026-5510",
  "status": "DRAFT_READY",
  "pdfDownloadUrl": "/reports/notice-NOT-2026-5510.pdf"
}`
  }
];
