"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Image as ImageIcon,
  Video as VideoIcon,
  Eye,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CONSOLE_THEMES,
  THEME_STORAGE_KEY,
  type ConsoleThemeMode,
} from "@/components/console/console-theme";
import { WorkspaceModeNav } from "@/components/platform/WorkspaceModeNav";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { ImageVideoCore } from "@/components/eval-lab/ImageVideoCore";

const HISTORY_SIDEBAR_KEY = "standex-eval-history-sidebar";

export function ImageVideoWorkspace() {
  const [themeMode, setThemeMode] = useState<ConsoleThemeMode>("light");
  const [historySidebarOpen, setHistorySidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"vision" | "pixel" | "motion">("vision");

  const t = CONSOLE_THEMES[themeMode];

  useEffect(() => {
    const s = localStorage.getItem(THEME_STORAGE_KEY) as ConsoleThemeMode | null;
    if (s === "light" || s === "dark") setThemeMode(s);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_SIDEBAR_KEY);
    if (raw === "0") setHistorySidebarOpen(false);
    if (raw === "1") setHistorySidebarOpen(true);
  }, []);

  const setHistoryOpen = (open: boolean) => {
    setHistorySidebarOpen(open);
    localStorage.setItem(HISTORY_SIDEBAR_KEY, open ? "1" : "0");
  };

  const persistTheme = (m: ConsoleThemeMode) => {
    setThemeMode(m);
    localStorage.setItem(THEME_STORAGE_KEY, m);
  };

  const tabs = [
    { id: "vision", name: "Vision Engine", icon: Eye },
    { id: "pixel", name: "Pixel Synthesis", icon: ImageIcon },
    { id: "motion", name: "Motion Studio", icon: VideoIcon },
  ] as const;

  return (
    <div
      className={cn(
        "relative flex h-[100dvh] flex-col overflow-hidden [font-family:var(--font-inter),ui-sans-serif,sans-serif] text-[14px] leading-snug antialiased",
        t.shell,
        t.scrollbar,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(237,235,228,0.04),transparent_55%)]",
          themeMode === "light" && "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(17,17,16,0.03),transparent_55%)]",
        )}
      />

      <header
        className={cn(
          "relative z-10 flex h-12 min-h-12 shrink-0 items-center gap-2 px-3 backdrop-blur-md sm:gap-3 sm:px-4 lg:gap-4 lg:px-6 border-b",
          t.workspaceSurface,
          themeMode === "dark" ? "border-white/[0.06]" : "border-zinc-200"
        )}
      >
        <WorkspaceModeNav active="eval-lab" consoleTheme={t} consoleThemeMode={themeMode} className="min-w-0" />

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          <Button variant="outline" size="icon" className={cn("h-8 w-8 shadow-none", t.borderSub, t.text)} asChild>
            <Link href="/r/me" title="My Profile">
              <User className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => persistTheme(themeMode === "dark" ? "light" : "dark")}
            className={cn("h-8 w-8 shadow-none", t.borderSub, t.text)}
            title={themeMode === "dark" ? "Light background" : "Dark background"}
          >
            {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
        {historySidebarOpen ? (
          <aside
            className={cn(
              "flex min-h-[40vh] min-w-0 flex-col lg:min-h-0 lg:w-[min(100%,280px)] lg:max-w-[280px] lg:shrink-0",
              t.railSurface,
              themeMode === "dark"
                ? "shadow-[6px_0_28px_-12px_rgba(0,0,0,0.65)]"
                : "shadow-[6px_0_28px_-14px_rgba(0,0,0,0.1)]",
            )}
          >
            <div className="shrink-0 px-3 py-2.5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className={cn("text-[13px] font-semibold tracking-tight", t.text)}>Media Lab</h2>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setHistoryOpen(false)}
                    className={cn("h-8 w-8", t.muted, t.navHover)}
                    title="Collapse sidebar"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </Button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <p className={cn("mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide", t.muted2)}>Modules</p>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors",
                        isActive
                          ? themeMode === "dark"
                            ? "bg-white/[0.12] text-white shadow-sm"
                            : "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50"
                          : cn(t.muted, t.navHover)
                      )}
                    >
                      <tab.icon className={cn("h-4 w-4 shrink-0", isActive ? t.text : t.muted2)} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={cn("text-[13px] font-medium", isActive ? t.text : t.muted)}>{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-white/[0.04] pt-4">
                <p className={cn("mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide", t.muted2)}>Recent Runs</p>
                <div className={cn("rounded-lg border border-dashed px-3 py-8 text-center", t.borderSub)}>
                  <p className={cn("text-[12px] leading-relaxed", t.muted)}>
                    No media generated yet. Run a synthesis to see history here.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        ) : (
          <div className={cn("flex w-full shrink-0 flex-col items-center py-2 lg:w-11 lg:py-3 z-20", t.railSurface)}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setHistoryOpen(true)}
              className={cn("h-9 w-9", t.muted, t.navHover)}
              title="Show sidebar"
              aria-label="Show sidebar"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </Button>
            <div className="mt-6 flex flex-col gap-4">
               {tabs.map(tab => (
                 <button 
                    key={tab.id} 
                    onClick={() => { setHistoryOpen(true); setActiveTab(tab.id as any); }}
                    className={cn("p-2 rounded-lg transition-colors group", activeTab === tab.id ? (themeMode === 'dark' ? 'bg-white/10' : 'bg-white shadow') : t.navHover )}
                 >
                    <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? t.text : t.muted2)} strokeWidth={1.5} />
                    <span className="sr-only">{tab.name}</span>
                 </button>
               ))}
            </div>
          </div>
        )}

        <div className={cn("relative min-h-0 min-w-0 flex-1 overflow-y-auto", t.workspaceSurface)}>
          <ImageVideoCore themeMode={themeMode} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
