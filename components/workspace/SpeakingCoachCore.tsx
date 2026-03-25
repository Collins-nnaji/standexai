"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Mic, RotateCcw, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CONSOLE_THEMES,
  type ConsoleThemeMode,
} from "@/components/console/console-theme";
import type { SpeechCoachResult } from "@/lib/speech-coach-llm";

type Props = {
  themeMode: ConsoleThemeMode;
};

export function SpeakingCoachCore({ themeMode }: Props) {
  const t = CONSOLE_THEMES[themeMode];
  const [transcript, setTranscript] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [coaching, setCoaching] = useState(false);
  const [result, setResult] = useState<SpeechCoachResult | null>(null);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transcribeBlob = useCallback(async (blob: Blob, filename = "recording.webm") => {
    setTranscribing(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", blob, filename);
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Transcription failed");
      setTranscript((data.text ?? "").trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed");
    } finally {
      setTranscribing(false);
    }
  }, []);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        void transcribeBlob(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const onAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    void transcribeBlob(f, f.name || "audio");
  };

  const runCoach = async () => {
    const text = transcript.trim();
    if (!text) return;
    setCoaching(true);
    setError("");
    try {
      const res = await fetch("/api/speech-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      const data = (await res.json()) as { result?: SpeechCoachResult; error?: string };
      if (!res.ok) throw new Error(data.error || "Coaching failed");
      if (!data.result) throw new Error("No coaching result");
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Coaching failed");
    } finally {
      setCoaching(false);
    }
  };

  const reset = () => {
    setTranscript("");
    setResult(null);
    setError("");
  };

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", t.shell)}>
      <header className={cn("shrink-0 border-b px-4 py-3 sm:px-5", t.border, t.s1)}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className={cn("text-base font-semibold tracking-tight sm:text-lg", t.text)}>Voice coach</h1>
            <p className={cn("mt-0.5 max-w-2xl text-[11px] leading-snug sm:text-xs", t.muted)}>
              Improve how you sound professionally — clarity, fillers, tone, and delivery. Complements{" "}
              <span className={cn("font-medium", t.text)}>Workspace</span>, which reviews your written copy.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className={cn(
              "mt-2 inline-flex shrink-0 items-center gap-1.5 self-start rounded border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide sm:mt-0",
              t.borderSub,
              t.muted,
              t.navHover,
            )}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="flex flex-col gap-4">
            <div className={cn("rounded-xl border p-4", t.border, t.s2)}>
              <p className={cn("mb-3 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Capture</p>
              {transcribing ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className={cn("h-9 w-9 animate-spin", t.info)} />
                  <p className={cn("text-sm font-medium", t.text)}>Transcribing…</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {!recording ? (
                    <button
                      type="button"
                      onClick={() => void startRecording()}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
                        themeMode === "dark"
                          ? "bg-violet-600 text-white hover:bg-violet-500"
                          : "bg-violet-600 text-white hover:bg-violet-700",
                      )}
                    >
                      <Mic className="h-4 w-4" />
                      Record
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition",
                        themeMode === "dark"
                          ? "border-rose-400/50 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                          : "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100",
                      )}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                      </span>
                      Stop &amp; transcribe
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition",
                      t.borderSub,
                      t.text,
                      t.navHover,
                    )}
                  >
                    <Upload className="h-4 w-4 opacity-70" />
                    Upload audio
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={onAudioFile}
                  />
                </div>
              )}
            </div>

            <div className={cn("flex flex-1 flex-col rounded-xl border", t.border, t.s2)}>
              <label htmlFor="coach-transcript" className={cn("border-b px-3 py-2 text-[10px] font-bold uppercase tracking-wider", t.border, t.muted2)}>
                Transcript (edit if needed)
              </label>
              <textarea
                id="coach-transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Record or upload audio, or paste what you said. Then run the coach for professional speaking feedback."
                className={cn(
                  "min-h-[200px] flex-1 resize-y bg-transparent p-3 text-[13px] leading-relaxed outline-none sm:min-h-[280px]",
                  t.text,
                  "placeholder:opacity-60",
                )}
              />
            </div>

            <button
              type="button"
              onClick={() => void runCoach()}
              disabled={!transcript.trim() || coaching}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:opacity-45",
                t.btnPrimary,
              )}
            >
              {coaching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 opacity-90" />}
              {coaching ? "Coaching…" : "Get coaching feedback"}
            </button>

            {error ? (
              <p className={cn("text-sm", t.danger)} role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className={cn("min-h-[200px] rounded-xl border lg:min-h-0", t.border, t.s2)}>
            {!result ? (
              <div className={cn("flex h-full min-h-[200px] flex-col items-center justify-center gap-2 p-6 text-center lg:min-h-[420px]", t.muted)}>
                <Sparkles className="h-8 w-8 opacity-30" />
                <p className="max-w-xs text-sm">Coaching appears here — delivery score, habits, and practice prompts.</p>
              </div>
            ) : (
              <div className={cn("space-y-4 p-4 sm:p-5", t.text)}>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className={cn("text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Delivery score</p>
                    <p className={cn("text-3xl font-bold tabular-nums [font-family:var(--font-console-mono),monospace]", t.text)}>
                      {typeof result.deliveryScore === "number" ? Math.round(result.deliveryScore) : "—"}
                    </p>
                  </div>
                </div>
                <p className={cn("text-sm leading-relaxed", t.muted)}>{result.overallSummary}</p>

                {result.strengths?.length ? (
                  <div>
                    <p className={cn("mb-1.5 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Strengths</p>
                    <ul className={cn("list-inside list-disc space-y-1 text-sm", t.muted)}>
                      {result.strengths.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {result.priorityImprovements?.length ? (
                  <div>
                    <p className={cn("mb-1.5 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Priority fixes</p>
                    <ol className={cn("list-inside list-decimal space-y-1.5 text-sm", t.muted)}>
                      {result.priorityImprovements.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {result.fillerAndHabits?.length ? (
                  <div>
                    <p className={cn("mb-1.5 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Fillers &amp; habits</p>
                    <ul className="space-y-2 text-sm">
                      {result.fillerAndHabits.map((f, i) => (
                        <li key={i} className={cn("rounded-lg border p-2.5", t.borderSub, t.s3)}>
                          <span className="font-semibold">{f.pattern}</span>
                          <span className={cn("block text-xs", t.muted)}>{f.note}</span>
                          <span className={cn("mt-1 block text-xs", t.info)}>{f.tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {result.professionalTone ? (
                  <div>
                    <p className={cn("mb-1.5 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Professional tone</p>
                    <p className={cn("text-sm", t.muted)}>{result.professionalTone.assessment}</p>
                    {result.professionalTone.tips?.length ? (
                      <ul className={cn("mt-2 list-inside list-disc space-y-1 text-sm", t.muted)}>
                        {result.professionalTone.tips.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                {result.practicePrompt ? (
                  <div className={cn("rounded-lg border p-3", t.borderSub, t.s3)}>
                    <p className={cn("mb-1 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Next take</p>
                    <p className={cn("text-sm leading-relaxed", t.text)}>{result.practicePrompt}</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
