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
import { LegalNoticeModal } from './components/sahyog/LegalNoticeModal';
import { FreezeRequestModal } from './components/sahyog/FreezeRequestModal';
import { loadSettings, saveSettings, resetSettings } from './engine/settings/settingsStore';
import { ChainSightSettings } from './types/settings';

import { DEMO_INVESTIGATION_CASES } from './demo/demoCases';
import { InvestigationCase } from './types';
import { matchAddress } from './engine/vasp/vaspDatabase';
import { calculateAttributionScore } from './engine/scoring/scoringEngine';
import { generateInvestigatorNarrative } from './engine/narrative/narrativeEngine';
import { detectChainAndType } from './engine/adapters/chainAdapter';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [activeCase, setActiveCase] = useState<InvestigationCase>(DEMO_INVESTIGATION_CASES[0]);
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

  const handleSearchInput = (query: string) => {
    const foundDemo = DEMO_INVESTIGATION_CASES.find(
      (c) =>
        c.caseReference.toLowerCase() === query.toLowerCase() ||
        c.targetInput.toLowerCase() === query.toLowerCase()
    );

    if (foundDemo) {
      setActiveCase(foundDemo);
      setActiveTab('trace_analysis');
      return;
    }

    const match = matchAddress(query);
    const detection = detectChainAndType(query);

    const attribution = calculateAttributionScore({
      hasVASPMatch: match.isMatch,
      vaspDetails: match.vaspDetails,
      matchType: match.matchType,
      hopDistance: match.isMatch ? 3 : 4,
      typologies: [],
    });

    const targetAddr = query.trim();
    const isVasp = match.isMatch;
    const vaspName = match.vaspDetails?.name || 'Unattributed';

    const newCaseData: InvestigationCase = {
      id: `TB-SEARCH-${Date.now().toString().slice(-4)}`,
      caseReference: `CS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      investigator: 'Inspector R. Sharma (ID: LE-9842)',
      incidentType: 'Ad-hoc Wallet Trace Investigation',
      targetInput: targetAddr,
      inputType: detection.inputType,
      chain: detection.chain,
      status: 'ACTIVE',
      priority: 'HIGH',
      riskLevel: match.isMatch ? 'HIGH' : 'MEDIUM',
      vaspDestination: vaspName,
      nearestDirectDepositVASP: vaspName,
      confidenceTier: attribution.tier,
      confidenceScore: attribution.percentage,
      dataSource: dataSourceMode,
      createdDate: new Date().toLocaleDateString('en-IN'),
      updatedDate: new Date().toLocaleDateString('en-IN'),
      maxHops: 4,
      minTransferValue: 0.1,
      notes: 'Initiated via top search workstation bar.',
      nodes: [
        {
          id: 'node-search-target',
          label: targetAddr,
          type: 'UNHOSTED_WALLET',
          chain: detection.chain,
          txCount: 24,
          totalVolume: 12.5,
          riskLevel: 'HIGH',
          role: 'Suspect Target Wallet',
          isTarget: true,
          lastActive: 'Just Now',
        },
        {
          id: 'node-search-hop1',
          label: 'Intermediary 1 (0x8F2...41B9)',
          type: 'WALLET',
          chain: detection.chain,
          txCount: 4,
          totalVolume: 12.2,
          riskLevel: 'MEDIUM',
          role: 'Pass-through Wallet',
          lastActive: '10 mins ago',
        },
        {
          id: 'node-search-vasp',
          label: isVasp ? `${vaspName} Deposit` : 'Unlabelled Destination',
          type: isVasp ? 'EXCHANGE_DEPOSIT_WALLET' : 'WALLET',
          chain: detection.chain,
          txCount: 14200,
          totalVolume: 54000.0,
          riskLevel: 'LOW',
          role: isVasp ? 'Nearest Direct-Deposit Accepting VASP Wallet' : 'Unattributed Wallet',
          isNearestDirectDeposit: isVasp,
          isDestinationVASP: isVasp,
          vaspName: isVasp ? vaspName : undefined,
          lastActive: 'Just Now',
        },
      ],
      edges: [
        {
          id: 'edge-s1',
          source: 'node-search-target',
          target: 'node-search-hop1',
          amount: 12.5,
          asset: detection.chain === 'Bitcoin' ? 'BTC' : 'ETH',
          txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
          timestamp: 'Today',
          isSuspicious: true,
        },
        {
          id: 'edge-s2',
          source: 'node-search-hop1',
          target: 'node-search-vasp',
          amount: 12.1,
          asset: detection.chain === 'Bitcoin' ? 'BTC' : 'ETH',
          txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
          timestamp: 'Today',
          isSuspicious: false,
        },
      ],
      hops: [
        {
          hopIndex: 1,
          fromAddress: targetAddr,
          toAddress: '0x8F24890A11c47981D90412B009141b29E37841B9',
          txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
          amount: 12.5,
          asset: detection.chain === 'Bitcoin' ? 'BTC' : 'ETH',
          usdValue: 31250,
          timestamp: 'Today 14:00',
          typology: 'Pass-through Transfer',
          isVASP: false,
        },
        {
          hopIndex: 2,
          fromAddress: '0x8F24890A11c47981D90412B009141b29E37841B9',
          toAddress: targetAddr,
          txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
          amount: 12.1,
          asset: detection.chain === 'Bitcoin' ? 'BTC' : 'ETH',
          usdValue: 30250,
          timestamp: 'Today 14:30',
          typology: isVasp ? 'VASP Deposit Sweep' : 'Unlabelled Transfer',
          isVASP: isVasp,
          isDirectDeposit: isVasp,
          vaspName: isVasp ? vaspName : undefined,
        },
      ],
      typologies: [],
      attribution,
      evidenceList: [
        {
          id: 'ev-s1',
          title: isVasp ? `Verified Nearest Direct-Deposit VASP (${vaspName})` : 'Unattributed Endpoint',
          type: 'DIRECT_DEPOSIT_MATCH',
          source: 'TraceBack VASP Intelligence',
          address: targetAddr,
          lastVerified: '2026-08-15',
          strength: isVasp ? 'STRONG' : 'WEAK',
          description: match.explanation,
        },
      ],
      timeline: [],
      narrative: generateInvestigatorNarrative({
        caseReference: `CS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        targetInput: targetAddr,
        chain: detection.chain,
        vaspDestination: vaspName,
        nearestDirectDepositVASP: vaspName,
        confidenceScore: attribution.percentage,
        confidenceTier: attribution.tier,
      }),
      sha256Hash: '7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2a',
      hashTimestamp: new Date().toISOString(),
    };

    setActiveCase(newCaseData);
    setActiveTab('trace_analysis');
  };

  const handleStartTraceFromForm = async (newCaseParams: Partial<InvestigationCase>) => {
    const targetAddr = newCaseParams.targetInput || '0x71C7656EC7ab88b098defb751b7401b5f6d8976f';
    const match = matchAddress(targetAddr);
    const detection = detectChainAndType(targetAddr);

    const attribution = calculateAttributionScore({
      hasVASPMatch: match.isMatch,
      vaspDetails: match.vaspDetails,
      matchType: match.matchType,
      hopDistance: newCaseParams.maxHops || 3,
      typologies: [],
    });

    const vaspName = match.vaspDetails?.name || 'CoinDCX India';

    const fullCase: InvestigationCase = {
      id: newCaseParams.id || `TB-${Date.now()}`,
      caseReference: newCaseParams.caseReference || 'CS-2026-9912',
      investigator: newCaseParams.investigator || 'Inspector R. Sharma (ID: LE-9842)',
      incidentType: newCaseParams.incidentType || 'Cryptocurrency Fraud',
      targetInput: targetAddr,
      inputType: detection.inputType,
      chain: newCaseParams.chain || detection.chain,
      status: 'ACTIVE',
      priority: newCaseParams.priority || 'HIGH',
      riskLevel: 'HIGH',
      vaspDestination: vaspName,
      nearestDirectDepositVASP: vaspName,
      confidenceTier: attribution.tier,
      confidenceScore: attribution.percentage,
      dataSource: dataSourceMode,
      createdDate: new Date().toLocaleDateString('en-IN'),
      updatedDate: new Date().toLocaleDateString('en-IN'),
      maxHops: newCaseParams.maxHops || 4,
      minTransferValue: newCaseParams.minTransferValue || 0.1,
      notes: newCaseParams.notes || '',
      nodes: DEMO_INVESTIGATION_CASES[0].nodes,
      edges: DEMO_INVESTIGATION_CASES[0].edges,
      hops: DEMO_INVESTIGATION_CASES[0].hops,
      typologies: DEMO_INVESTIGATION_CASES[0].typologies,
      attribution,
      evidenceList: DEMO_INVESTIGATION_CASES[0].evidenceList,
      timeline: DEMO_INVESTIGATION_CASES[0].timeline,
      narrative: generateInvestigatorNarrative({
        caseReference: newCaseParams.caseReference,
        targetInput: targetAddr,
        chain: newCaseParams.chain || detection.chain,
        vaspDestination: vaspName,
        nearestDirectDepositVASP: vaspName,
        confidenceScore: attribution.percentage,
        confidenceTier: attribution.tier,
      }),
      sha256Hash: '7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2a',
      hashTimestamp: new Date().toISOString(),
    };

    setActiveCase(fullCase);
    setActiveTab('trace_analysis');
  };

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
          />

          {/* Active Screen View Router */}
          <main className="p-6 flex-1">
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
    </div>
  );
}

export default App;
