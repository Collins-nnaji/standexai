"use client";

import { useState, useRef } from "react";
import { 
  Play, 
  Download, 
  Loader2, 
  Volume2, 
  X,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ConsoleThemeMode, CONSOLE_THEMES } from "@/components/console/console-theme";

interface TTSToolProps {
  text: string;
  themeMode: ConsoleThemeMode;
  onClose: () => void;
}

const VOICES = [
  { id: "alloy", label: "Alloy", desc: "Neutral and balanced" },
  { id: "echo", label: "Echo", desc: "Confidence and warmth" },
  { id: "fable", label: "Fable", desc: "British, narrative" },
  { id: "onyx", label: "Onyx", desc: "Deep and authoritative" },
  { id: "nova", label: "Nova", desc: "Energetic and professional" },
  { id: "shimmer", label: "Shimmer", desc: "Clear and expressive" },
];

export function TTSTool({ text, themeMode, onClose }: TTSToolProps) {
  const t = CONSOLE_THEMES[themeMode];
  const [voice, setVoice] = useState("alloy");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateTTS = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate speech");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sounting went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `speech-${voice}-${new Date().getTime()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={cn(
      "flex flex-col gap-4 rounded-xl border p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2",
      t.workspaceSurface,
      t.borderSub
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-teal)]/[0.1] text-[var(--brand-teal)]")}>
            <Volume2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className={cn("text-sm font-semibold", t.text)}>Speech Synthesis</h3>
            <p className={cn("text-[11px]", t.muted2)}>Convert your draft to high-quality audio</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className={cn("rounded-md p-1 transition-colors", t.muted, t.navHover)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {VOICES.map((v) => (
          <button
            key={v.id}
            onClick={() => setVoice(v.id)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border p-2 text-left transition-all",
              voice === v.id
                ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/[0.05] ring-1 ring-[var(--brand-teal)]"
                : cn(t.borderSub, "hover:border-[var(--brand-teal)]/50", t.s1)
            )}
          >
            <span className={cn("text-[11px] font-bold", voice === v.id ? "text-[var(--brand-teal)]" : t.text)}>
              {v.label}
            </span>
            <span className={cn("text-[9px] leading-tight", t.muted2)}>
              {v.desc}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className={cn("flex items-center gap-2 rounded-lg bg-rose-500/[0.05] p-2 text-[11px]", t.danger)}>
          <VolumeX className="h-3.5 w-3.5" />
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {!audioUrl ? (
          <button
            onClick={generateTTS}
            disabled={loading || !text.trim()}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] py-2.5 text-xs font-bold text-[#0C0C0B] transition hover:brightness-105 disabled:opacity-50"
            )}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {loading ? "Synthesizing..." : "Generate Audio"}
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className={cn("flex items-center gap-2 rounded-lg border p-2", t.borderSub, t.s1)}>
              <audio 
                ref={audioRef}
                src={audioUrl} 
                className="h-8 flex-1" 
                controls 
                autoPlay
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={generateTTS}
                disabled={loading}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-xs font-semibold transition",
                  t.borderSub, t.text, t.navHover
                )}
              >
                <Volume2 className="h-3.5 w-3.5" />
                Regenerate
              </button>
              <button
                onClick={downloadAudio}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] py-2 text-xs font-bold text-[#0C0C0B] transition hover:brightness-105"
                )}
              >
                <Download className="h-3.5 w-3.5" />
                Download MP3
              </button>
            </div>
          </div>
        )}
      </div>

      <p className={cn("text-center text-[10px]", t.muted2)}>
        Standard OpenAI tts-1 model via Azure. MP3 is generated on-the-fly and not stored server-side.
      </p>
    </div>
  );
}
