'use client';

import React from 'react';
import { useReliefBridge } from '@/lib/store';
import {
  Settings,
  Shield,
  Trash2,
  RefreshCw,
  Cpu,
  Lock,
  Database,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { isDemoMode, toggleDemoMode, resetDemoData, incidents } = useReliefBridge();

  const handleClearLocalStorage = () => {
    if (confirm('Are you sure you want to purge local case cache and reset data?')) {
      resetDemoData();
      alert('Local incident data has been reset to default synthetic state.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System Settings & Privacy Controls
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure demo parameters, audit privacy boundaries, and inspect zero-cost limits.
        </p>
      </div>

      {/* Mode & Engine Controls */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">AI Engine & Operation Mode</h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {isDemoMode ? 'SYNTHETIC DEMO' : 'LIVE GEMINI'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-semibold text-zinc-200">Execution Mode</div>
            <p className="text-zinc-400 mt-0.5">
              Synthetic Demo mode uses local verifiable sample cases with zero API latency or rate limits.
            </p>
          </div>

          <button
            onClick={toggleDemoMode}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors shrink-0 cursor-pointer"
          >
            {isDemoMode ? 'Enable Live Gemini Mode' : 'Switch to Synthetic Demo'}
          </button>
        </div>
      </div>

      {/* Privacy & Ethical Safeguards */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Ethical & Privacy Controls</h2>
        </div>

        <div className="space-y-3 text-xs text-zinc-300">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="font-semibold text-white block">Synthetic Data Policy:</span>
            <p className="text-zinc-400">
              In adherence to competition security guidelines, no real victims&apos; personally identifiable information (PII) or active rescue coordinates are collected or stored for demonstration purposes.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="font-semibold text-white block">Decision Support Disclaimer:</span>
            <p className="text-zinc-400">
              Samjho AI enforces a mandatory human authorization gate. Automated dispatch commands to external emergency responders are explicitly forbidden without human approval.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management & Cache Reset */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Database className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-bold text-white">Local Storage & Cache Management</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-semibold text-zinc-200">Reset Case Data</div>
            <p className="text-zinc-400 mt-0.5">
              Purges all modified claims, actions, and audit events, restoring initial flood scenarios.
            </p>
          </div>

          <button
            onClick={handleClearLocalStorage}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 text-rose-200 border border-rose-700/80 font-semibold transition-colors shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            Reset All Cases
          </button>
        </div>
      </div>
    </div>
  );
}
