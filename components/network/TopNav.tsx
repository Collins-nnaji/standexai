"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronRight, ChevronDown, Zap, Cpu, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <div className="flex min-w-0 items-center">
      <img
        src="/StandexLogo.webp"
        alt="Standex Digital Logo"
        className="h-11 w-auto max-h-11 object-contain"
        loading="eager"
      />
    </div>
  );
}


export interface TopNavProps {
  user?: {
    id: string;
    email: string;
    name?: string | null;
    role?: string | null;
  } | null;
}

export function TopNav({ user }: TopNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isAiRoute = 
    pathname.startsWith("/learn") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/console");

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header 
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300",
        isScrolled 
          ? "border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.4)]" 
          : "bg-zinc-950/50 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="mx-auto flex h-20 min-h-[5rem] max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Left: Logo */}
        <div className="flex min-w-0 flex-1 items-center">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="transition-all duration-300">
              <Logo />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {/* AI Services Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-all duration-300 border border-zinc-800/50 hover:border-emerald-500/30">
              AI Services
              <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="w-[280px] rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2 mb-2">
                   <Zap className="h-3.5 w-3.5 text-emerald-500" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Artificial Intelligence</span>
                </div>
                <Link href="/solutions/ai-agents" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-zinc-800">
                  <span className="text-sm font-bold text-white leading-tight">AI Agents & Swarms</span>
                  <span className="text-[11px] font-medium text-white/70">Autonomous systems</span>
                </Link>
                <Link href="/solutions/ai-integration" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-zinc-800">
                  <span className="text-sm font-bold text-white leading-tight">Enterprise Integration</span>
                  <span className="text-[11px] font-medium text-white/70">Secure LLM architecture</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Power Platform Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-all duration-300 border border-zinc-800/50 hover:border-emerald-500/30">
              Power Platform
              <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="w-[280px] rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2 mb-2">
                   <Cpu className="h-3.5 w-3.5 text-[#049DCB]" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#049DCB]">Microsoft Solutions</span>
                </div>
                <Link href="/solutions/power-platform" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-zinc-800">
                  <span className="text-sm font-bold text-white leading-tight">Strategy & Governance</span>
                </Link>
                <Link href="/solutions/power-apps" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-zinc-800">
                  <span className="text-sm font-bold text-white leading-tight">Power Apps</span>
                </Link>
                <Link href="/solutions/power-automate" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-zinc-800">
                  <span className="text-sm font-bold text-white leading-tight">Power Automate</span>
                </Link>
                <Link href="/solutions/power-bi" className="group/item flex flex-col rounded-xl p-3 transition-all hover:bg-zinc-800">
                  <span className="text-sm font-bold text-white leading-tight">Power BI & Analytics</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Standalone Links */}
          {/* Standalone Links */}
          <Link 
            href="/console" 
            className="rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
            style={{ color: '#FFFFFF' }}
          >
            AI Tools
          </Link>
          <Link 
            href="/learn" 
            className="rounded-xl px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
            style={{ color: '#FFFFFF' }}
          >
            Learn
          </Link>

          
          <Link
            href="/Contact"
            className="ml-2 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
          >
            Contact
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-white shadow-sm transition-all hover:bg-zinc-700 active:scale-95 sm:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={2.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-20 z-[90] bg-zinc-900/40 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 top-20 z-[100] w-[280px] border-l border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:hidden"
            >
              <nav className="flex flex-col gap-2">
                <div className="mb-4">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/50">Services</p>
                </div>
                
                <Link href="/solutions/ai-agents" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                   AI Agents <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                <Link href="/solutions/ai-integration" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                   Enterprise AI <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                <Link href="/solutions/power-platform" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                   Power Platform <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                
                <div className="my-4 h-px w-full bg-zinc-800" />
                
                <Link href="/console" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                   AI Tools <Zap className="h-4 w-4 text-emerald-500" />
                </Link>
                <Link href="/learn" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                   Learn <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>

                <Link href="/Contact" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                   Contact <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>

                <div className="my-4 h-px w-full bg-zinc-100" />
                
                <div className="mb-3 px-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Engineering Tools</p>
                </div>
                <Link href="/console" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 transition-all">
                  <Zap className="h-5 w-5 text-emerald-500" /> AI Tools Console
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
