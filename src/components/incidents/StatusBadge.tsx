import React from 'react';
import { IncidentStatus, SeverityLevel, ClaimOrigin, VerificationStatus } from '@/types/incident';

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const styles: Record<IncidentStatus, string> = {
    NEW: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
    TRIAGED: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60',
    ACTION_REQUIRED: 'bg-amber-950/80 text-amber-300 border-amber-600/70 animate-pulse',
    IN_PROGRESS: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
    RESOLVED: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    CLOSED: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60',
  };

  const labels: Record<IncidentStatus, string> = {
    NEW: 'New Intake',
    TRIAGED: 'Triaged',
    ACTION_REQUIRED: 'Action Required',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed / Merged',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[status] || styles.NEW
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const styles: Record<SeverityLevel, string> = {
    CRITICAL: 'bg-rose-950/90 text-rose-200 border-rose-600/80 shadow-rose-950/50 shadow-sm',
    HIGH: 'bg-orange-950/90 text-orange-200 border-orange-600/70',
    MEDIUM: 'bg-amber-950/80 text-amber-200 border-amber-700/60',
    LOW: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
        styles[severity] || styles.LOW
      }`}
    >
      {severity}
    </span>
  );
}

export function ClaimOriginBadge({ origin }: { origin: ClaimOrigin }) {
  switch (origin) {
    case 'user_reported':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-sky-950/70 text-sky-300 border border-sky-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          User Reported
        </span>
      );
    case 'ai_inferred':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-950/70 text-purple-300 border border-purple-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          AI Inferred
        </span>
      );
    case 'independently_verified':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Verified Fact
        </span>
      );
    default:
      return null;
  }
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700">
          ✓ Verified
        </span>
      );
    case 'in_review':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-700">
          ⏳ In Review
        </span>
      );
    case 'disputed':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-950/90 text-rose-300 border border-rose-600 animate-pulse">
          ⚡ Disputed / Conflict
        </span>
      );
    case 'retracted':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700 line-through">
          Retracted
        </span>
      );
    case 'unverified':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-800">
          ⚠️ Unverified
        </span>
      );
  }
}
