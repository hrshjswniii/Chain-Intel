import React, { useState } from 'react';
import { KNOWN_VASP_DATABASE } from '../../engine/vasp/vaspDatabase';
import { VASPMatch } from '../../types';
import { Search, ShieldCheck, Globe, Mail, Building2, CheckCircle2, AlertTriangle } from 'lucide-react';

export const VASPIntelligenceScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const vaspList = Object.values(KNOWN_VASP_DATABASE).filter((vasp) => {
    const matchesSearch =
      vasp.name.toLowerCase().includes(search.toLowerCase()) ||
      vasp.jurisdiction.toLowerCase().includes(search.toLowerCase()) ||
      vasp.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === 'ALL' ||
      (filterCategory === 'DOMESTIC' && vasp.isDomestic) ||
      (filterCategory === 'GLOBAL' && !vasp.isDomestic && vasp.category !== 'Privacy Mixer / Tumbler') ||
      (filterCategory === 'MIXER' && vasp.category.includes('Mixer'));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">VASP Intelligence Repository</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative Virtual Asset Service Provider address mapping & law-enforcement cooperation directory
          </p>
        </div>

        {/* Quick Search & Filter Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search VASP name or jurisdiction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="DOMESTIC">FIU-IND Domestic Exchanges</option>
            <option value="GLOBAL">Global Exchanges</option>
            <option value="MIXER">Sanctioned Mixers / Tumblers</option>
          </select>
        </div>
      </div>

      {/* VASP Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vaspList.map((vasp, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>{vasp.name}</span>
                    {vasp.isDomestic && (
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        FIU-IND
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-slate-500 block mt-0.5">{vasp.category}</span>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    vasp.cooperationPriority === 'DOMESTIC'
                      ? 'bg-emerald-100 text-emerald-800'
                      : vasp.cooperationPriority === 'CROSS_BORDER_PRIORITY'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {vasp.cooperationPriority.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{vasp.jurisdiction}</span>
                </div>

                <div className="flex items-center space-x-2 text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Cluster Addresses: <strong className="text-slate-900 font-mono font-semibold">{vasp.addressCount.toLocaleString()}</strong>
                  </span>
                </div>

                {vasp.complianceContact && (
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-slate-700 text-[11px] truncate">{vasp.complianceContact}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified: {vasp.verifiedDate}</span>
              <span className="font-semibold text-slate-600">{vasp.confidenceLevel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
