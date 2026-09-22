import React from 'react';
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
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, alertCount = 4 }) => {
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
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none z-30">
      <div>
        {/* Brand Header with CHAIN-INTEL Logo */}
        <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 bg-blue-600 rounded text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight block leading-none font-mono">CHAIN-INTEL</span>
              <span className="text-[10px] text-slate-400 font-mono block leading-none mt-1">FORENSIC WORKSTATION</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'high_risk_alerts' ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
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
                ) : isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Tagline & System Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
        <p className="font-serif italic text-slate-400 text-center leading-snug">
          "Every crypto trail ends somewhere. We find that end — automatically."
        </p>
        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>CHAIN-INTEL v2.5.0</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
            <span>Online</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
