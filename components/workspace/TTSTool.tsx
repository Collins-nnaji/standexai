"use client";

import { useState, useRef } from "react";
import { Play, Download, Loader2, Volume2, X, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ConsoleThemeMode, CONSOLE_THEMES } from "@/components/console/console-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  const [filename, setFilename] = useState("speech-synthesis");

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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const cleanName = filename.trim().replace(/[^a-z0-9]/gi, "-").toLowerCase() || "speech";
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${cleanName}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 border shadow-xl",
        t.borderSub,
        t.s2,
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-teal)]/[0.12] text-[var(--brand-teal)]",
            )}
          >
            <Volume2 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className={cn("text-base font-semibold", t.text)}>Speech</CardTitle>
            <CardDescription className={cn("text-xs", t.muted2)}>Turn your draft into MP3 audio</CardDescription>
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" className={cn("h-8 w-8 shrink-0", t.muted)} onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className={cn("text-xs font-medium", t.muted2)}>Voice</Label>
          <ToggleGroup
            type="single"
            value={voice}
            onValueChange={(v) => {
              if (v) setVoice(v);
            }}
            variant="outline"
            size="sm"
            className={cn(
              "grid w-full grid-cols-2 gap-2 rounded-lg border p-1 sm:grid-cols-3",
              t.borderSub,
              themeMode === "dark" ? "bg-white/[0.02]" : "bg-zinc-50/80",
            )}
          >
            {VOICES.map((v) => (
              <ToggleGroupItem
                key={v.id}
                value={v.id}
                className={cn(
                  "h-auto min-h-[3.25rem] flex-col items-start gap-0.5 border-0 px-2 py-2 text-left shadow-none data-[state=on]:bg-[var(--brand-teal)]/10 data-[state=on]:text-[var(--brand-teal)]",
                  t.text,
                )}
              >
                <span className="text-[11px] font-semibold">{v.label}</span>
                <span className={cn("text-[9px] font-normal leading-tight opacity-80", t.muted2)}>{v.desc}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tts-filename" className={cn("text-xs font-medium", t.muted2)}>
            File name
          </Label>
          <div className="relative">
            <Input
              id="tts-filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="speech-synthesis"
              className={cn("h-10 pr-14 text-[13px]", t.input)}
            />
            <span className={cn("pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium opacity-40", t.text)}>
              .mp3
            </span>
          </div>
        </div>

        {error ? (
          <div className={cn("flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] p-2.5 text-xs", t.danger)}>
            <VolumeX className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        ) : null}

        <Separator className={themeMode === "dark" ? "bg-white/10" : "bg-zinc-200"} />

        {!audioUrl ? (
          <Button
            type="button"
            className="w-full gap-2 border-0 bg-[var(--brand-teal)] text-[#0C0C0B] shadow-none hover:brightness-105"
            onClick={() => void generateTTS()}
            disabled={loading || !text.trim()}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {loading ? "Synthesizing…" : "Generate audio"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className={cn("rounded-lg border p-2", t.borderSub, t.s1)}>
              <audio ref={audioRef} src={audioUrl} className="h-8 w-full" controls autoPlay />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className={cn("flex-1 gap-2 shadow-none", t.borderSub, t.text)}
                onClick={() => void generateTTS()}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Volume2 className="h-3.5 w-3.5" />}
                Regenerate
              </Button>
              <Button
                type="button"
                className="flex-1 gap-2 border-0 bg-[var(--brand-teal)] text-[#0C0C0B] shadow-none hover:brightness-105"
                onClick={downloadAudio}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          </div>
        )}

        <p className={cn("text-center text-[10px] leading-relaxed", t.muted2)}>
          OpenAI <code className={cn("rounded px-1", t.s2)}>tts-1</code> via Azure. Audio is not stored on the server.
        </p>
      </CardContent>
    </Card>
  );
}
