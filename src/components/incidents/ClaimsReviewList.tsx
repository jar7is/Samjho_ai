'use client';

import React, { useState } from 'react';
import { Claim, Evidence, VerificationStatus } from '@/types/incident';
import { useReliefBridge } from '@/lib/store';
import { ClaimOriginBadge, VerificationBadge } from './StatusBadge';
import { Edit3, CheckCheck, Link2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface ClaimsReviewListProps {
  incidentId: string;
  claims: Claim[];
  evidenceList: Evidence[];
}

export function ClaimsReviewList({ incidentId, claims, evidenceList }: ClaimsReviewListProps) {
  const { updateClaim, setClaimVerification } = useReliefBridge();
  const [editingClaimId, setEditingClaimId] = useState<string | null>(null);
  const [editStatement, setEditStatement] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editStatus, setEditStatus] = useState<VerificationStatus>('verified');

  const startEdit = (claim: Claim) => {
    setEditingClaimId(claim.id);
    setEditStatement(claim.statement);
    setEditReason(claim.editReason || '');
    setEditStatus(claim.verificationStatus);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClaimId || !editStatement.trim() || !editReason.trim()) return;

    updateClaim(incidentId, editingClaimId, editStatement.trim(), editReason.trim(), editStatus);
    setEditingClaimId(null);
  };

  const handleQuickStatusChange = (claimId: string, newStatus: VerificationStatus) => {
    const promptReason =
      newStatus === 'verified'
        ? 'Verified via field dispatch contact'
        : newStatus === 'disputed'
        ? 'Contradicted by secondary source'
        : 'Status updated by coordinator';
    setClaimVerification(incidentId, claimId, newStatus, promptReason);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Evidence-Linked Claims Review
          </h3>
          <p className="text-xs text-zinc-400">
            Verify, correct, or dispute individual statements extracted from raw reports.
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          {claims.length} claims extracted
        </span>
      </div>

      <div className="space-y-3">
        {claims.map((claim) => {
          const linkedEvidence = evidenceList.find((e) => e.id === claim.evidenceId);
          const isBeingEdited = editingClaimId === claim.id;

          return (
            <div
              key={claim.id}
              className={`p-4 rounded-xl border transition-all ${
                claim.verificationStatus === 'disputed'
                  ? 'bg-rose-950/20 border-rose-800/60'
                  : claim.verificationStatus === 'verified'
                  ? 'bg-zinc-900/80 border-emerald-800/50'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {claim.category.toUpperCase().replace('_', ' ')}
                  </span>
                  <ClaimOriginBadge origin={claim.origin} />
                  <VerificationBadge status={claim.verificationStatus} />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <select
                    value={claim.verificationStatus}
                    onChange={(e) =>
                      handleQuickStatusChange(claim.id, e.target.value as VerificationStatus)
                    }
                    className="text-xs px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="unverified">Mark Unverified</option>
                    <option value="in_review">Mark In Review</option>
                    <option value="verified">Mark Verified Fact</option>
                    <option value="disputed">Mark Disputed</option>
                    <option value="retracted">Mark Retracted</option>
                  </select>

                  <button
                    onClick={() => startEdit(claim)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors cursor-pointer"
                    title="Edit claim and log reason"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    Correct Claim
                  </button>
                </div>
              </div>

              {/* Statement */}
              <div className="mt-3">
                <p className="text-sm font-semibold text-white leading-relaxed">{claim.statement}</p>
              </div>

              {/* Linked Evidence citation */}
              {claim.evidenceQuote && (
                <div className="mt-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 border-l-2 border-l-sky-400 text-xs text-zinc-300 flex items-start gap-2.5">
                  <Link2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <span className="text-zinc-500 font-mono text-[11px] block font-medium">
                      LINKED SOURCE EVIDENCE: {linkedEvidence ? `${linkedEvidence.title} (${linkedEvidence.sender})` : 'Direct Report'}
                    </span>
                    <span className="italic text-zinc-200 block font-serif">&ldquo;{claim.evidenceQuote}&rdquo;</span>
                  </div>
                </div>
              )}

              {/* Human audit notes if modified */}
              {claim.editReason && (
                <div className="mt-2 text-[11px] text-amber-300/90 flex items-center gap-1.5 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/40">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>
                    <strong>Human correction by {claim.editedBy || 'Coordinator'}:</strong>{' '}
                    {claim.editReason}
                  </span>
                </div>
              )}

              {/* Inline Edit Form */}
              {isBeingEdited && (
                <form
                  onSubmit={handleSaveEdit}
                  className="mt-3 p-3 rounded-lg bg-zinc-950 border border-amber-600/60 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span>Correcting Claim Statement</span>
                    <span className="text-[10px] text-zinc-400">All edits are logged in audit history</span>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1">
                      Corrected Statement:
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={editStatement}
                      onChange={(e) => setEditStatement(e.target.value)}
                      className="w-full text-xs p-2 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1">
                        Reason for Correction <span className="text-rose-400">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        placeholder="e.g. Eyewitness call confused bridge with exit 12 overpass"
                        className="w-full text-xs p-2 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1">
                        New Verification Status:
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as VerificationStatus)}
                        className="w-full text-xs p-2 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="verified">Verified Fact</option>
                        <option value="in_review">In Review</option>
                        <option value="unverified">Unverified</option>
                        <option value="disputed">Disputed / Conflict</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingClaimId(null)}
                      className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors cursor-pointer"
                    >
                      Save Correction & Log Audit
                    </button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
