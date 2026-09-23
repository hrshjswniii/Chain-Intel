import React, { useState } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  GitCommit,
  Building2,
  Layers,
  FileCheck,
  Code,
  Users,
  History,
  Activity,
  Shield,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'new_investigation'
  | 'trace_analysis'
  | 'high_risk_alerts'
  | 'vasp_directory'
  | 'batch_mode'
  | 'reports'
  | 'sahyog_integration'
  | 'vasp_commons'
  | 'case_history'
  | 'system_status'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  alertCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  alertCount = 4,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse: externalOnToggleCollapse,
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('chain_intel_sidebar_collapsed');
    return saved ? saved === 'true' : false;
  });

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;

  const toggleCollapse = () => {
    if (externalOnToggleCollapse) {
      externalOnToggleCollapse();
    } else {
      setInternalIsCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem('chain_intel_sidebar_collapsed', String(next));
        return next;
      });
    }
  };

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new_investigation', label: 'New Investigation', icon: PlusCircle },
    { id: 'trace_analysis', label: 'Trace Analysis & Graph', icon: GitCommit, badge: 'CORE' },
    { id: 'high_risk_alerts', label: 'High-Risk Alerts', icon: ShieldAlert, badge: `${alertCount} NEW` },
    { id: 'vasp_directory', label: 'VASP Intelligence', icon: Building2 },
    { id: 'batch_mode', label: 'Batch Investigation', icon: Layers },
    { id: 'reports', label: 'Reports & Integrity', icon: FileCheck },
    { id: 'sahyog_integration', label: 'SAHYOG Integration', icon: Code, badge: 'API' },
    { id: 'vasp_commons', label: 'VASP Commons', icon: Users },
    { id: 'case_history', label: 'Case History', icon: History },
    { id: 'system_status', label: 'System Status & Logs', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none z-30 transition-all duration-300 ease-in-out`}
    >
      <div>
        {/* Brand Header with CHAIN-INTEL Logo & Collapse Toggle */}
        <div className={`h-14 px-3 border-b border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="p-1.5 bg-blue-600 rounded text-white shadow-sm shrink-0">
              <Shield className="w-5 h-5" />
            </span>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-extrabold text-base text-white tracking-tight block leading-none font-mono truncate">
                  CHAIN-INTEL
                </span>
                <span className="text-[10px] text-slate-400 font-mono block leading-none mt-1 truncate">
                  FORENSIC WORKSTATION
                </span>
              </div>
            )}
          </div>

          {/* Toggle Shrink/Expand Button */}
          <button
            onClick={toggleCollapse}
            className={`p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none ${
              isCollapsed ? 'mt-1' : ''
            }`}
            title={isCollapsed ? 'Expand Sidebar Navigation' : 'Shrink Sidebar Navigation'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`w-full ${
                  isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
                } rounded-md text-xs font-semibold flex items-center transition relative ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5'}`}>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : item.id === 'high_risk_alerts' ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {/* Badges / Active Indicator */}
                {!isCollapsed && item.badge ? (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase ${
                      item.id === 'high_risk_alerts'
                        ? 'bg-rose-900 text-rose-200'
                        : isActive
                        ? 'bg-blue-800 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : !isCollapsed && isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                ) : isCollapsed && item.id === 'high_risk_alerts' ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Tagline & System Info */}
      <div className={`border-t border-slate-800 text-[11px] text-slate-400 ${isCollapsed ? 'p-2 text-center' : 'p-4'}`}>
        {!isCollapsed ? (
          <>
            <p className="font-serif italic text-slate-400 text-center leading-snug">
              "Every crypto trail ends somewhere. We find that end — automatically."
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>CHAIN-INTEL v2.5.0</span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                <span>Online</span>
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-1 text-[10px]">
            <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" title="System Online" />
            <span className="text-[9px] font-mono text-slate-500">v2.5</span>
          </div>
        )}
      </div>
    </aside>
  );
};
