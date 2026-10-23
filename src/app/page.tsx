'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileCheck,
  SplitSquareVertical,
  History,
  AlertTriangle,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Compact, purposeful Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            DISASTER INTELLIGENCE & EVIDENCE RECONCILIATION
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Samjho AI transforms chaotic disaster reports into{' '}
            <span className="text-amber-400">verified, evidence-linked incident cases</span>.
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
            During floods and severe emergencies, reports arrive scattered across voice memos, photos, and messages.
            Samjho AI cross-references claims, highlights contradictory coordinates, flags unconfirmed life-safety risks, and keeps human coordinators in control.
          </p>

          {/* Decision-Support Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200/90 flex items-start gap-2.5 max-w-2xl">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-100">Emergency Notice:</strong> Decision-support only. Samjho AI does not replace 911 or dispatch emergency services autonomously.
            </div>
          </div>

          {/* Two Clear Primary Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Report a Problem
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              Review Incidents
            </Link>
          </div>
        </div>
      </section>

      {/* Core Differentiation Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono">
          Core Evidence & Conflict Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/60">
                <SplitSquareVertical className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Contradiction Reconciliation</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Isolates conflicting locations (e.g. Bridge vs Overpass) side-by-side instead of averaging false coordinates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-800/60">
                <FileCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Evidence-Linked Traceability</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every extracted claim points directly to the exact source quote, photo timestamp, or audio transcription snippet.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/60">
                <History className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Human-Authorized Actions</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              AI suggests explainable next steps, but every response action requires human authorization and audit logging.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
