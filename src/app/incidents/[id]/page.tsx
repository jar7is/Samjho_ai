'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useReliefBridge } from '@/lib/store';
import { DEMO_USERS } from '@/lib/demo-data';
import { IncidentStatus } from '@/types/incident';
import { IncidentStatusBadge, SeverityBadge } from '@/components/incidents/StatusBadge';
import { ConflictAlert } from '@/components/incidents/ConflictAlert';
import { ClaimsReviewList } from '@/components/incidents/ClaimsReviewList';
import { MissingInfoList } from '@/components/incidents/MissingInfoList';
import { ActionApprovalList } from '@/components/incidents/ActionApprovalList';
import { EvidenceCard } from '@/components/incidents/EvidenceCard';
import { AuditTimeline } from '@/components/incidents/AuditTimeline';
import { DuplicateMergeModal } from '@/components/incidents/DuplicateMergeModal';
import { formatIncidentTime } from '@/lib/format-time';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  FileText,
  History,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

function IncidentDetailsContent() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const { getIncident, updateIncidentStatus, assignIncident } = useReliefBridge();
  const [activeTab, setActiveTab] = useState<
    'claims' | 'evidence' | 'missing' | 'actions' | 'audit'
  >('claims');

  const incident = getIncident(id);

  if (!incident) {
    return (
      <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h2 className="text-xl font-bold text-white">Incident Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested incident ID &ldquo;{id}&rdquo; does not exist in the active case database.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const unresolvedConflicts = incident.contradictions.filter(
    (c) => c.resolutionStatus !== 'resolved'
  );

  return (
    <div className="space-y-5 pb-20">
      {/* Top Breadcrumb & Status Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incident Dashboard
        </Link>

        {/* Status transition dropdown & Assignee */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400 font-medium">Status:</span>
            <select
              value={incident.status}
              onChange={(e) =>
                updateIncidentStatus(
                  incident.id,
                  e.target.value as IncidentStatus,
                  'Status manually updated from case workspace'
                )
              }
              className="py-1 px-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="NEW">New Intake</option>
              <option value="TRIAGED">Triaged</option>
              <option value="ACTION_REQUIRED">Action Required</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed / Merged</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400 font-medium">Assignee:</span>
            <select
              value={incident.assignedTo || ''}
              onChange={(e) => assignIncident(incident.id, e.target.value)}
              className="py-1 px-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="">Unassigned</option>
              {DEMO_USERS.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Scannable Incident Case Header */}
      <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
              {incident.id}
            </span>
            <IncidentStatusBadge status={incident.status} />
            <SeverityBadge severity={incident.severity} />
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {incident.incidentType.replace('_', ' ')}
            </span>
          </div>

          <div className="text-xs text-zinc-400 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            Reported: {formatIncidentTime(incident.reportedAt)}
          </div>
        </div>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {incident.title}
          </h1>
          <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
            {incident.summary}
          </p>
        </div>

        {/* Location & Landmark Indicators */}
        <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-200">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold">{incident.location.name}</span>
            {incident.location.isApproximate && (
              <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-900/50">
                APPROXIMATE
              </span>
            )}
          </div>

          {incident.location.landmarks && incident.location.landmarks.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-zinc-400">
              <span className="text-[11px] text-zinc-500">Landmarks:</span>
              {incident.location.landmarks.map((landmark, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800 text-[10px]"
                >
                  {landmark}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compact Alert Strip: Conflicting reports and duplicates without overwhelming the page */}
      {(unresolvedConflicts.length > 0 || (incident.duplicateCandidates && incident.duplicateCandidates.length > 0)) && (
        <div className="space-y-2.5">
          {incident.duplicateCandidates && incident.duplicateCandidates.length > 0 && (
            <div className="space-y-2">
              {incident.duplicateCandidates.map((cand) => (
                <DuplicateMergeModal
                  key={cand.candidateIncidentId}
                  primaryIncidentId={incident.id}
                  candidate={cand}
                />
              ))}
            </div>
          )}

          {unresolvedConflicts.length > 0 && (
            <div className="space-y-2">
              {unresolvedConflicts.map((con) => (
                <ConflictAlert key={con.id} incidentId={incident.id} contradiction={con} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Case Management Tabs */}
      <div className="border-b border-zinc-800">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('claims')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'claims'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Claims Review ({incident.claims.length})
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Raw Evidence ({incident.evidence.length})
          </button>

          <button
            onClick={() => setActiveTab('missing')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'missing'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Missing Info ({incident.missingInfo.length})
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'actions'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Suggested Actions ({incident.suggestedActions.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-4 h-4" />
            Audit History ({incident.auditTrail.length})
          </button>
        </nav>
      </div>

      {/* Tab Content Panes */}
      <div className="pt-1">
        {activeTab === 'claims' && (
          <ClaimsReviewList
            incidentId={incident.id}
            claims={incident.claims}
            evidenceList={incident.evidence}
          />
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-400">
              Original multi-modal inputs from callers, photos, and SMS messages.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {incident.evidence.map((ev) => (
                <EvidenceCard key={ev.id} evidence={ev} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'missing' && (
          <MissingInfoList missingInfo={incident.missingInfo} />
        )}

        {activeTab === 'actions' && (
          <ActionApprovalList
            incidentId={incident.id}
            actions={incident.suggestedActions}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTimeline auditTrail={incident.auditTrail} />
        )}
      </div>
    </div>
  );
}

export default function IncidentDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-zinc-400 font-mono">
          Loading Incident Workspace...
        </div>
      }
    >
      <IncidentDetailsContent />
    </Suspense>
  );
}
