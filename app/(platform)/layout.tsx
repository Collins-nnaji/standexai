"use client";

import { LayoutDashboard, FileEdit, Settings, LogOut, Home, PanelLeftClose, PanelLeftOpen, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { neonAuthClient } from "@/lib/neon/auth-client";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "SEO/GEO Audit", href: "/dashboard", icon: LayoutDashboard },
  { name: "Studio", href: "/studio/editor", icon: FileEdit },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Auth", href: "/auth/sign-in", icon: LogIn },
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
    <div className="flex min-h-screen bg-white text-[#1D1D1F]">
      <button
        onClick={() => setMobileOpen((value) => !value)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-[#D1D1D6] bg-white p-2 text-[#6E6E73] shadow-sm md:hidden"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        {mobileOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </button>

      {mobileOpen && <button className="fixed inset-0 z-20 bg-black/20 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[#E5E5EA] bg-[#F5F5F7] transition-all duration-300 md:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="border-b border-[#E5E5EA] p-4">
          <div className="mb-3 flex items-center justify-between">
            <Link href="/">
              <Image
                src="/standexai-logo-final.png"
                alt="StandexAI"
                width={96}
                height={26}
                className={`w-auto object-contain transition-all duration-300 ${
                  collapsed ? "h-5" : "h-6"
                }`}
                priority
              />
            </Link>
            <button
              onClick={() => setCollapsed((value) => !value)}
              className="rounded-lg border border-[#D1D1D6] bg-white p-1.5 text-[#6E6E73] transition hover:border-[#1D1D1F] hover:text-[#1D1D1F]"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
          {!collapsed && <p className="text-xs text-[#AEAEB2]">Compliance-First Content Platform</p>}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  isActive ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#6E6E73] hover:bg-white hover:text-[#1D1D1F]"
                }`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#E5E5EA] p-3">
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D1D1F] text-sm font-bold text-white">
              {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1">
                  <p className="truncate text-sm font-medium text-[#1D1D1F]">{user?.name ?? "Signed in user"}</p>
                  <p className="truncate text-xs text-[#AEAEB2]">{user?.email ?? "-"}</p>
                </div>
                <button onClick={signOut} className="text-[#AEAEB2] transition hover:text-[#1D1D1F]">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto bg-white md:ml-0">{children}</main>
    </div>
  );
}
