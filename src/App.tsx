import React, { useState } from 'react';
import { TopNav } from './components/layout/TopNav';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { NewInvestigationScreen } from './components/investigation/NewInvestigationScreen';
import { TraceAnalysisScreen } from './components/trace/TraceAnalysisScreen';
import { HighRiskAlertsScreen } from './components/alerts/HighRiskAlertsScreen';
import { VASPIntelligenceScreen } from './components/vasp/VASPIntelligenceScreen';
import { BatchInvestigationScreen } from './components/batch/BatchInvestigationScreen';
import { ReportsScreen } from './components/reports/ReportsScreen';
import { SahyogIntegrationScreen } from './components/sahyog/SahyogIntegrationScreen';
import { VASPCommonsScreen } from './components/commons/VASPCommonsScreen';
import { CaseHistoryScreen } from './components/history/CaseHistoryScreen';
import { SystemStatusScreen } from './components/status/SystemStatusScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { LandingPage } from './components/landing/LandingPage';
import { NotFoundScreen } from './components/common/NotFoundScreen';
import { LegalNoticeModal } from './components/sahyog/LegalNoticeModal';
import { FreezeRequestModal } from './components/sahyog/FreezeRequestModal';
import { loadSettings, saveSettings, resetSettings } from './engine/settings/settingsStore';
import { ChainSightSettings } from './types/settings';

