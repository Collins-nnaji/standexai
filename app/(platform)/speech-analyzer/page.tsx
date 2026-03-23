"use client";

import { useState, useRef } from "react";
import {
  Mic, Upload, FileText, Loader2, Sparkles, AlertTriangle,
  CheckCircle2, TrendingUp, Clock, Volume2, BarChart3, Zap
} from "lucide-react";

type SpeechResult = {
  confidenceScore: number;
  clarityScore: number;
  engagementScore: number;
  overallScore: number;
  fillerWords: Array<{ word: string; count: number }>;
  totalFillerCount: number;
  toneAnalysis: {
    primary: string;
    secondary: string | null;
    emotionalRange: string;
  };
  pacing: { assessment: string; suggestion: string };
  structure: { hasStrongOpening: boolean; hasStrongClosing: boolean; suggestion: string };
  suggestions: Array<{
    category: string;
    issue: string;
    suggestion: string;
    priority: string;
  }>;
  highlights: Array<{ text: string; reason: string }>;
  summary: string;
};

type InputMode = "paste" | "upload" | "record";

export default function SpeechAnalyzerPage() {
  const [inputMode, setInputMode] = useState<InputMode>("paste");
  const [transcript, setTranscript] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, type: "speech" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.result as SpeechResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        setTranscript(prev => prev + "\n[Audio recorded — paste your transcript here or use a transcription service]");
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone access denied. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const highlightFillers = (text: string, fillerWords: SpeechResult["fillerWords"]) => {
    if (!fillerWords?.length) return text;
    let highlighted = text;
    for (const f of fillerWords) {
      const regex = new RegExp(`\\b(${f.word})\\b`, "gi");
      highlighted = highlighted.replace(regex, '<span class="highlight-danger">$1</span>');
    }
    return highlighted;
  };

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-zinc-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 border border-violet-100">
              <Mic className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Speech Analyzer</h1>
              <p className="text-xs text-zinc-400">Analyze speeches for confidence, clarity, and engagement</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!transcript.trim() || analyzing}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 shadow-lg shadow-violet-600/20 disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {analyzing ? "Analyzing..." : "Analyze Speech"}
          </button>
        </div>
      </header>

      {/* Input Mode Tabs */}
      <div className="border-b border-zinc-100 bg-white px-6">
        <div className="flex gap-1">
          {[
            { id: "paste" as InputMode, label: "Paste Script", icon: FileText },
            { id: "upload" as InputMode, label: "Upload Audio", icon: Upload },
            { id: "record" as InputMode, label: "Record Live", icon: Mic },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setInputMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
                inputMode === tab.id
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Transcript */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-zinc-100">
          <div className="flex-1 overflow-auto p-6">
            {inputMode === "record" && (
              <div className="mb-4 flex items-center gap-3">
                {recording ? (
                  <button onClick={stopRecording} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white animate-pulse">
                    <div className="h-3 w-3 rounded-full bg-white" />
                    Stop Recording
                  </button>
                ) : (
                  <button onClick={startRecording} className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700">
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </button>
                )}
                {recording && <span className="text-xs text-red-500 font-semibold">Recording...</span>}
              </div>
            )}

            {inputMode === "upload" && (
              <div className="mb-4 flex items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-10">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-zinc-500 mb-1">Upload audio or video file</p>
                  <p className="text-xs text-zinc-400 mb-3">Paste the transcript below after uploading</p>
                  <label className="cursor-pointer rounded-lg bg-violet-50 border border-violet-100 px-4 py-2 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition">
                    Choose File
                    <input type="file" accept="audio/*,video/*" className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {result ? (
              <div>
                <div className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Transcript (filler words highlighted)</div>
                <div
                  className="text-[15px] leading-[1.9] text-zinc-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightFillers(transcript, result.fillerWords) }}
                />
              </div>
            ) : (
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your speech script or transcript here...&#10;&#10;Example: &quot;Good morning everyone. So, um, today I want to talk about, you know, the future of our company. I think, uh, we have some really exciting opportunities ahead of us...&quot;"
                className="w-full h-full min-h-[400px] bg-transparent text-[15px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none resize-none"
              />
            )}
          </div>

          <div className="border-t border-zinc-50 bg-zinc-50/50 px-6 py-3 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {transcript.trim() ? `${transcript.trim().split(/\s+/).length} words` : "No transcript entered"}
            </span>
            {result && (
              <button onClick={() => setResult(null)} className="text-xs font-semibold text-zinc-500 hover:text-zinc-700">
                Edit Transcript
              </button>
            )}
          </div>
        </div>

        {/* Right: Insights */}
        <div className="w-[420px] shrink-0 overflow-auto bg-white p-6 space-y-6">
          {analyzing && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              <p className="text-sm font-semibold text-zinc-700 animate-pulse">Analyzing speech patterns...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          {!result && !analyzing && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center">
                <Mic className="h-8 w-8 text-zinc-300" />
              </div>
              <p className="text-sm font-semibold text-zinc-500">Paste a speech and click Analyze</p>
              <p className="text-xs text-zinc-400">Speech insights will appear here</p>
            </div>
          )}

          {result && (
            <>
              {/* Scores */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Confidence", score: result.confidenceScore },
                  { label: "Clarity", score: result.clarityScore },
                  { label: "Engagement", score: result.engagementScore },
                  { label: "Overall", score: result.overallScore },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">{s.label}</span>
                      <span className={`text-lg font-bold ${getScoreColor(s.score)}`}>{s.score}</span>
                    </div>
                    <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getScoreBarColor(s.score)} transition-all duration-700`} style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Filler Words */}
              <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Filler Words
                  </h3>
                  <span className="text-sm font-bold text-red-600">{result.totalFillerCount} total</span>
                </div>
                {result.fillerWords?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {result.fillerWords.map((f, i) => (
                      <span key={i} className="rounded-lg bg-white border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">
                        &ldquo;{f.word}&rdquo; &times; {f.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tone Analysis */}
              <div className="rounded-xl border border-zinc-100 p-4">
                <h3 className="text-xs font-semibold text-zinc-500 mb-3 flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5" />
                  Tone Analysis
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-zinc-500">Primary Tone</span>
                    <span className="text-xs font-semibold text-zinc-800 capitalize">{result.toneAnalysis?.primary}</span>
                  </div>
                  {result.toneAnalysis?.secondary && (
                    <div className="flex justify-between">
                      <span className="text-xs text-zinc-500">Secondary</span>
                      <span className="text-xs font-semibold text-zinc-800 capitalize">{result.toneAnalysis.secondary}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-xs text-zinc-500">Emotional Range</span>
                    <span className="text-xs font-semibold text-zinc-800 capitalize">{result.toneAnalysis?.emotionalRange}</span>
                  </div>
                </div>
              </div>

              {/* Pacing & Structure */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-100 p-4">
                  <h4 className="text-[10px] font-semibold text-zinc-400 uppercase mb-2">Pacing</h4>
                  <p className="text-xs font-semibold text-zinc-800 capitalize mb-1">{result.pacing?.assessment?.replace("_", " ")}</p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{result.pacing?.suggestion}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 p-4">
                  <h4 className="text-[10px] font-semibold text-zinc-400 uppercase mb-2">Structure</h4>
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      {result.structure?.hasStrongOpening ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                      <span className="text-[11px] text-zinc-600">Opening</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {result.structure?.hasStrongClosing ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                      <span className="text-[11px] text-zinc-600">Closing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-violet-500" />
                    Coaching Suggestions
                  </h3>
                  <div className="space-y-2">
                    {[...result.suggestions]
                      .sort((a, b) => (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2) - (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2))
                      .map((s, i) => (
                        <div key={i} className={`rounded-xl border p-3 ${
                          s.priority === "high" ? "border-red-100 bg-red-50" :
                          s.priority === "medium" ? "border-amber-100 bg-amber-50" :
                          "border-zinc-100 bg-zinc-50"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-semibold uppercase ${
                              s.priority === "high" ? "text-red-500" :
                              s.priority === "medium" ? "text-amber-500" :
                              "text-zinc-400"
                            }`}>{s.priority}</span>
                            <span className="text-[10px] text-zinc-400">&middot;</span>
                            <span className="text-[10px] text-zinc-400 capitalize">{s.category?.replace("_", " ")}</span>
                          </div>
                          <p className="text-xs font-semibold text-zinc-800 mb-1">{s.issue}</p>
                          <p className="text-[11px] text-zinc-600">{s.suggestion}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Strong Moments */}
              {result.highlights?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Strong Moments
                  </h3>
                  <div className="space-y-2">
                    {result.highlights.map((h, i) => (
                      <div key={i} className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                        <p className="text-xs font-semibold text-emerald-800 mb-1">&ldquo;{h.text}&rdquo;</p>
                        <p className="text-[11px] text-emerald-600">{h.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="rounded-xl bg-violet-50 border border-violet-100 p-4">
                <h3 className="text-xs font-semibold text-violet-700 mb-2">Overall Assessment</h3>
                <p className="text-sm text-violet-800 leading-relaxed">{result.summary}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
