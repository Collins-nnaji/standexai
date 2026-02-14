"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Moon,
    Sun
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

const NAV_ITEMS = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "text-blue-400"
    },
    {
        label: "Content Studio",
        href: "/studio",
        icon: FileText,
        color: "text-[var(--accent-secondary)]"
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        color: "text-slate-400"
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--bg-panel)] border border-[var(--line)] rounded-md text-[var(--ink-900)]"
            >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-[var(--bg-panel)] border-r border-[var(--line)] transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-[var(--line)]">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center text-black font-bold text-lg">
                                S
                            </div>
                            <span className="font-bold text-lg tracking-tight text-[var(--ink-900)]">StandexAI</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                                        isActive
                                            ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-sm ring-1 ring-[var(--accent-primary)]/20"
                                            : "text-[var(--ink-500)] hover:text-[var(--ink-900)] hover:bg-[var(--line)]/50"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-5 w-5 transition-colors",
                                            isActive ? item.color : "text-[var(--ink-500)] group-hover:text-[var(--ink-900)]"
                                        )}
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User / Footer */}
                    <div className="p-4 border-t border-[var(--line)] space-y-4">
                        {/* Theme Toggle */}
                        <div className="px-1">
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--ink-500)] hover:text-[var(--ink-900)] hover:bg-[var(--line)]/50 transition-colors border border-transparent hover:border-[var(--line)]"
                            >
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--line)]">
                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                CN
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--ink-900)] truncate">Collins Nnaji</p>
                                <p className="text-xs text-[var(--ink-500)] truncate">Pro Plan</p>
                            </div>
                            <button className="text-[var(--ink-500)] hover:text-[var(--ink-900)]">
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
}
