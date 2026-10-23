'use client';

import React, { useState } from 'react';
import { DuplicateCandidate } from '@/types/incident';
import { useReliefBridge } from '@/lib/store';
import { GitMerge, AlertCircle, Check, X } from 'lucide-react';

interface DuplicateMergeModalProps {
  primaryIncidentId: string;
  candidate: DuplicateCandidate;
}

export function DuplicateMergeModal({
  primaryIncidentId,
  candidate,
}: DuplicateMergeModalProps) {
  const { mergeDuplicateIncident, getIncident } = useReliefBridge();
  const [isOpen, setIsOpen] = useState(false);
  const [mergeNote, setMergeNote] = useState('');

  const targetIncident = getIncident(candidate.candidateIncidentId);

  const handleMerge = (e: React.FormEvent) => {
    e.preventDefault();
    mergeDuplicateIncident(
      primaryIncidentId,
      candidate.candidateIncidentId,
      mergeNote || 'Consolidated overlapping geographic flood reports.'
    );
    setIsOpen(false);
  };

  return (
    <>
      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <GitMerge className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                Potential Duplicate Detected: {candidate.candidateIncidentId}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900 text-indigo-200 border border-indigo-600">
                {candidate.distanceKm} km radius
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">{candidate.similarityReason}</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0 cursor-pointer"
        >
          Review & Merge
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Merge Duplicate Incident</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-zinc-300 space-y-2">
              <p>
                You are about to merge auxiliary incident{' '}
                <strong className="text-white">{candidate.candidateIncidentId}</strong> (
                {candidate.candidateTitle}) into master incident{' '}
                <strong className="text-white">{primaryIncidentId}</strong>.
              </p>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="text-[11px] font-semibold text-zinc-400">IMPACT ON MERGE:</div>
                <ul className="list-disc list-inside text-zinc-300 space-y-0.5">
                  <li>Auxiliary incident will be marked <strong>CLOSED</strong>.</li>
                  <li>All uploaded evidence will be consolidated into {primaryIncidentId}.</li>
                  <li>An audit event will be recorded on both records.</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleMerge} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Merge Justification / Coordinator Notes:
                </label>
                <textarea
                  rows={2}
                  required
                  value={mergeNote}
                  onChange={(e) => setMergeNote(e.target.value)}
                  placeholder="e.g. Confirmed downstream runoff tributary is part of the same Sector 4 flood crest."
                  className="w-full text-xs p-2 rounded bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                >
                  Confirm & Consolidate Cases
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
