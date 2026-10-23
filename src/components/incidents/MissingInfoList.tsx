import React from 'react';
import { MissingInfo } from '@/types/incident';
import { AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

export function MissingInfoList({ missingInfo }: { missingInfo: MissingInfo[] }) {
  if (missingInfo.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-center text-xs text-zinc-400">
        No critical information gaps currently flagged.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-400" />
            Missing Information & Verification Needs
          </h3>
          <p className="text-xs text-zinc-400">
            Critical unknowns identified by AI that require field confirmation before dispatch.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {missingInfo.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border transition-all ${
              item.status === 'clarified'
                ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400'
                : item.criticality === 'CRITICAL'
                ? 'bg-rose-950/20 border-rose-800/80 text-rose-200'
                : 'bg-amber-950/20 border-amber-800/70 text-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {item.status === 'clarified' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-semibold text-xs sm:text-sm text-white">
                  {item.item}
                </span>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  item.criticality === 'CRITICAL'
                    ? 'bg-rose-900/80 text-rose-200 border border-rose-600'
                    : 'bg-amber-900/80 text-amber-200 border border-amber-600'
                }`}
              >
                {item.criticality} GAP
              </span>
            </div>

            {/* Questions to confirm */}
            {item.suggestedQuestions.length > 0 && (
              <div className="mt-2.5 pl-6 space-y-1">
                <span className="text-[11px] font-medium text-zinc-400 block">
                  Questions to query field responders:
                </span>
                <ul className="list-disc list-outside text-xs text-zinc-300 space-y-0.5">
                  {item.suggestedQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.clarificationNote && (
              <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-800/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <strong>Clarified:</strong> {item.clarificationNote}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
