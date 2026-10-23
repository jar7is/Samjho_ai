'use client';

import React, { useState } from 'react';
import { Contradiction } from '@/types/incident';
import { useReliefBridge } from '@/lib/store';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface ConflictAlertProps {
  incidentId: string;
  contradiction: Contradiction;
}

export function ConflictAlert({ incidentId, contradiction }: ConflictAlertProps) {
  const { resolveContradiction } = useReliefBridge();
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const isResolved = contradiction.resolutionStatus === 'resolved';

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNote.trim()) return;
    resolveContradiction(incidentId, contradiction.id, resolutionNote.trim());
    setIsResolving(false);
  };

  return (
    <div
      className={`rounded-xl border p-3 transition-all ${
        isResolved
          ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
          : 'bg-rose-950/25 border-rose-800/60 text-rose-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle
            className={`w-4 h-4 shrink-0 ${isResolved ? 'text-zinc-500' : 'text-rose-400'}`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-white truncate">
                {contradiction.title}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.2 rounded font-medium shrink-0 ${
                  isResolved
                    ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    : 'bg-rose-900/70 text-rose-200 border border-rose-700'
                }`}
              >
                {isResolved ? 'RESOLVED' : 'CONFLICT'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate max-w-xl">{contradiction.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-900/60 border border-zinc-800 flex items-center gap-1 cursor-pointer"
          >
            {isExpanded ? (
              <>
                Hide Details <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Compare <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>

          {!isResolved && (
            <button
              onClick={() => {
                setIsExpanded(true);
                setIsResolving(!isResolving);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
            >
              Reconcile
            </button>
          )}
        </div>
      </div>

      {/* Expandable comparison */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-rose-900/30 space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>CLAIM A</span>
                <span className="text-amber-400">{contradiction.evidenceARef}</span>
              </div>
              <p className="text-zinc-200 italic">&ldquo;{contradiction.claimAText}&rdquo;</p>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>CLAIM B</span>
                <span className="text-sky-400">{contradiction.evidenceBRef}</span>
              </div>
              <p className="text-zinc-200 italic">&ldquo;{contradiction.claimBText}&rdquo;</p>
            </div>
          </div>

          {isResolved && contradiction.resolutionNote && (
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Resolution:</strong> {contradiction.resolutionNote}{' '}
                {contradiction.resolvedBy && `(by ${contradiction.resolvedBy})`}
              </span>
            </div>
          )}

          {isResolving && !isResolved && (
            <form onSubmit={handleResolve} className="p-2.5 rounded-lg bg-zinc-950 border border-rose-700/60 space-y-2">
              <label className="block text-[11px] font-semibold text-rose-200">
                State Reconciliation Decision / Verified Location:
              </label>
              <input
                type="text"
                required
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="e.g. Verified Mile Marker 4 bridge passable; flooding is at Exit 12."
                className="w-full text-xs p-2 rounded bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResolving(false)}
                  className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Save & Log Audit
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
