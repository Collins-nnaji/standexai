"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, FileText, Mic, Moon, Sun, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpeakingCoachCore } from "@/components/workspace/SpeakingCoachCore";
import { WritingLabCore } from "@/components/workspace/WritingLabCore";
import {
  CONSOLE_THEMES,
  THEME_STORAGE_KEY,
  type ConsoleThemeMode,
} from "@/components/console/console-theme";

type DraftRow = {
  id: string;
  title: string;
  source: string;
  riskLevel: string | null;
  overallScore: number | null;
};

const PROFILES = ["Marketing standard", "Legal & compliance", "Sales deck"] as const;

/**
 * Single platform shell: Workspace (writing analysis) + Voice coach (speaking feedback) + theme.
 * Legacy `/writing-lab` redirects here.
 */
export function ConsoleWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [themeMode, setThemeMode] = useState<ConsoleThemeMode>("dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<string>(PROFILES[0]);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);

  const tab = (searchParams.get("tab") as "lab" | "voice" | null) || "lab";

  const t = CONSOLE_THEMES[themeMode];

  useEffect(() => {
    const s = localStorage.getItem(THEME_STORAGE_KEY) as ConsoleThemeMode | null;
    if (s === "light" || s === "dark") setThemeMode(s);
  }, []);

  const persistTheme = (m: ConsoleThemeMode) => {
    setThemeMode(m);
    localStorage.setItem(THEME_STORAGE_KEY, m);
  };

  const loadDrafts = useCallback(async () => {
    try {
      const res = await fetch("/api/console", { cache: "no-store" });
      const data = (await res.json()) as {
        communication?: {
          recent?: Array<{
            id: string;
            title: string;
            source: string;
            riskLevel: string | null;
            overallScore: number | null;
          }>;
        };
      };
      const recent = data.communication?.recent ?? [];
      setDrafts(
        recent.map((r) => ({
          id: r.id,
          title: r.title,
          source: r.source,
          riskLevel: r.riskLevel,
          overallScore: r.overallScore,
        })),
      );
    } catch {
      setDrafts([]);
    }
  }, []);

  useEffect(() => {
    void loadDrafts();
  }, [loadDrafts]);

  /** Keep URL aligned when legacy links use `?voice=1` without `tab=voice`. */
  useEffect(() => {
    if (searchParams.get("voice") === "1" && searchParams.get("tab") !== "voice") {
      const q = new URLSearchParams(searchParams.toString());
      q.set("tab", "voice");
      router.replace(`/console?${q.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const setTab = (next: "lab" | "voice") => {
    const q = new URLSearchParams(searchParams.toString());
    q.set("tab", next);
    if (next === "voice") q.set("voice", "1");
    else q.delete("voice");
    router.replace(`/console?${q.toString()}`, { scroll: false });
  };

  return (
    <div
      className={cn(
        "flex h-[100dvh] flex-col overflow-hidden [font-family:var(--font-landing-sans),sans-serif] text-[13px] leading-normal antialiased",
        t.shell,
        t.scrollbar,
      )}
    >
      <header
        className={cn(
          "flex h-11 shrink-0 items-center gap-3 border-b px-4 lg:px-5",
          t.topbar,
          t.border,
        )}
      >
        <Link href="/" className="mr-2 flex shrink-0 items-center">
          <Image
            src="/standexailogo.png"
            alt="StandexAI"
            width={120}
            height={32}
            className={cn("h-7 w-auto object-contain", t.logoInvert)}
            priority
          />
        </Link>

        <nav className="flex h-full items-stretch gap-0">
          <button
            type="button"
            onClick={() => setTab("lab")}
            className={cn(
              "flex items-center gap-1.5 border-b-[1.5px] px-3.5 text-[12px] font-medium transition-colors",
              tab === "lab" ? t.tabActive : cn(t.tabIdle, "border-transparent"),
            )}
          >
            <FileText className="h-3.5 w-3.5 opacity-70" strokeWidth={1.8} />
            Workspace
          </button>
          <button
            type="button"
            onClick={() => setTab("voice")}
            className={cn(
              "flex items-center gap-1.5 border-b-[1.5px] px-3.5 text-[12px] font-medium transition-colors",
              tab === "voice" ? t.tabActive : cn(t.tabIdle, "border-transparent"),
            )}
          >
            <Mic className="h-3.5 w-3.5 opacity-70" strokeWidth={1.8} />
            Voice coach
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => persistTheme(themeMode === "dark" ? "light" : "dark")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded border transition-colors",
              t.borderSub,
              t.muted,
              t.navHover,
            )}
            title={themeMode === "dark" ? "Light background" : "Dark background"}
          >
            {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
                t.borderSub,
                t.muted,
              )}
            >
              <ChevronDown className="h-3 w-3" />
              {activeProfile}
            </button>
            {profileOpen && (
              <div
                className={cn(
                  "absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded border py-1 shadow-lg",
                  t.s1,
                  t.border,
                )}
              >
                {PROFILES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={cn("block w-full px-3 py-2 text-left text-[12px]", t.muted, t.navHover)}
                    onClick={() => {
                      setActiveProfile(p);
                      setProfileOpen(false);
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[200px_1fr]">
        <aside className={cn("flex min-h-0 flex-col border-r", t.border, t.s1)}>
          <div className={cn("shrink-0 border-b p-3", t.border)}>
            <p className={cn("mb-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Recent analyses</p>
            {drafts.length === 0 ? (
              <p className={cn("text-[11px]", t.muted)}>Run an analysis to see history</p>
            ) : (
              drafts.map((d) => (
                <div
                  key={d.id}
                  className={cn("flex items-center gap-2 rounded px-2 py-1.5 text-[12px]", t.muted)}
                >
                  <FileText className="h-3 w-3 shrink-0 opacity-60" />
                  <span className="min-w-0 flex-1 truncate">{d.title}</span>
                  <span className="text-[10px] font-bold opacity-70">{d.overallScore ?? "—"}</span>
                </div>
              ))
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto py-2">
            <p className={cn("px-3 pb-1 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Profiles</p>
            {PROFILES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setActiveProfile(p)}
                className={cn(
                  "flex w-full items-center gap-2 border-l-2 border-transparent px-3 py-2 text-left text-[12px] transition-colors",
                  activeProfile === p ? t.navActive : cn(t.muted, t.navHover),
                )}
              >
                <User className="h-3 w-3 shrink-0 opacity-60" />
                <span className="truncate">{p}</span>
              </button>
            ))}
          </div>
        </aside>

        <div
          className={cn(
            "min-h-0 min-w-0",
            themeMode === "dark" ? "bg-[#0C0C0B]" : "bg-[#F5F3EF]",
          )}
        >
          <div className="flex h-full min-h-0 flex-col">
            {tab === "voice" ? (
              <SpeakingCoachCore themeMode={themeMode} />
            ) : (
              <WritingLabCore themeMode={themeMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