import { DEMO_INVESTIGATION_CASES } from './demo/demoCases';
import { InvestigationCase, BlockchainType } from './types';
import { matchAddress } from './engine/vasp/vaspDatabase';
import { calculateAttributionScore } from './engine/scoring/scoringEngine';
import { detectChainAndType } from './engine/adapters/chainAdapter';
import { resolveAddressNetworksClient, NetworkMatch } from './engine/resolution/chainResolverClient';
import { MultiNetworkResolverModal } from './components/resolution/MultiNetworkResolverModal';
import { generateDynamicGraphAndHops, buildLiveGraphFromTransactions } from './engine/scoring/graphGenerator';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    // Check hash or path if user directly navigated to dashboard/workstation
    if (typeof window !== 'undefined' && (window.location.hash === '#workstation' || window.location.pathname.includes('/workstation') || window.location.pathname.includes('/dashboard'))) {
      return 'dashboard';
    }
    return 'landing';
  });

  const [activeCase, setActiveCase] = useState<InvestigationCase>(DEMO_INVESTIGATION_CASES[0]);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [liveErrorMessage, setLiveErrorMessage] = useState<string | undefined>(undefined);
  const [liveStatusBadge, setLiveStatusBadge] = useState<string | undefined>(undefined);
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [dataSourceMode, setDataSourceMode] = useState<'DEMO' | 'LIVE'>('DEMO');

  const [settings, setSettings] = useState<ChainSightSettings>(() => loadSettings());

  const handleUpdateSettings = (newSettings: ChainSightSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetSettings = () => {
    const defaults = resetSettings();
    setSettings(defaults);
  };

  const isDarkMode = (() => {
    if (settings.appearance.theme === 'dark') return true;
    if (settings.appearance.theme === 'light') return false;
    if (settings.appearance.theme === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  })();

  const handleSelectCase = (caseItem: InvestigationCase) => {
    setActiveCase(caseItem);
    setActiveTab('trace_analysis');
  };

  const [isResolvingNetwork, setIsResolvingNetwork] = useState(false);
  const [multiNetworkMatches, setMultiNetworkMatches] = useState<NetworkMatch[]>([]);
  const [pendingAddressForResolution, setPendingAddressForResolution] = useState<string>('');
  const [isMultiNetworkModalOpen, setIsMultiNetworkModalOpen] = useState(false);

  const executeLiveTraceForChain = async (
    targetAddr: string,
    chainToUse: BlockchainType,
    options?: { maxHops?: number; direction?: 'OUT' | 'IN' | 'BOTH'; maxCounterpartiesPerNode?: number }
  ) => {
    try {
      const response = await fetch('/api/v1/trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetInput: targetAddr,
          chain: chainToUse,
          maxHops: options?.maxHops || settings.investigation.defaultTraceDepth || 2,
          direction: options?.direction || 'BOTH',
          maxCounterpartiesPerNode: options?.maxCounterpartiesPerNode || 10,
        }),
      });

      const data = await response.json();

      if (data.status === 'SUCCESS_WITH_DATA') {
        const liveCase = buildLiveGraphFromTransactions(targetAddr, chainToUse, data.transactions || [], data);
        setActiveCase(liveCase);
        setActiveTab('trace_analysis');
        return;
      }

      if (data.status === 'SUCCESS_NO_TRANSFERS') {
        const liveCase = buildLiveGraphFromTransactions(targetAddr, chainToUse, [], data);
        setActiveCase(liveCase);
        setActiveTab('trace_analysis');
        return;
      }

      if (data.status === 'LIVE_DATA_UNAVAILABLE' || data.status === 'INVALID_INPUT') {
        setLiveStatusBadge(`LIVE MODE: ${data.status}`);
        setLiveErrorMessage(data.message || 'Live network trace failed.');
        setActiveTab('not_found');
        return;
      }
    } catch (err: any) {
      setLiveStatusBadge('LIVE MODE: LIVE_DATA_UNAVAILABLE');
      setLiveErrorMessage(`API Gateway server connection error: ${err.message || 'Ensure API server is running on port 3001.'}`);
      setActiveTab('not_found');
      return;
    }
  };

  const handleSearchInput = async (
    query: string,
    selectedChain?: BlockchainType,
    options?: { maxHops?: number; direction?: 'OUT' | 'IN' | 'BOTH'; maxCounterpartiesPerNode?: number }
  ) => {
    setLastSearchQuery(query);
    setLiveErrorMessage(undefined);
    setLiveStatusBadge(undefined);

    if (query.trim().toLowerCase() === '404' || query.trim().toLowerCase() === 'notfound') {
      setActiveTab('not_found');
      return;
    }

    const foundDemo = DEMO_INVESTIGATION_CASES.find(
      (c) =>
        c.caseReference.toLowerCase() === query.toLowerCase() ||
        c.targetInput.toLowerCase() === query.toLowerCase()
    );

    if (foundDemo && dataSourceMode === 'DEMO') {
      setActiveCase(foundDemo);
      setActiveTab('trace_analysis');
      return;
    }

    const targetAddr = query.trim();

    if (dataSourceMode === 'LIVE') {
      // If chain is explicitly provided (manual override), execute trace directly
      if (selectedChain) {
        await executeLiveTraceForChain(targetAddr, selectedChain, options);
        return;
      }

      // Automatic Evidence-Based Network Resolution Protocol
      setIsResolvingNetwork(true);
      try {
        const resolution = await resolveAddressNetworksClient(targetAddr);
        setIsResolvingNetwork(false);

        if (resolution.status === 'RESOLVED' && resolution.matches && resolution.matches.length > 0) {
          await executeLiveTraceForChain(targetAddr, resolution.matches[0].chain as BlockchainType, options);
          return;
        }

        if (resolution.status === 'MULTIPLE_NETWORKS') {
          setPendingAddressForResolution(targetAddr);
          setMultiNetworkMatches(resolution.matches);
          setIsMultiNetworkModalOpen(true);
          return;
        }

        if (resolution.status === 'NO_ACTIVITY') {
          setLiveStatusBadge('NO SUPPORTED BLOCKCHAIN ACTIVITY FOUND');
          setLiveErrorMessage(resolution.message || 'The supplied address could not be associated with observable activity on the currently supported networks.');
          setActiveTab('not_found');
          return;
        }

        if (resolution.status === 'LIVE_DATA_UNAVAILABLE' || resolution.status === 'INVALID_ADDRESS') {
          setLiveStatusBadge(`NETWORK RESOLUTION FAILED (${resolution.status})`);
          setLiveErrorMessage(resolution.message || 'Unable to query blockchain data. No fallback/mock data was used.');
          setActiveTab('not_found');
          return;
        }
      } catch (err: any) {
        setIsResolvingNetwork(false);
        setLiveStatusBadge('NETWORK RESOLUTION FAILED');
        setLiveErrorMessage(`API Gateway server connection error: ${err.message || 'Ensure API server is running on port 3001.'}`);
        setActiveTab('not_found');
        return;
      }
    } else {
      // DEMO mode
      const detection = detectChainAndType(targetAddr);
      const chainToUse = selectedChain || (detection.isValid ? detection.chain : 'Ethereum');

      if (!detection.isValid && !targetAddr.startsWith('0x') && !targetAddr.startsWith('bc1') && !targetAddr.startsWith('T') && targetAddr.length < 5) {
        setActiveTab('not_found');
        return;
      }

      const dynamicCase = generateDynamicGraphAndHops({
        targetInput: targetAddr,
        chain: chainToUse,
        maxHops: options?.maxHops || settings.investigation.defaultTraceDepth || 2,
        dataSource: 'DEMO',
      });

      setActiveCase(dynamicCase);
      setActiveTab('trace_analysis');
    }
  };

  const handleStartTraceFromForm = async (newCaseParams: Partial<InvestigationCase>) => {
    const targetAddr = newCaseParams.targetInput || '0x71C7656EC7ab88b098defb751b7401b5f6d8976f';
    const selectedChain = newCaseParams.chain || 'Ethereum';
    handleSearchInput(targetAddr, selectedChain);
  };

  // If viewing Landing Page, render full public landing view
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onLaunchPlatform={() => setActiveTab('dashboard')}
        onSelectPresetCase={(caseId) => {
          const found = DEMO_INVESTIGATION_CASES.find((c) => c.caseReference === caseId);
          if (found) {
            setActiveCase(found);
            setActiveTab('trace_analysis');
          } else {
            setActiveTab('dashboard');
          }
        }}
      />
    );
  }

  return (
    <div className={isDarkMode ? 'dark min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100' : 'min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900'}>
      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Professional Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} alertCount={4} />

        {/* Main Workstation Body */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navigation Workspace Header */}
          <TopNav
            onSearchInput={handleSearchInput}
            activeCase={activeCase}
            dataSourceMode={dataSourceMode}
            onToggleDataSourceMode={() =>
              setDataSourceMode((prev) => (prev === 'DEMO' ? 'LIVE' : 'DEMO'))
            }
            isResolvingNetwork={isResolvingNetwork}
          />

          {/* Active Screen View Router */}
          <main className="p-6 flex-1">
            {activeTab === 'not_found' && (
              <NotFoundScreen
                searchedTerm={lastSearchQuery}
                errorMessage={liveErrorMessage}
                statusBadge={liveStatusBadge}
                onReturnToWorkstation={() => setActiveTab('dashboard')}
                onSearchNewTrace={handleSearchInput}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardScreen
                onSelectCase={handleSelectCase}
                onNewInvestigation={() => setActiveTab('new_investigation')}
              />
            )}

            {activeTab === 'new_investigation' && (
              <NewInvestigationScreen
                onStartTrace={handleStartTraceFromForm}
                onSelectPresetCase={handleSelectCase}
              />
            )}

            {activeTab === 'trace_analysis' && (
              <TraceAnalysisScreen
                activeCase={activeCase}
                onOpenReport={() => setActiveTab('reports')}
                onOpenLegalNotice={() => setIsLegalNoticeOpen(true)}
                onOpenFreezeModal={() => setIsFreezeModalOpen(true)}
              />
            )}

            {activeTab === 'high_risk_alerts' && (
              <HighRiskAlertsScreen
                onSelectCase={handleSelectCase}
                onOpenFreezeModal={(c) => {
                  setActiveCase(c);
                  setIsFreezeModalOpen(true);
                }}
              />
            )}

            {activeTab === 'vasp_directory' && <VASPIntelligenceScreen />}

            {activeTab === 'batch_mode' && <BatchInvestigationScreen />}

            {activeTab === 'reports' && (
              <ReportsScreen
                currentCase={activeCase}
                onOpenLegalNotice={() => setIsLegalNoticeOpen(true)}
              />
            )}

            {activeTab === 'sahyog_integration' && (
              <SahyogIntegrationScreen currentCase={activeCase} />
            )}

            {activeTab === 'vasp_commons' && <VASPCommonsScreen />}

            {activeTab === 'case_history' && (
              <CaseHistoryScreen onSelectCase={handleSelectCase} />
            )}

            {activeTab === 'system_status' && <SystemStatusScreen />}

            {activeTab === 'settings' && (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetSettings={handleResetSettings}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Legal Disclosure Request Draft Modal (Sec 91) */}
      <LegalNoticeModal
        currentCase={activeCase}
        isOpen={isLegalNoticeOpen}
        onClose={() => setIsLegalNoticeOpen(false)}
      />

      {/* Global Asset Restraint / Account Freeze Request Modal (Sec 102) */}
      <FreezeRequestModal
        currentCase={activeCase}
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
      />

      {/* Multiple Networks Detected Scope Selector Modal */}
      <MultiNetworkResolverModal
        isOpen={isMultiNetworkModalOpen}
        address={pendingAddressForResolution}
        matches={multiNetworkMatches}
        onSelectNetwork={async (selectedMatch: NetworkMatch) => {
          setIsMultiNetworkModalOpen(false);
          await executeLiveTraceForChain(pendingAddressForResolution, selectedMatch.chain as BlockchainType);
        }}
        onClose={() => setIsMultiNetworkModalOpen(false)}
      />
    </div>
  );
}

export default App;

