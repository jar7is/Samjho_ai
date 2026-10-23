import React from 'react';
import { AuditEvent } from '@/types/incident';
import { formatAuditTime } from '@/lib/format-time';
import { History, User, CheckCircle2, Edit2, AlertCircle, ShieldAlert, GitMerge } from 'lucide-react';

export function AuditTimeline({ auditTrail }: { auditTrail: AuditEvent[] }) {
  const getActionBadge = (type: AuditEvent['actionType']) => {
    switch (type) {
      case 'INCIDENT_CREATED':
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">CREATED</span>;
      case 'CLAIM_EDITED':
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">CLAIM EDIT</span>;
      case 'CLAIM_VERIFIED':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">VERIFIED</span>;
      case 'STATUS_CHANGED':
        return <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">STATUS</span>;
      case 'ACTION_APPROVED':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">ACTION APPROVED</span>;
      case 'ACTION_REJECTED':
        return <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono">ACTION REJECTED</span>;
      case 'CONTRADICTION_RESOLVED':
        return <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-mono">RESOLVED CONFLICT</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-mono">ASSIGNMENT</span>;
      case 'DUPLICATE_MERGE_FLAGGED':
        return <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">MERGE</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono">LOG</span>;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-zinc-400" />
          Immutable Review Audit Trail
        </h3>
        <span className="text-xs font-mono text-zinc-500">{auditTrail.length} events logged</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
        {auditTrail.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Timeline bullet icon */}
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-zinc-600 border-2 border-zinc-950 group-hover:bg-amber-400 transition-colors" />

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-2">
                  {getActionBadge(ev.actionType)}
                  <span className="text-xs font-medium text-white flex items-center gap-1">
                    <User className="w-3 h-3 text-zinc-400" />
                    {ev.actor}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  {formatAuditTime(ev.timestamp)}
                </span>
              </div>

              <p className="text-xs text-zinc-300">{ev.description}</p>

              {(ev.previousValue || ev.newValue) && (
                <div className="mt-2 p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono space-y-0.5">
                  {ev.previousValue && (
                    <div className="text-rose-400/90 truncate">
                      - {ev.previousValue}
                    </div>
                  )}
                  {ev.newValue && (
                    <div className="text-emerald-400/90 truncate">
                      + {ev.newValue}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
