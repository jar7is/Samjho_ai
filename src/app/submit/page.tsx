'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReliefBridge } from '@/lib/store';
import { Incident, SourceType } from '@/types/incident';
import {
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Mic,
  MicOff,
  MapPin,
  FileAudio,
  ArrowRight,
  PlusCircle,
  FileText,
} from 'lucide-react';

export default function SubmitIncidentPage() {
  const router = useRouter();
  const { addIncident, currentUser, isDemoMode } = useReliefBridge();

  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [reportText, setReportText] = useState('');
  const [incidentType, setIncidentType] = useState<Incident['incidentType']>('FLASH_FLOOD');
  const [severity, setSeverity] = useState<Incident['severity']>('HIGH');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<SourceType>('text');

  // Real Web Speech API State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Preview & Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  // Check browser Web Speech API availability on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setReportText((prev) => {
              const base = prev.trim();
              return base ? `${base} ${currentTranscript.trim()}` : currentTranscript.trim();
            });
            setSpeechFeedback('Voice input received.');
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setSpeechFeedback('Microphone permission was denied. Please allow microphone access or type manually.');
          } else if (event.error === 'no-speech') {
            setSpeechFeedback('No speech detected. Please speak clearly into the microphone.');
          } else {
            setSpeechFeedback(`Speech recognition error: ${event.error}. Manual text fallback available.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    setSpeechFeedback(null);
    if (!speechSupported || !recognitionRef.current) {
      setSpeechFeedback(
        'Speech recognition is not natively supported in this browser. Please type your report or upload an audio note.'
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setSpeechFeedback('Listening... Speak your emergency report now.');
      } catch (err: any) {
        setIsListening(false);
        setSpeechFeedback('Could not start microphone. Please check permissions or type manually.');
      }
    }
  };

  // Quick Load Preset Flood Scenario
  const loadPresetFlood = () => {
    setTitle('Westside Creek Flash Flood & Trapped Minivan');
    setLocationName('Canyon Road near Mile Marker 8');
    setIncidentType('FLASH_FLOOD');
    setSeverity('CRITICAL');
    setReportText(
      'Water rushed down Canyon Road in less than 15 minutes following the storm burst. A red minivan is pinned against the guardrail with water reaching midway up the windows. A bystander on high ground believes a mother and child are waving from inside. Water is still rising rapidly.'
    );
    setUploadedFileName('canyon_flood_audio_dispatch.mp3');
    setUploadedFileType('audio');
    setPreviewReady(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB security limit.');
      return;
    }

    setUploadedFileName(file.name);
    if (file.type.startsWith('audio/')) {
      setUploadedFileType('audio');
    } else if (file.type.startsWith('image/')) {
      setUploadedFileType('image');
    } else if (file.type.includes('pdf')) {
      setUploadedFileType('document');
    } else {
      setUploadedFileType('text');
    }
  };

  const handleProcessPreview = () => {
    if (!reportText.trim()) return;
    if (!title.trim()) {
      setTitle(reportText.slice(0, 48) + '...');
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPreviewReady(true);
    }, 500);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    const finalTitle = title.trim() || 'Citizen Flood Intake Case';
    const newId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newIncident: Incident = {
      id: newId,
      title: finalTitle,
      incidentType,
      status: 'ACTION_REQUIRED',
      severity,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSynthetic: true,
      assignedTo: currentUser.name,
      location: {
        name: locationName.trim() || 'Sector Unspecified',
        isApproximate: true,
        landmarks: ['Reported via Citizen Web Intake'],
      },
      summary: reportText.trim(),
      evidence: [
        {
          id: `EVD-${Math.floor(100 + Math.random() * 900)}-1`,
          incidentId: newId,
          sourceType: uploadedFileType,
          title: uploadedFileName ? `Attachment: ${uploadedFileName}` : 'Citizen Intake Report',
          sender: currentUser.name,
          timestamp: new Date().toISOString(),
          contentSnippet: reportText.trim(),
          fileSizeBytes: 1420,
          mimeType: uploadedFileType === 'audio' ? 'audio/mp3' : 'text/plain',
          isSynthetic: true,
        },
      ],
      claims: [
        {
          id: `CLM-${Math.floor(100 + Math.random() * 900)}-1`,
          incidentId: newId,
          category: 'hazard',
          statement: `Severe flood runoff: ${reportText.slice(0, 100)}...`,
          origin: 'user_reported',
          verificationStatus: 'unverified',
          evidenceQuote: reportText.slice(0, 120),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `CLM-${Math.floor(100 + Math.random() * 900)}-2`,
          incidentId: newId,
          category: 'people_at_risk',
          statement: 'Possible trapped vehicle occupants requiring rapid field verification.',
          origin: 'ai_inferred',
          verificationStatus: 'in_review',
          evidenceQuote: reportText.slice(0, 80),
          updatedAt: new Date().toISOString(),
        },
      ],
      contradictions: [],
      missingInfo: [
        {
          id: `MIS-${Math.floor(100 + Math.random() * 900)}-1`,
          incidentId: newId,
          item: 'Visual Confirmation of Vehicle Occupants',
          criticality: 'CRITICAL',
          suggestedQuestions: [
            'Can on-scene observers visually verify headcount inside submerged vehicles?',
          ],
          status: 'pending',
        },
      ],
      suggestedActions: [
        {
          id: `ACT-${Math.floor(100 + Math.random() * 900)}-1`,
          incidentId: newId,
          actionText: 'Dispatch swift reconnaissance unit to check vehicle occupants at reported coordinates',
          reasoning: 'Rapid water accumulation presents immediate life safety risk if occupants are trapped.',
          priority: 'IMMEDIATE',
          approvalStatus: 'PENDING',
        },
      ],
      auditTrail: [
        {
          id: `AUD-${Math.floor(100 + Math.random() * 900)}-1`,
          incidentId: newId,
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          actionType: 'INCIDENT_CREATED',
          description: `Initial incident ingested via web portal. Mode: ${
            isDemoMode ? 'SYNTHETIC DEMO' : 'LIVE AI'
          }`,
        },
      ],
    };

    addIncident(newIncident);
    router.push(`/incidents/${newId}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Report an Emergency Incident
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Describe current conditions via speech or text. AI will extract and structure claims.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPresetFlood}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900/80 text-amber-200 border border-amber-700/80 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Load Sample Flood Report
        </button>
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-5">
        {/* Primary Intake Card with Microphone Control beside input */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Emergency Report Description <span className="text-rose-400">*</span>
            </label>

            {/* Clearly visible microphone control beside input */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              aria-label={isListening ? 'Stop voice recording' : 'Record voice report'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-950/60'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  Stop Voice
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  Dictate Report
                </>
              )}
            </button>
          </div>

          {/* Voice feedback / Speech recognition status */}
          {speechFeedback && (
            <div
              className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                isListening
                  ? 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
                  : 'bg-zinc-950 text-zinc-300 border border-zinc-800'
              }`}
            >
              {isListening && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />}
              <span>{speechFeedback}</span>
            </div>
          )}

          {/* Text Area */}
          <textarea
            required
            rows={4}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Type or dictate current water level, stranded vehicles, blocked roads, or people in danger..."
            className="w-full text-xs p-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />

          <span className="text-[11px] text-zinc-500 block">
            Speech recognition uses standard browser speech API. Manual typing is always supported.
          </span>
        </div>

        {/* Optional Context & Evidence Card */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3 shadow-sm">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Location & Optional Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Incident Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Westside Creek Flash Flood"
                className="w-full text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Location / Landmark
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Canyon Road near Mile Marker 8"
                className="w-full text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Classification</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as Incident['incidentType'])}
                className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 cursor-pointer"
              >
                <option value="FLASH_FLOOD">Flash Flood</option>
                <option value="FLOOD">Riverine Flood</option>
                <option value="LANDSLIDE">Mudslide / Landslide</option>
                <option value="INFRASTRUCTURE_FAILURE">Power / Substation Hazard</option>
                <option value="STRUCTURAL_COLLAPSE">Structural Collapse</option>
                <option value="MEDICAL_EMERGENCY">Medical / Shelter Need</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Urgency</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Incident['severity'])}
                className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 cursor-pointer"
              >
                <option value="CRITICAL">Critical (Life Safety Threat)</option>
                <option value="HIGH">High (Urgent Water Rise)</option>
                <option value="MEDIUM">Medium (Localized Flood)</option>
                <option value="LOW">Low (Advisory)</option>
              </select>
            </div>
          </div>

          {/* Media upload */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Attach Supporting Photo or Audio (Optional)
            </label>
            <div className="relative border border-dashed border-zinc-700 rounded-lg p-3 text-center bg-zinc-950/60 hover:border-zinc-500 transition-colors">
              <input
                type="file"
                accept=".txt,.jpg,.jpeg,.png,.webp,.mp3,.wav,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-xs text-zinc-300">
                {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Drop photo or audio file here (Max 10MB)'}
              </span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={handleProcessPreview}
              disabled={isProcessing || !reportText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 disabled:opacity-50 text-xs font-bold shadow transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isProcessing ? 'Analyzing Evidence...' : 'Extract & Preview Claims'}
            </button>
            <span className="text-[11px] font-mono text-zinc-500">
              {isDemoMode ? 'Synthetic Demonstration' : 'Gemini Extraction'}
            </span>
          </div>
        </div>

        {/* Extracted Details Review */}
        {previewReady && (
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-amber-600/70 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Extracted Claims Preview</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                VALIDATED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="font-semibold text-zinc-300 block">Extracted Claims:</span>
                <p className="text-zinc-300">
                  Rapid water rise exceeding vehicle axles on reported corridor. Possible trapped occupants.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="font-semibold text-rose-300 block">Critical Unknown:</span>
                <p className="text-zinc-300">
                  Visual confirmation of vehicle occupants unverified. Flagged for reconnaissance.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold shadow transition-all cursor-pointer"
              >
                Submit Incident Case
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
