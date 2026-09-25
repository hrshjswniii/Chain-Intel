import { ChainSightSettings } from '../../types';

export const DEFAULT_SETTINGS: ChainSightSettings = {
  appearance: {
    theme: 'light',
    density: 'comfortable',
  },
  investigation: {
    networkResolutionMode: 'automatic',
    defaultChain: 'Ethereum',
    defaultTraceDepth: 2,
    maxTraceDepth: 5,
    minTxValue: 0,
    crossChainTracing: true,
    showLowConfidence: true,
  },
  attribution: {
    attributionThreshold: 60,
    showConfidenceExplanations: true,
    showContributingEvidence: true,
    scoringMethodology: 'Explainable Heuristic',
  },
  alerts: {
    newTransaction: true,
    newVASPExposure: true,
    crossChainMovement: true,
    highRiskInteraction: true,
    monitoredWalletActivity: true,
    severityThreshold: 'medium',
  },
  sahyog: {
    connectionStatus: 'DEMO_CONNECTED',
    environment: 'DEMONSTRATION',
    autoPrepareRequests: true,
    requireConfirmation: true,
    supportedRequestTypes: ['Information disclosure', 'Asset freeze', 'Asset tracking'],
  },
};

const STORAGE_KEY = 'chain_intel_settings';

export function loadSettings(): ChainSightSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
      investigation: { ...DEFAULT_SETTINGS.investigation, ...parsed.investigation },
      attribution: { ...DEFAULT_SETTINGS.attribution, ...parsed.attribution },
      alerts: { ...DEFAULT_SETTINGS.alerts, ...parsed.alerts },
      sahyog: { ...DEFAULT_SETTINGS.sahyog, ...parsed.sahyog },
    };
  } catch (err) {
    console.error('Failed to load settings from storage, falling back to defaults:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ChainSightSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Also sync theme setting into standalone theme key for backward compatibility
    localStorage.setItem('chain_intel_theme', settings.appearance.theme);
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function resetSettings(): ChainSightSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem('chain_intel_theme', 'light');
  } catch (err) {
    console.error('Failed to reset settings:', err);
  }
  return DEFAULT_SETTINGS;
}
