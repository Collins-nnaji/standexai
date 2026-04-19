"use client";

import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConsoleAuthProps {
  children: React.ReactNode;
}

export function ConsoleAuth({ children }: ConsoleAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authStatus = sessionStorage.getItem("console_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsVerifying(true);
    setError(false);

    // Simulate verification delay for "diagnostic" feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (code === "CollinsJoshua") {
      setIsAuthenticated(true);
      sessionStorage.setItem("console_authenticated", "true");
    } else {
      setError(true);
      setCode("");
    }
    setIsVerifying(false);
  };

  if (!mounted) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 font-sans selection:bg-emerald-500/30">
      {/* Technical Background Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:40px_40px]"
          style={{ maskImage: "radial-gradient(circle at center, black, transparent 80%)" }}
        />
      </div>

      <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 shadow-2xl overflow-hidden relative">
          {/* Diagnostic Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/5 blur-[80px]" />

          <div className="flex flex-col items-center text-center">
            {/* Lock Icon Section */}
            <div className="h-20 w-20 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-8 relative group">
              <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Lock className="h-8 w-8 text-zinc-400 group-hover:text-emerald-400 transition-colors relative z-10" />
            </div>

            <div className="space-y-2 mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Restricted Access</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">Enter Code</h2>
              <p className="text-zinc-500 text-sm font-medium">Please provide the diagnostic authorization key to access the AI Console.</p>
            </div>

            <form onSubmit={handleVerify} className="w-full space-y-4 relative z-10">
              <div className="relative">
                <Input
                  type="password"
                  placeholder="AUTHORIZATION_KEY"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(false);
                  }}
                  className={cn(
                    "h-14 bg-zinc-950/50 border-zinc-800 rounded-2xl px-6 text-center text-lg font-mono tracking-[0.3em] transition-all placeholder:text-zinc-700 focus:border-emerald-500/50 focus:ring-emerald-500/20",
                    error && "border-rose-500/50 focus:border-rose-500 animate-shake"
                  )}
                  disabled={isVerifying}
                  autoFocus
                />
                {error && (
                  <p className="absolute -bottom-6 left-0 w-full text-[10px] font-black text-rose-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                    Invalid Access Code. Try Again.
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isVerifying || !code}
                className="w-full h-14 rounded-2xl bg-zinc-100 text-zinc-950 hover:bg-white active:scale-95 transition-all text-sm font-black uppercase tracking-widest shadow-xl shadow-white/5"
              >
                {isVerifying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Verify Identity <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-12 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Security Level</span>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Diagnostic 04</span>
              </div>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Status</span>
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Secured</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Link back */}
        <div className="mt-8 text-center px-4">
           <Link href="/Training" className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
              Return to Control Center
           </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
