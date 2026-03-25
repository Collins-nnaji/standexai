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

export const CONSOLE_THEMES: Record<ConsoleThemeMode, ConsoleTheme> = {
  dark: {
    shell: "bg-[#0C0C0B] text-[#EDEBE4]",
    topbar: "bg-[#141412] border-white/[0.05]",
    border: "border-white/[0.05]",
    borderSub: "border-white/[0.09]",
    muted: "text-[#8C8A83]",
    muted2: "text-[#52514E]",
    text: "text-[#EDEBE4]",
    s1: "bg-[#141412]",
    s2: "bg-[#1A1A17]",
    s3: "bg-[#222220]",
    s4: "bg-[#2A2A27]",
    tabIdle: "text-[#52514E] hover:text-[#8C8A83]",
    tabActive: "text-[#EDEBE4] border-[#EDEBE4]",
    tabBorder: "border-transparent",
    btnGhost: "border-white/[0.09] text-[#8C8A83] hover:text-[#EDEBE4] hover:border-white/[0.14]",
    btnPrimary: "bg-[#EDEBE4] text-[#0C0C0B] hover:opacity-85",
    navHover: "hover:bg-[#1A1A17] hover:text-[#EDEBE4]",
    navActive: "bg-[#1A1A17] text-[#EDEBE4] border-l-[#EDEBE4]",
    input: "bg-[#1A1A17] border-white/[0.09] text-[#EDEBE4] placeholder:text-[#52514E] focus:border-white/[0.14]",
    logoInvert: "brightness-0 invert opacity-95",
    scrollbar: "[&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#2A2A27]",
    danger: "text-[#D45A38]",
    warn: "text-[#C99020]",
    ok: "text-[#45A876]",
    info: "text-[#4A88CC]",
    mono: "[font-family:var(--font-console-mono),ui-monospace,monospace]",
  },
  light: {
    shell: "bg-[#F5F3EF] text-[#111110]",
    topbar: "bg-white border-[#DDDBD5]",
    border: "border-[#DDDBD5]",
    borderSub: "border-zinc-200",
    muted: "text-[#6B6860]",
    muted2: "text-[#52514E]",
    text: "text-[#111110]",
    s1: "bg-white",
    s2: "bg-[#EEEBE6]",
    s3: "bg-[#E8E4DD]",
    s4: "bg-[#DDD8CF]",
    tabIdle: "text-[#6B6860] hover:text-[#111110]",
    tabActive: "text-[#111110] border-[#111110]",
    tabBorder: "border-transparent",
    btnGhost: "border-[#DDDBD5] text-[#6B6860] hover:text-[#111110] hover:border-zinc-400",
    btnPrimary: "bg-[#111110] text-[#F5F3EF] hover:opacity-90",
    navHover: "hover:bg-[#EEEBE6] hover:text-[#111110]",
    navActive: "bg-[#EEEBE6] text-[#111110] border-l-[#111110]",
    input: "bg-white border-[#DDDBD5] text-[#111110] placeholder:text-[#8C8A83] focus:border-zinc-400",
    logoInvert: "",
    scrollbar: "[&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#CCC6BC]",
    danger: "text-[#B45309]",
    warn: "text-[#A16207]",
    ok: "text-[#15803D]",
    info: "text-[#1D4ED8]",
    mono: "[font-family:var(--font-console-mono),ui-monospace,monospace]",
  },
};

export const THEME_STORAGE_KEY = "standex-console-theme";
