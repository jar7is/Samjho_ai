import React from 'react';
import { Evidence } from '@/types/incident';
import { formatIncidentTime } from '@/lib/format-time';
import { FileText, Mic, Image as ImageIcon, FileCheck, User } from 'lucide-react';

export function EvidenceCard({ evidence }: { evidence: Evidence }) {
  const getIcon = () => {
    switch (evidence.sourceType) {
      case 'audio':
        return <Mic className="w-4 h-4 text-rose-400" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'document':
        return <FileCheck className="w-4 h-4 text-purple-400" />;
      case 'text':
      default:
        return <FileText className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{evidence.title}</h4>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
              <span>{evidence.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-zinc-500" />
                {evidence.sender}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800 uppercase">
            {evidence.sourceType}
          </span>
          <span className="text-[10px] text-zinc-500">
            {formatIncidentTime(evidence.timestamp)}
          </span>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-300 font-mono leading-relaxed">
        {evidence.contentSnippet}
      </div>

      {evidence.mediaUrl && (
        <div className="mt-2.5 p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Attached Media File: {evidence.mediaUrl.split('/').pop()}</span>
          <span className="text-zinc-500 font-mono">Simulated Safe Preview</span>
        </div>
      )}
    </div>
  );
}
