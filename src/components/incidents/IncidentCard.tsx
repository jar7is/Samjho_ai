import React from 'react';
import Link from 'next/link';
import { Incident } from '@/types/incident';
import { IncidentStatusBadge, SeverityBadge } from './StatusBadge';
import { formatIncidentTime } from '@/lib/format-time';
import {
  MapPin,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  GitMerge,
  ArrowRight,
  ShieldCheck,
  Clock,
  User,
} from 'lucide-react';

export function IncidentCard({ incident }: { incident: Incident }) {
  const unresolvedConflicts = incident.contradictions.filter(
    (c) => c.resolutionStatus !== 'resolved'
  ).length;

  const pendingActions = incident.suggestedActions.filter(
    (a) => a.approvalStatus === 'PENDING'
  ).length;

  const criticalGaps = incident.missingInfo.filter(
    (m) => m.status === 'pending' && m.criticality === 'CRITICAL'
  ).length;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 hover:border-zinc-700 hover:bg-zinc-900/90 transition-all flex flex-col justify-between group shadow-sm">
      <div className="space-y-3">
        {/* Top header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-400">
              {incident.id}
            </span>
            <IncidentStatusBadge status={incident.status} />
            <SeverityBadge severity={incident.severity} />
          </div>

          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            {formatIncidentTime(incident.reportedAt)}
          </span>
        </div>

        {/* Title & Summary */}
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
            {incident.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {incident.summary}
          </p>
        </div>

        {/* Location & Assignee */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-300 pt-1">
          <div className="flex items-center gap-1 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate max-w-[240px]">{incident.location.name}</span>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>{incident.assignedTo || 'Unassigned'}</span>
          </div>
        </div>

        {/* Alert pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {unresolvedConflicts > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-700/80">
              <AlertTriangle className="w-3 h-3 text-rose-400 animate-pulse" />
              {unresolvedConflicts} Contradiction{unresolvedConflicts > 1 ? 's' : ''}
            </span>
          )}

          {criticalGaps > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/80">
              <HelpCircle className="w-3 h-3 text-amber-400" />
              {criticalGaps} Critical Unknown
            </span>
          )}

          {incident.duplicateCandidates && incident.duplicateCandidates.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/80">
              <GitMerge className="w-3 h-3 text-indigo-400" />
              Duplicate Flagged
            </span>
          )}

          {pendingActions > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-700/80">
              <Sparkles className="w-3 h-3 text-sky-400" />
              {pendingActions} Action{pendingActions > 1 ? 's' : ''} Pending
            </span>
          )}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-mono text-[11px]">
          {incident.claims.length} claims • {incident.evidence.length} reports
        </span>

        <Link
          href={`/incidents/${incident.id}`}
          className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          Review Evidence
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
