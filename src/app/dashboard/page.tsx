'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useReliefBridge } from '@/lib/store';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import { IncidentStatus, SeverityLevel } from '@/types/incident';
import {
  Search,
  Filter,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  PlusCircle,
  RefreshCw,
  GitMerge,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const { incidents, resetDemoData, isDemoMode } = useReliefBridge();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [onlyConflicts, setOnlyConflicts] = useState<boolean>(false);
  const [onlyPendingActions, setOnlyPendingActions] = useState<boolean>(false);

  // Filter computation
  const filteredIncidents = incidents.filter((incident) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = incident.title.toLowerCase().includes(q);
      const matchId = incident.id.toLowerCase().includes(q);
      const matchLoc = incident.location.name.toLowerCase().includes(q);
      const matchSum = incident.summary.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchLoc && !matchSum) return false;
    }

    // Status
    if (statusFilter !== 'ALL' && incident.status !== statusFilter) {
      return false;
    }

    // Severity
    if (severityFilter !== 'ALL' && incident.severity !== severityFilter) {
      return false;
    }

    // Contradictions filter
    if (onlyConflicts) {
      const hasUnresolved = incident.contradictions.some(
        (c) => c.resolutionStatus !== 'resolved'
      );
      if (!hasUnresolved) return false;
    }

    // Pending actions filter
    if (onlyPendingActions) {
      const hasPending = incident.suggestedActions.some(
        (a) => a.approvalStatus === 'PENDING'
      );
      if (!hasPending) return false;
    }

    return true;
  });

  // Aggregate stats
  const totalIncidents = incidents.length;
  const totalUnresolvedConflicts = incidents.reduce(
    (acc, inc) =>
      acc + inc.contradictions.filter((c) => c.resolutionStatus !== 'resolved').length,
    0
  );
  const totalCriticalGaps = incidents.reduce(
    (acc, inc) =>
      acc +
      inc.missingInfo.filter(
        (m) => m.status === 'pending' && m.criticality === 'CRITICAL'
      ).length,
    0
  );
  const totalPendingActions = incidents.reduce(
    (acc, inc) =>
      acc + inc.suggestedActions.filter((a) => a.approvalStatus === 'PENDING').length,
    0
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Emergency Operations Dashboard
            </h1>
            {isDemoMode && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                SYNTHETIC DEMO
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time reconciliation feed for flood and severe weather incident cases.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium transition-colors cursor-pointer"
            title="Reset synthetic data to default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data
          </button>

          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold shadow transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            New Report Intake
          </Link>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
              Active Cases
            </span>
            <span className="text-2xl font-bold text-white mt-0.5 block">
              {totalIncidents}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setOnlyConflicts(!onlyConflicts)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            onlyConflicts
              ? 'bg-rose-950/40 border-rose-600'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                Contradictions
              </span>
              <span className="text-2xl font-bold text-rose-400 mt-0.5 block">
                {totalUnresolvedConflicts}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1 text-[10px] text-zinc-500">
            {onlyConflicts ? '✓ Filtering by conflicts' : 'Click to filter'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
              Critical Unknowns
            </span>
            <span className="text-2xl font-bold text-amber-400 mt-0.5 block">
              {totalCriticalGaps}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setOnlyPendingActions(!onlyPendingActions)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            onlyPendingActions
              ? 'bg-sky-950/40 border-sky-600'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                Pending Actions
              </span>
              <span className="text-2xl font-bold text-sky-400 mt-0.5 block">
                {totalPendingActions}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-800/80 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-1 text-[10px] text-zinc-500">
            {onlyPendingActions ? '✓ Filtering pending actions' : 'Click to filter'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, location, or summary..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTION_REQUIRED">Action Required</option>
              <option value="NEW">New Intake</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="TRIAGED">Triaged</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed / Merged</option>
            </select>
          </div>

          {/* Severity filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80 text-xs">
          <span className="text-zinc-500 text-[11px] font-medium mr-1">Quick Filters:</span>

          <button
            onClick={() => setOnlyConflicts(!onlyConflicts)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              onlyConflicts
                ? 'bg-rose-950 text-rose-200 border border-rose-600'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            ⚡ Has Contradictions
          </button>

          <button
            onClick={() => setOnlyPendingActions(!onlyPendingActions)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              onlyPendingActions
                ? 'bg-sky-950 text-sky-200 border border-sky-600'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            📋 Needs Action Authorization
          </button>

          {(statusFilter !== 'ALL' ||
            severityFilter !== 'ALL' ||
            searchQuery ||
            onlyConflicts ||
            onlyPendingActions) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setSeverityFilter('ALL');
                setSearchQuery('');
                setOnlyConflicts(false);
                setOnlyPendingActions(false);
              }}
              className="text-xs text-amber-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Incidents Grid */}
      {filteredIncidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
          <p className="text-sm font-semibold text-zinc-300">
            No incidents matched your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setSeverityFilter('ALL');
              setSearchQuery('');
              setOnlyConflicts(false);
              setOnlyPendingActions(false);
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-medium hover:bg-zinc-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
