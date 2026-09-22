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

import { generateDynamicGraphAndHops } from './engine/scoring/graphGenerator';

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

    const targetAddr = query.trim();
    const detection = detectChainAndType(targetAddr);
    const dynamicCase = generateDynamicGraphAndHops({
      targetInput: targetAddr,
      chain: detection.chain,
      maxHops: settings.investigation.defaultTraceDepth || 4,
      dataSource: dataSourceMode,
    });

    setActiveCase(dynamicCase);
    setActiveTab('trace_analysis');
  };

  const handleStartTraceFromForm = async (newCaseParams: Partial<InvestigationCase>) => {
    const targetAddr = newCaseParams.targetInput || '0x71C7656EC7ab88b098defb751b7401b5f6d8976f';
    const detection = detectChainAndType(targetAddr);
    const requestedHops = newCaseParams.maxHops || 4;

    const dynamicCase = generateDynamicGraphAndHops({
      targetInput: targetAddr,
      chain: newCaseParams.chain || detection.chain,
      maxHops: requestedHops,
      caseReference: newCaseParams.caseReference,
      investigator: newCaseParams.investigator,
      incidentType: newCaseParams.incidentType,
      priority: newCaseParams.priority,
      minTransferValue: newCaseParams.minTransferValue,
      notes: newCaseParams.notes,
      dataSource: dataSourceMode,
    });

    setActiveCase(dynamicCase);
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
