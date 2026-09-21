import { BlockchainType } from './index';

export type ThemeOption = 'light' | 'dark' | 'system';
export type DashboardDensity = 'comfortable' | 'compact';
export type TraceDepthOption = 1 | 3 | 5 | 10;
export type AlertSeverityThreshold = 'low' | 'medium' | 'high' | 'critical';

export interface AppearanceSettings {
  theme: ThemeOption;
  density: DashboardDensity;
}

export interface InvestigationSettings {
  defaultChain: BlockchainType;
  defaultTraceDepth: TraceDepthOption;
  minTxValue: number;
  crossChainTracing: boolean;
  showLowConfidence: boolean;
}

export interface AttributionSettings {
  attributionThreshold: number; // e.g. 60
  showConfidenceExplanations: boolean;
  showContributingEvidence: boolean;
  scoringMethodology: string; // "Explainable Heuristic"
}

export interface AlertSettings {
  newTransaction: boolean;
  newVASPExposure: boolean;
  crossChainMovement: boolean;
  highRiskInteraction: boolean;
  monitoredWalletActivity: boolean;
  severityThreshold: AlertSeverityThreshold;
}

export interface SahyogSettings {
  connectionStatus: 'CONNECTED' | 'DEMO_CONNECTED';
  environment: 'DEMONSTRATION' | 'SANDBOX';
  autoPrepareRequests: boolean;
  requireConfirmation: boolean;
  supportedRequestTypes: string[];
}

export interface ChainSightSettings {
  appearance: AppearanceSettings;
  investigation: InvestigationSettings;
  attribution: AttributionSettings;
  alerts: AlertSettings;
  sahyog: SahyogSettings;
}
