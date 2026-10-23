'use client';

import React, { useState } from 'react';
import { SuggestedAction } from '@/types/incident';
import { useReliefBridge } from '@/lib/store';
import { formatIncidentTime } from '@/lib/format-time';
import { CheckCircle2, XCircle, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';

export function ActionApprovalList({
  incidentId,
  actions,
}: {
  incidentId: string;
  actions: SuggestedAction[];
}) {
  const { decideAction } = useReliefBridge();
  const [rejectingActionId, setRejectingActionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (actionId: string) => {
    decideAction(incidentId, actionId, 'APPROVED');
  };

  const handleConfirmReject = (actionId: string) => {
    if (!rejectionReason.trim()) return;
    decideAction(incidentId, actionId, 'REJECTED', rejectionReason.trim());
    setRejectingActionId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Explainable Next Steps & Human Authorization
          </h3>
          <p className="text-xs text-zinc-400">
            Suggested actions derived from validated claims. All decisions require explicit human authorization.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const isPending = action.approvalStatus === 'PENDING';
          const isApproved = action.approvalStatus === 'APPROVED';
          const isRejected = action.approvalStatus === 'REJECTED';

          const priorityBadge =
            action.priority === 'IMMEDIATE'
              ? 'bg-rose-950/80 text-rose-300 border-rose-700'
              : action.priority === 'HIGH'
              ? 'bg-amber-950/80 text-amber-300 border-amber-700'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700';

          return (
            <div
              key={action.id}
              className={`p-4 rounded-xl border transition-all ${
                isApproved
                  ? 'bg-emerald-950/20 border-emerald-800/70'
                  : isRejected
                  ? 'bg-zinc-900/40 border-zinc-800 opacity-60'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${priorityBadge}`}>
                      {action.priority}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        isApproved
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : isRejected
                          ? 'bg-rose-950 text-rose-300 border-rose-600'
                          : 'bg-amber-950 text-amber-300 border-amber-600'
                      }`}
                    >
                      {action.approvalStatus}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{action.actionText}</h4>
                </div>

                {/* Authorization Buttons */}
                {isPending && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleApprove(action.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Action
                    </button>
                    <button
                      onClick={() => {
                        setRejectingActionId(action.id);
                        setRejectionReason('');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 hover:text-rose-300 text-zinc-300 border border-zinc-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Rationale explanation */}
              <div className="mt-2.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300">
                <span className="font-semibold text-zinc-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Explainable AI Rationale:
                </span>
                {action.reasoning}
              </div>

              {/* Decision Log */}
              {isApproved && action.approvedBy && (
                <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Authorized by <strong>{action.approvedBy}</strong> at{' '}
                    {action.decidedAt ? formatIncidentTime(action.decidedAt) : 'recently'}
                  </span>
                </div>
              )}

              {isRejected && (
                <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Rejected: {action.rejectionReason || 'Declined by human reviewer'}
                  </span>
                </div>
              )}

              {/* Rejection input prompt */}
              {rejectingActionId === action.id && (
                <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-rose-700/60 space-y-2">
                  <label className="block text-xs text-rose-300 font-medium">
                    State reason for rejecting suggested action:
                  </label>
                  <input
                    type="text"
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Municipal team already dispatched via radio; duplicate order."
                    className="w-full text-xs p-2 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-rose-400"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectingActionId(null)}
                      className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmReject(action.id)}
                      className="px-3 py-1 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
