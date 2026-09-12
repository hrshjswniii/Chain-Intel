import React from 'react';
import { ForensicTimelineEvent } from '../../types';
import { Clock, ArrowRight, ArrowDownLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CaseTimelineTabProps {
  timeline: ForensicTimelineEvent[];
}

export const CaseTimelineTab: React.FC<CaseTimelineTabProps> = ({ timeline }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Forensic Case Timeline</h3>
          <p className="text-xs text-slate-500">Chronological transaction execution sequence</p>
        </div>
        <span className="text-xs text-slate-500">{timeline.length} Recorded Events</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline Marker Dot */}
            <span
              className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ring-white ${
                event.type === 'VASP_DEPOSIT'
                  ? 'bg-blue-600 ring-blue-100'
                  : event.risk === 'HIGH' || event.risk === 'CRITICAL'
                  ? 'bg-amber-600 ring-amber-100'
                  : 'bg-slate-500 ring-slate-100'
              }`}
            />

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 hover:border-slate-300 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-blue-900">{event.timestamp}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    event.type === 'VASP_DEPOSIT'
                      ? 'bg-blue-100 text-blue-800'
                      : event.type === 'FUND_RECEIVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {event.type.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-900">{event.description}</p>

              <div className="mt-2 flex items-center space-x-3 text-[11px] font-mono text-slate-600">
                <span>From: <strong className="text-slate-800">{event.from.slice(0, 10)}...</strong></span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>To: <strong className="text-slate-800">{event.to.slice(0, 10)}...</strong></span>
                <span className="ml-auto font-bold text-slate-900">{event.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
