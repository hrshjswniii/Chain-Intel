import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  ShieldCheck,
  Bell,
  Radio,
  Info,
  RotateCcw,
  Check,
  ExternalLink,
  Shield,
  Layers,
  FileText,
  Lock,
  Cpu,
  Globe,
  Database,
  AlertTriangle
} from 'lucide-react';
import { ChainSightSettings } from '../../types/settings';
import { BlockchainType } from '../../types';

interface SettingsScreenProps {
  settings: ChainSightSettings;
  onUpdateSettings: (newSettings: ChainSightSettings) => void;
  onResetSettings: () => void;
}

type SectionTab = 'appearance' | 'investigation' | 'attribution' | 'alerts' | 'sahyog' | 'about';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SectionTab>('appearance');
  const [savedToast, setSavedToast] = useState(false);

  // Modals for About / Docs / Privacy
  const [activeModal, setActiveModal] = useState<'docs' | 'privacy' | 'about' | null>(null);

  const showSaveNotification = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const updateAppearance = (patch: Partial<ChainSightSettings['appearance']>) => {
    const updated = {
      ...settings,
      appearance: { ...settings.appearance, ...patch },
    };
    onUpdateSettings(updated);
    showSaveNotification();
  };

  const updateInvestigation = (patch: Partial<ChainSightSettings['investigation']>) => {
    const updated = {
      ...settings,
      investigation: { ...settings.investigation, ...patch },
    };
    onUpdateSettings(updated);
    showSaveNotification();
  };

  const updateAttribution = (patch: Partial<ChainSightSettings['attribution']>) => {
    const updated = {
      ...settings,
      attribution: { ...settings.attribution, ...patch },
    };
    onUpdateSettings(updated);
    showSaveNotification();
  };

  const updateAlerts = (patch: Partial<ChainSightSettings['alerts']>) => {
    const updated = {
      ...settings,
      alerts: { ...settings.alerts, ...patch },
    };
    onUpdateSettings(updated);
    showSaveNotification();
  };

  const updateSahyog = (patch: Partial<ChainSightSettings['sahyog']>) => {
    const updated = {
      ...settings,
      sahyog: { ...settings.sahyog, ...patch },
    };
    onUpdateSettings(updated);
    showSaveNotification();
  };

  const handleReset = () => {
    onResetSettings();
    showSaveNotification();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Workstation Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Configure system-wide visual presentation, default tracing hop thresholds, explainable attribution parameters, live alerts, and SAHYOG statutory notice dispatch rules.
          </p>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center space-x-3">
          {savedToast && (
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800 transition">
              <Check className="w-3.5 h-3.5" />
              <span>Settings Saved</span>
            </span>
          )}

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center space-x-1.5"
            title="Reset all settings to original factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('appearance')}
          className={`px-4 py-2 text-xs font-bold rounded-t-md transition flex items-center space-x-2 whitespace-nowrap ${
            activeSubTab === 'appearance'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-t-2 border-x border-blue-600 border-x-slate-200 dark:border-x-slate-800 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveSubTab('investigation')}
          className={`px-4 py-2 text-xs font-bold rounded-t-md transition flex items-center space-x-2 whitespace-nowrap ${
            activeSubTab === 'investigation'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-t-2 border-x border-blue-600 border-x-slate-200 dark:border-x-slate-800 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Investigation</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attribution')}
          className={`px-4 py-2 text-xs font-bold rounded-t-md transition flex items-center space-x-2 whitespace-nowrap ${
            activeSubTab === 'attribution'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-t-2 border-x border-blue-600 border-x-slate-200 dark:border-x-slate-800 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Attribution</span>
        </button>

        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`px-4 py-2 text-xs font-bold rounded-t-md transition flex items-center space-x-2 whitespace-nowrap ${
            activeSubTab === 'alerts'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-t-2 border-x border-blue-600 border-x-slate-200 dark:border-x-slate-800 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sahyog')}
          className={`px-4 py-2 text-xs font-bold rounded-t-md transition flex items-center space-x-2 whitespace-nowrap ${
            activeSubTab === 'sahyog'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-t-2 border-x border-blue-600 border-x-slate-200 dark:border-x-slate-800 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>SAHYOG Integration</span>
        </button>

        <button
          onClick={() => setActiveSubTab('about')}
          className={`px-4 py-2 text-xs font-bold rounded-t-md transition flex items-center space-x-2 whitespace-nowrap ${
            activeSubTab === 'about'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-t-2 border-x border-blue-600 border-x-slate-200 dark:border-x-slate-800 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>About / System</span>
        </button>
      </div>

      {/* SECTION 1: APPEARANCE */}
      {activeSubTab === 'appearance' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Appearance</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Control the visual presentation and layout density of ChainSight.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 space-y-4 pt-2">
            {/* Theme Setting Row */}
            <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Workstation Color Theme
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Choose between official Light Workstation Mode, Forensic Dark Mode, or sync with System Preferences.
                </span>
              </div>

              {/* Segmented Control */}
              <div className="inline-flex rounded-md border border-slate-300 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-800 shrink-0">
                <button
                  onClick={() => updateAppearance({ theme: 'light' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                    settings.appearance.theme === 'light'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => updateAppearance({ theme: 'dark' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                    settings.appearance.theme === 'dark'
                      ? 'bg-slate-900 text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => updateAppearance({ theme: 'system' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                    settings.appearance.theme === 'system'
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  System
                </button>
              </div>
            </div>

            {/* Dashboard Density Row */}
            <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Dashboard Information Density
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Control padding and row spacing across case tables, hop logs, and evidence cards.
                </span>
              </div>

              <div className="inline-flex rounded-md border border-slate-300 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-800 shrink-0">
                <button
                  onClick={() => updateAppearance({ density: 'comfortable' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                    settings.appearance.density === 'comfortable'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  onClick={() => updateAppearance({ density: 'compact' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                    settings.appearance.density === 'compact'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INVESTIGATION */}
      {activeSubTab === 'investigation' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Investigation</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure default unhosted wallet tracing parameters, initial blockchain selection, and hop thresholds.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 space-y-4 pt-2">
            {/* Network Resolution Mode */}
            <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Network Resolution Mode
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Automatic evidence-based probing across supported RPC providers versus manual chain selection.
                </span>
              </div>

              <div className="inline-flex rounded-md border border-slate-300 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-800 shrink-0">
                <button
                  onClick={() => updateInvestigation({ networkResolutionMode: 'automatic' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                    settings.investigation.networkResolutionMode === 'automatic'
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Automatic (Evidence Probe)
                </button>
                <button
                  onClick={() => updateInvestigation({ networkResolutionMode: 'manual' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                    settings.investigation.networkResolutionMode === 'manual'
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Manual Override
                </button>
              </div>
            </div>

            {/* Default Trace Depth Bounds */}
            <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Configured Trace Depth Bounds (Hops)
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Engine-controlled BFS expansion limit for automated unhosted wallet tracing.
                </span>
              </div>

              <div className="inline-flex rounded-md border border-slate-300 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-800">
                {[1, 2, 3, 5].map((hopCount) => (
                  <button
                    key={hopCount}
                    onClick={() =>
                      updateInvestigation({ defaultTraceDepth: hopCount, maxTraceDepth: Math.max(hopCount, settings.investigation.maxTraceDepth || 5) })
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                      settings.investigation.defaultTraceDepth === hopCount
                        ? 'bg-blue-600 text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {hopCount} {hopCount === 1 ? 'hop' : 'hops'}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Transaction Value */}
            <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Minimum Transaction Threshold (USD)
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Filter out micro-transfers and dust transactions below this dollar value.
                </span>
              </div>

              <div className="relative flex items-center w-36">
                <span className="absolute left-3 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={settings.investigation.minTxValue}
                  onChange={(e) =>
                    updateInvestigation({ minTxValue: Math.max(0, Number(e.target.value)) })
                  }
                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Cross-chain Tracing Toggle */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Cross-Chain Tracing
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Automatically trace cross-chain bridge outflows, Thorchain swaps, and EVM wrappers.
                </span>
              </div>

              <button
                onClick={() =>
                  updateInvestigation({
                    crossChainTracing: !settings.investigation.crossChainTracing,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.investigation.crossChainTracing ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.investigation.crossChainTracing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Low-Confidence Connections */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Show Low-Confidence Connections
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Render tentative multi-hop graph edges with unconfirmed cluster heuristics.
                </span>
              </div>

              <button
                onClick={() =>
                  updateInvestigation({
                    showLowConfidence: !settings.investigation.showLowConfidence,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.investigation.showLowConfidence ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.investigation.showLowConfidence ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ATTRIBUTION */}
      {activeSubTab === 'attribution' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Attribution</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure ChainSight's explainable attribution scoring engine and supporting evidence breakdown rules.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 space-y-4 pt-2">
            {/* Attribution Confidence Threshold Slider */}
            <div className="pt-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    Attribution Confidence Threshold
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Minimum score required to classify a VASP direct-deposit match as HIGHLY LIKELY.
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-800">
                  {settings.attribution.attributionThreshold}%
                </span>
              </div>

              <input
                type="range"
                min="30"
                max="95"
                step="5"
                value={settings.attribution.attributionThreshold}
                onChange={(e) =>
                  updateAttribution({ attributionThreshold: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Show Confidence Explanations */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Show Confidence Explanations
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Display transparent textual explanations detailing score calculation factors.
                </span>
              </div>

              <button
                onClick={() =>
                  updateAttribution({
                    showConfidenceExplanations: !settings.attribution.showConfidenceExplanations,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.attribution.showConfidenceExplanations ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.attribution.showConfidenceExplanations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Contributing Evidence */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Show Contributing Evidence Cards
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Expose verifiable on-chain evidence items (sweep patterns, deposit cluster records, etc.).
                </span>
              </div>

              <button
                onClick={() =>
                  updateAttribution({
                    showContributingEvidence: !settings.attribution.showContributingEvidence,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.attribution.showContributingEvidence ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.attribution.showContributingEvidence ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Scoring Methodology Banner */}
            <div className="pt-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-md border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Scoring Methodology: {settings.attribution.scoringMethodology}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    Explainable Engine v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  "Confidence is calculated using observable evidence such as VASP proximity, hop distance, value continuity, fragmentation, cross-chain movement, and entity intelligence."
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-start space-x-2 text-[11px] text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Investigator Note:</strong> Scores reflect explainable heuristic indicators derived from observable on-chain parameters. They do not represent statistically calibrated probabilities.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ALERTS */}
      {activeSubTab === 'alerts' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Alerts & Monitoring</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure real-time investigation monitoring alerts and minimum severity notification thresholds.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 space-y-4 pt-2">
            {/* Alert Severity Threshold */}
            <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Alert Severity Threshold
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Only trigger workstation alert notifications for events matching or exceeding this priority level.
                </span>
              </div>

              <div className="inline-flex rounded-md border border-slate-300 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-800">
                {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => updateAlerts({ severityThreshold: sev })}
                    className={`px-3 py-1.5 text-xs font-semibold rounded uppercase font-mono transition ${
                      settings.alerts.severityThreshold === sev
                        ? sev === 'critical'
                          ? 'bg-rose-600 text-white font-bold'
                          : sev === 'high'
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-blue-600 text-white font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Event Toggle Controls */}
            <div className="pt-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Surveillance Trigger Rules
              </h3>

              {[
                {
                  key: 'newTransaction' as const,
                  label: 'New transaction detected',
                  desc: 'Trigger alert when target suspect wallet executes an incoming or outgoing transfer.',
                },
                {
                  key: 'newVASPExposure' as const,
                  label: 'New VASP exposure detected',
                  desc: 'Trigger alert when funds reach a newly identified regulated exchange deposit endpoint.',
                },
                {
                  key: 'crossChainMovement' as const,
                  label: 'Cross-chain movement detected',
                  desc: 'Trigger alert when funds are routed through cross-chain bridges or mixers.',
                },
                {
                  key: 'highRiskInteraction' as const,
                  label: 'High-risk interaction detected',
                  desc: 'Trigger alert upon interaction with OFAC-sanctioned, darknet, or ransomware addresses.',
                },
                {
                  key: 'monitoredWalletActivity' as const,
                  label: 'Monitored wallet activity detected',
                  desc: 'Trigger alert when any watchlisted address in active cases becomes active on-chain.',
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-1.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 dark:text-slate-200 block">
                      {item.label}
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {item.desc}
                    </span>
                  </div>

                  <button
                    onClick={() => updateAlerts({ [item.key]: !settings.alerts[item.key] })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.alerts[item.key] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.alerts[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: SAHYOG INTEGRATION */}
      {activeSubTab === 'sahyog' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>SAHYOG Integration Workflow</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Represent ChainSight's law enforcement coordination integration for statutory request generation.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 space-y-4 pt-2">
            {/* Status & Environment Display */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block uppercase font-mono">
                    Gateway Connection Status
                  </span>
                  <span className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5 block">
                    Demo Connected
                  </span>
                </div>
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/60 rounded-md border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 block uppercase font-mono">
                    System Environment
                  </span>
                  <span className="text-sm font-extrabold text-amber-900 dark:text-amber-200 mt-0.5 block">
                    Demonstration / Sandbox
                  </span>
                </div>
                <Database className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>

            {/* Auto-prepare requests */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Auto-Prepare Statutory Requests
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Automatically generate Section 91 Cr.P.C. / BNSS disclosure request drafts upon VASP attribution.
                </span>
              </div>

              <button
                onClick={() =>
                  updateSahyog({ autoPrepareRequests: !settings.sahyog.autoPrepareRequests })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.sahyog.autoPrepareRequests ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.sahyog.autoPrepareRequests ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Require investigator confirmation */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Require Investigator Manual Confirmation
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Mandate explicit officer digital sign-off prior to authorizing request exports.
                </span>
              </div>

              <button
                onClick={() =>
                  updateSahyog({ requireConfirmation: !settings.sahyog.requireConfirmation })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.sahyog.requireConfirmation ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.sahyog.requireConfirmation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Supported Request Types Display */}
            <div className="pt-4 space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Supported Enforcement Request Types
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded text-xs font-semibold flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Information Disclosure (Sec 91 Cr.P.C / BNSS)</span>
                </span>
                <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded text-xs font-semibold flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Asset Freeze Notice (Sec 102 Cr.P.C / BNSS)</span>
                </span>
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded text-xs font-semibold flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Cross-Border VASP Subpoena Tracking</span>
                </span>
              </div>
            </div>

            {/* Statutory Notice Description Box */}
            <div className="pt-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-300 text-xs font-bold">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>SAHYOG Law Enforcement Integration Notice</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic">
                  "Investigation evidence can be used to prepare authorized requests for the relevant VASP or service. External actions require investigator confirmation."
                </p>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Environment: Demonstration / Sandbox • Protocol v2.5
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: ABOUT / SYSTEM */}
      {activeSubTab === 'about' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>About / System Specifications</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Technical platform architecture, scoring engine versioning, and governance information.
            </p>
          </div>

          <div className="space-y-6">
            {/* System Info Card */}
            <div className="p-6 bg-slate-900 text-white rounded-lg border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-blue-600 rounded text-white">
                      <Shield className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-extrabold font-mono tracking-wider">CHAIN-INTEL</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Automated Blockchain Intelligence & Wallet-to-VASP Attribution Platform
                  </p>
                </div>

                <span className="px-2.5 py-1 bg-blue-900/80 text-blue-200 border border-blue-700 text-xs font-mono font-bold rounded">
                  ENTERPRISE PROTOTYPE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-1">
                <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Platform Version</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">v1.0.0</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Scoring Engine</span>
                  <span className="text-sm font-bold text-blue-400 mt-0.5 block">Heuristic v1</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Supported Networks</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">6 Blockchains</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Attribution Engine</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">5 Tiers</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between border-t border-slate-800/80">
                <span>Developed for: Law Enforcement & Cybercrime Investigation Agencies</span>
                <span>SHA-256 Custody Engine Active</span>
              </div>
            </div>

            {/* External / Informational Modal Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveModal('docs')}
                className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>View System Documentation</span>
              </button>

              <button
                onClick={() => setActiveModal('privacy')}
                className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex items-center space-x-2"
              >
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Privacy & Governance Policy</span>
              </button>

              <button
                onClick={() => setActiveModal('about')}
                className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex items-center space-x-2"
              >
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>About ChainSight</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Information Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                {activeModal === 'docs' && 'System Documentation & User Guide'}
                {activeModal === 'privacy' && 'Privacy & Evidence Governance Policy'}
                {activeModal === 'about' && 'About ChainSight Platform'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              {activeModal === 'docs' && (
                <>
                  <p>
                    <strong>ChainSight Platform Overview:</strong> ChainSight is an enterprise blockchain intelligence platform engineered for law enforcement cryptocurrency investigation workflows.
                  </p>
                  <p>
                    <strong>Key Workstation Engines:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Nearest Direct-Deposit VASP Attribution Engine (5-tier scoring)</li>
                    <li>SHA-256 Forensic Hash Integrity & Chain of Custody</li>
                    <li>Automated SAHYOG Statutory Disclosure (Sec 91 / 102 Cr.P.C)</li>
                    <li>Multi-chain Hop-by-Hop Trace Graph Visualizer</li>
                  </ul>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>
                    <strong>Evidence Integrity & Privacy Compliance:</strong> All investigation traces, wallet notes, and generated statutory reports adhere strictly to evidence custody standards.
                  </p>
                  <p>
                    Deterministic SHA-256 timestamped hashes guarantee evidence immutability for judicial submission under evidence law guidelines.
                  </p>
                </>
              )}

              {activeModal === 'about' && (
                <>
                  <p>
                    <strong>Core Objective & Architecture:</strong> Developed for law enforcement agencies to automate unhosted wallet tracing to destination exchanges.
                  </p>
                  <p>
                    <strong>Version:</strong> v1.0.0 — Prototype Demonstration Workstation.
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
