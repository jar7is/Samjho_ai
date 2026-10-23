'use client';

import React from 'react';
import { useReliefBridge } from '@/lib/store';
import { AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export function DemoBanner() {
  const { isDemoMode, toggleDemoMode, resetDemoData } = useReliefBridge();

  return (
    <div className="bg-amber-950/80 border-b border-amber-800/80 text-amber-200 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-amber-300">DECISION-SUPPORT NOTICE:</span>
          <span>
            Samjho AI is a human-in-the-loop coordination tool. It does <strong>not</strong> contact 911 or dispatch emergency services.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-700/80 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isDemoMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
              }`}
            />
            {isDemoMode ? 'SYNTHETIC DEMO MODE' : 'LIVE AI MODE'}
          </div>

          <button
            onClick={toggleDemoMode}
            className="text-xs underline hover:text-amber-100 transition-colors cursor-pointer"
            title="Toggle between Synthetic Demo and Live AI"
          >
            {isDemoMode ? 'Switch to Live Mode' : 'Switch to Demo Mode'}
          </button>

          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-800/60 text-amber-200 border border-amber-700/50 transition-colors cursor-pointer"
            title="Reset synthetic data to initial state"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}
