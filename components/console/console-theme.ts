export type ConsoleThemeMode = "dark" | "light";

export type ConsoleTheme = {
  /** Main canvas: header, composer, transform — one blended surface per theme */
  workspaceSurface: string;
  /** History + Intelligence rails — second surface (subtle lift from canvas) */
  railSurface: string;
  /** Right “tools” column — ChatGPT-style contrast from main canvas */
  toolsPanel: string;
  toolsPanelBorder: string;
  /** Cards sitting on the tools panel */
  toolsCard: string;
  /** Main draft / composer inset (ChatGPT-style input band) */
  composerInset: string;
  shell: string;
  topbar: string;
  border: string;
  borderSub: string;
  muted: string;
  muted2: string;
  text: string;
  s1: string;
  s2: string;
  s3: string;
  s4: string;
  tabIdle: string;
  tabActive: string;
  tabBorder: string;
  btnGhost: string;
  btnPrimary: string;
  navHover: string;
  navActive: string;
  input: string;
  logoInvert: string;
  scrollbar: string;
  danger: string;
  warn: string;
  ok: string;
  info: string;
  mono: string;
};

/**
 * High-contrast tokens for long reading sessions. Muted text stays ≥ ~4.5:1 on surfaces.
 */
export const CONSOLE_THEMES: Record<ConsoleThemeMode, ConsoleTheme> = {
  dark: {
    /** ChatGPT-like main reading surface */
    workspaceSurface: "bg-[#212121]",
    /** Narrower sidebar strip */
    railSurface: "bg-[#171717]",
    toolsPanel: "bg-[#2b2b2b]",
    toolsPanelBorder: "border-l border-white/[0.08]",
    toolsCard: "bg-[#323232]",
    composerInset: "bg-[#2f2f2f]",
    shell: "bg-[#212121] text-[#ececec]",
    topbar: "bg-[#212121]",
    border: "border-white/[0.14]",
    borderSub: "border-white/[0.18]",
    muted: "text-[#B9B7B0]",
    muted2: "text-[#8A8880]",
    text: "text-[#ececec]",
    s1: "bg-[#2a2a2a]",
    s2: "bg-[#303030]",
    s3: "bg-[#383838]",
    s4: "bg-[#404040]",
    tabIdle: "text-[#8A8880] hover:text-[#D8D6D0]",
    tabActive: "text-[#ececec] border-[#ececec]",
    tabBorder: "border-transparent",
    btnGhost: "border-white/[0.18] text-[#B9B7B0] hover:text-[#ececec] hover:border-white/[0.26]",
    btnPrimary: "bg-[#F0EDE6] text-[#090908] hover:opacity-92",
    navHover: "hover:bg-[#2f2f2f] hover:text-[#ececec]",
    navActive: "bg-[#2f2f2f] text-[#ececec] border-l-[#F0EDE6]",
    input: "bg-[#2b2b2b] border-white/[0.14] text-[#ececec] placeholder:text-[#9b9b9b] focus:border-white/[0.22]",
    logoInvert: "brightness-0 invert opacity-95",
    scrollbar: "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#5c5c5c]",
    danger: "text-[#E8704F]",
    warn: "text-[#E3A82E]",
    ok: "text-[#5CCD8F]",
    info: "text-[#6BAFEF]",
    mono: "[font-family:var(--font-console-mono),ui-monospace,monospace]",
  },
  light: {
    workspaceSurface: "bg-white",
    railSurface: "bg-[#f9f9f9]",
    toolsPanel: "bg-[#f4f4f5]",
    toolsPanelBorder: "border-l border-zinc-200/90",
    toolsCard: "bg-white",
    composerInset: "bg-white",
    /** Aligned with Settings: white shell, zinc borders */
    shell: "bg-white text-zinc-900",
    topbar: "bg-white",
    border: "border-zinc-200",
    borderSub: "border-zinc-200",
    muted: "text-zinc-600",
    muted2: "text-zinc-500",
    text: "text-zinc-900",
    s1: "bg-white",
    s2: "bg-zinc-50/90",
    s3: "bg-zinc-100/80",
    s4: "bg-zinc-100",
    tabIdle: "text-zinc-500 hover:text-zinc-900",
    tabActive: "text-zinc-900 border-zinc-900",
    tabBorder: "border-transparent",
    btnGhost: "border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300",
    btnPrimary: "bg-zinc-900 text-white hover:opacity-92",
    navHover: "hover:bg-zinc-100 hover:text-zinc-900",
    navActive: "bg-zinc-100 text-zinc-900 border-l-zinc-900",
    input: "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400",
    logoInvert: "",
    scrollbar: "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300",
    danger: "text-[#B45309]",
    warn: "text-[#A16207]",
    ok: "text-[#15803D]",
    info: "text-[#1D4ED8]",
    mono: "[font-family:var(--font-console-mono),ui-monospace,monospace]",
  },
};

export const THEME_STORAGE_KEY = "standex-console-theme";
