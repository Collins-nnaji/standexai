export type ConsoleThemeMode = "dark" | "light";

export type ConsoleTheme = {
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
    shell: "bg-[#090908] text-[#F6F4EF]",
    topbar: "bg-[#111110] border-white/[0.14]",
    border: "border-white/[0.14]",
    borderSub: "border-white/[0.18]",
    muted: "text-[#B9B7B0]",
    muted2: "text-[#8A8880]",
    text: "text-[#F6F4EF]",
    s1: "bg-[#111110]",
    s2: "bg-[#171716]",
    s3: "bg-[#1E1E1C]",
    s4: "bg-[#2A2A27]",
    tabIdle: "text-[#8A8880] hover:text-[#D8D6D0]",
    tabActive: "text-[#F6F4EF] border-[#F6F4EF]",
    tabBorder: "border-transparent",
    btnGhost: "border-white/[0.18] text-[#B9B7B0] hover:text-[#F6F4EF] hover:border-white/[0.26]",
    btnPrimary: "bg-[#F0EDE6] text-[#090908] hover:opacity-92",
    navHover: "hover:bg-[#1E1E1C] hover:text-[#F6F4EF]",
    navActive: "bg-[#1E1E1C] text-[#F6F4EF] border-l-[#F0EDE6]",
    input: "bg-[#171716] border-white/[0.18] text-[#F6F4EF] placeholder:text-[#6E6C66] focus:border-white/[0.28]",
    logoInvert: "brightness-0 invert opacity-95",
    scrollbar: "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#3A3A36]",
    danger: "text-[#E8704F]",
    warn: "text-[#E3A82E]",
    ok: "text-[#5CCD8F]",
    info: "text-[#6BAFEF]",
    mono: "[font-family:var(--font-console-mono),ui-monospace,monospace]",
  },
  light: {
    /** Aligned with Settings: white shell, zinc borders */
    shell: "bg-white text-zinc-900",
    topbar: "bg-white border-zinc-200",
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
