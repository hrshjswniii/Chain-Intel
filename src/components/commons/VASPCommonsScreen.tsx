import React, { useState } from 'react';
import { Users } from 'lucide-react';

export const VASPCommonsScreen: React.FC = () => {
  const [addressEntries, setAddressEntries] = useState([
    {
      address: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
      label: 'CoinDCX India Deposit Hot Wallet',
      source: 'Public FIU-IND Registry',
      confirmedBy: 'Inspector R. Sharma (ID: LE-9842)',
      status: 'VERIFIED',
      confidence: 'AUTHORITATIVE',
      lastVerified: '2026-08-15',
    },
    {
      address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
      label: 'Binance Global Main Sweep Cluster',
      source: 'Cross-Border Exchange Intelligence',
      confirmedBy: 'Officer A. Verma (ID: LE-3310)',
      status: 'VERIFIED',
      confidence: 'HIGH',
      lastVerified: '2026-08-20',
    },
    {
      address: '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc',
      label: 'Tornado Cash 100 ETH Mixer Pool',
      source: 'Sanctioned Smart Contract List',
      confirmedBy: 'Officer M. Roy (ID: LE-6102)',
      status: 'FLAGGED',
      confidence: 'AUTHORITATIVE',
      lastVerified: '2026-09-01',
    },
  ]);

  const handleConfirm = (index: number) => {
    const updated = [...addressEntries];
    updated[index].status = 'VERIFIED';
    setAddressEntries(updated);
  };

  const handleFlag = (index: number) => {
    const updated = [...addressEntries];
    updated[index].status = 'FLAGGED';
    setAddressEntries(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">VASP Intelligence Commons</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Prototype national law-enforcement shared address verification layer & intelligence crowd-sourcing
            </p>
          </div>
        </div>
      </div>

      {/* Verification Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Verified Address Intelligence Feed
          </h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="px-4 py-2.5">Address</th>
              <th className="px-4 py-2.5">Current Label</th>
              <th className="px-4 py-2.5">Intelligence Source</th>
              <th className="px-4 py-2.5">Verified By</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Officer Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {addressEntries.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-blue-900 break-all">{item.address}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{item.label}</td>
                <td className="px-4 py-3 text-slate-600">{item.source}</td>
                <td className="px-4 py-3 text-slate-700">{item.confirmedBy}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleConfirm(idx)}
                      className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-semibold"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleFlag(idx)}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded text-[10px] font-semibold"
                    >
                      Flag
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
