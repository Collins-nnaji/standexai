"use client";

import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsoleStudio } from "@/components/console/ConsoleStudio";
import {
  CONSOLE_THEMES,
  THEME_STORAGE_KEY,
  type ConsoleThemeMode,
} from "@/components/console/console-theme";
import { WorkspaceModeNav } from "@/components/platform/WorkspaceModeNav";
import { Button } from "@/components/ui/button";

/**
 * Centered, Stateless ConsoleWorkspace for Standex Digital.
 * Removed: History sidebar, profile buttons, fetch/save logic.
 */
export function ConsoleWorkspace() {
  const [themeMode, setThemeMode] = useState<ConsoleThemeMode>("light");

  const t = CONSOLE_THEMES[themeMode];

  useEffect(() => {
    const s = localStorage.getItem(THEME_STORAGE_KEY) as ConsoleThemeMode | null;
    if (s === "light" || s === "dark") setThemeMode(s);
  }, []);

  const persistTheme = (m: ConsoleThemeMode) => {
    setThemeMode(m);
    localStorage.setItem(THEME_STORAGE_KEY, m);
  };


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
          "relative z-10 flex h-12 min-h-12 shrink-0 items-center gap-2 px-3 backdrop-blur-md sm:gap-3 sm:px-4 lg:gap-4 lg:px-6",
          t.workspaceSurface,
        )}
      >
        <WorkspaceModeNav active="console" consoleTheme={t} consoleThemeMode={themeMode} className="min-w-0" />

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
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

      <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 justify-center">
        <div className={cn("relative min-h-0 min-w-0 flex-1 max-w-7xl", t.workspaceSurface)}>
          <div className="flex h-full min-h-0 flex-col">
            <ConsoleStudio themeMode={themeMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
