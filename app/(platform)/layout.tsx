"use client";

import { LayoutDashboard, Settings, LogOut, PanelLeftClose, PanelLeftOpen, FileBarChart, Search, FlaskConical } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { neonAuthClient } from "@/lib/neon/auth-client";

const navigation = [
  { name: "Brand Pulse", href: "/brand-pulse", icon: Search },
  { name: "Standex Score Ledger", href: "/standex-score-ledger", icon: FileBarChart },
  { name: "Prompt Lab", href: "/prompt-lab", icon: FlaskConical },
  { name: "Settings", href: "/settings", icon: Settings },
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

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
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
        } ${collapsed ? "w-20" : "w-72"}`}
      >
        {/* Logo */}
        <div className="border-b border-zinc-100 p-6 bg-white">
          <div className="mb-4 flex items-center justify-between">
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
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400">Standex Score Infrastructure</p>
            </div>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="mt-2 flex w-full items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-4 bg-white overflow-y-auto">
          {/* Overview */}
          <Link
            href="/dashboard"
            className={`flex items-center rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all mb-4 ${
              pathname === "/dashboard"
                ? "bg-indigo-50 text-indigo-700"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
            } ${collapsed ? "justify-center px-0" : "gap-4"}`}
          >
            <LayoutDashboard className={`h-4 w-4 ${pathname === "/dashboard" ? "text-indigo-600" : "text-zinc-400"}`} />
            {!collapsed && "Overview"}
          </Link>

          {!collapsed && (
            <div className="px-4 py-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">Standex Score Pipeline</span>
            </div>
          )}

          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
                } ${collapsed ? "justify-center px-0" : "gap-4"}`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-zinc-400"}`} />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-zinc-100 bg-zinc-50/50 p-6">
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-4"}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-sm font-black text-indigo-700 shadow-sm">
              {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-black text-zinc-950">{user?.name ?? "Standex Score User"}</p>
                  <p className="truncate text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{user?.email}</p>
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
