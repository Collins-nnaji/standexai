"use client";

import {
  LayoutDashboard, Settings, LogOut, PanelLeftClose, PanelLeftOpen,
  FileText, Mic, PenTool, ScanSearch, ShieldAlert, Brain, BarChart3, Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { neonAuthClient } from "@/lib/neon/auth-client";

const mainNav = [
  { name: "Text Analyzer", href: "/text-analyzer", icon: FileText },
  { name: "Speech Analyzer", href: "/speech-analyzer", icon: Mic },
  { name: "Rewrite Studio", href: "/rewrite-studio", icon: PenTool },
];

const toolsNav = [
  { name: "AI Detection", href: "/ai-detection", icon: ScanSearch },
  { name: "Risk & Compliance", href: "/risk-compliance", icon: ShieldAlert },
  { name: "Intent Analyzer", href: "/intent-analyzer", icon: Brain },
  { name: "Insights", href: "/insights", icon: BarChart3 },
];

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const session = neonAuthClient.useSession();
  const user = session.data?.user;

  const signOut = async () => {
    await neonAuthClient.signOut();
    window.location.href = "/auth/sign-in";
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const NavLink = ({ item }: { item: { name: string; href: string; icon: React.ComponentType<{ className?: string }> } }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center rounded-xl px-4 py-2.5 text-[11px] font-bold tracking-wide transition-all ${
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
        } ${collapsed ? "justify-center px-0" : "gap-3"}`}
        title={collapsed ? item.name : undefined}
      >
        <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-indigo-600" : "text-zinc-400"}`} />
        {!collapsed && item.name}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-zinc-900">
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-zinc-200 bg-white p-2 text-zinc-600 shadow-sm md:hidden"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        {mobileOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </button>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 md:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "w-[72px]" : "w-64"}`}
      >
        <div className="border-b border-zinc-100 px-5 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image
                src="/standexailogo.png"
                alt="StandexAI"
                width={collapsed ? 24 : 110}
                height={collapsed ? 24 : 30}
                className={`w-auto object-contain brightness-0 contrast-125 transition-all duration-300 ${collapsed ? "h-6" : "h-7"}`}
                priority
              />
            </Link>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="rounded-lg border border-zinc-100 bg-zinc-50 p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <PanelLeftClose className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {!collapsed && (
            <div className="mt-3 flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              <p className="text-[10px] font-semibold tracking-wide text-zinc-400">AI Communication Coach</p>
            </div>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="mt-3 flex w-full items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <PanelLeftOpen className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center rounded-xl px-4 py-2.5 text-[11px] font-bold tracking-wide transition-all mb-2 ${
              pathname === "/dashboard"
                ? "bg-indigo-50 text-indigo-700"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            } ${collapsed ? "justify-center px-0" : "gap-3"}`}
          >
            <LayoutDashboard className={`h-4 w-4 shrink-0 ${pathname === "/dashboard" ? "text-indigo-600" : "text-zinc-400"}`} />
            {!collapsed && "Dashboard"}
          </Link>

          {!collapsed && (
            <div className="px-4 pt-4 pb-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-300">Analyze</span>
            </div>
          )}
          {collapsed && <div className="my-2 mx-2 h-px bg-zinc-100" />}
          {mainNav.map((item) => <NavLink key={item.name} item={item} />)}

          {!collapsed && (
            <div className="px-4 pt-5 pb-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-300">Tools</span>
            </div>
          )}
          {collapsed && <div className="my-2 mx-2 h-px bg-zinc-100" />}
          {toolsNav.map((item) => <NavLink key={item.name} item={item} />)}

          {!collapsed && (
            <div className="px-4 pt-5 pb-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-300">Account</span>
            </div>
          )}
          {collapsed && <div className="my-2 mx-2 h-px bg-zinc-100" />}
          <NavLink item={{ name: "Settings", href: "/settings", icon: Settings }} />
        </nav>

        <div className="border-t border-zinc-100 bg-zinc-50/50 p-4">
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-sm font-bold text-indigo-700">
              {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-bold text-zinc-900">{user?.name ?? "StandexAI User"}</p>
                  <p className="truncate text-[10px] text-zinc-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => void signOut()}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA]">
        {children}
      </main>
    </div>
  );
}
