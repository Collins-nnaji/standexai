"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";

export type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode: initialMode }: AuthFormProps) {
  const router = useRouter();
  const session = neonAuthClient.useSession();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<"RESEARCHER" | "ENGINEER" | "LAB">("RESEARCHER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const isSignedIn = useMemo(() => Boolean(session.data?.user), [session.data]);

  // Automated redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/r/me");
    }
  }, [isSignedIn, router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      if (mode === "sign-up") {
        const result = await neonAuthClient.signUp.email({
          name: name.trim() || "User",
          email: email.trim(),
          password,
        });
        
        if (result.error) {
          setError(result.error.message || "Sign-up failed");
          setBusy(false);
          return;
        }

        // If signup success, we need to set the role. 
        // If neonAuthClient doesn't support it in the call, we might need a separate call or it defaults to RESEARCHER.
        // For now, we'll assume the client is updated or we handle it via a profile patch if possible right after.
        await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role })
        });

      } else {
        const result = await neonAuthClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (result.error) {
          setError(result.error.message || "Sign-in failed");
          setBusy(false);
          return;
        }
      }
      router.push("/r/me");
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed");
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  const signOut = async () => {
    setBusy(true);
    setError(null);
    const result = await neonAuthClient.signOut();
    if (result.error) {
      setError(result.error.message || "Sign-out failed");
      setBusy(false);
      return;
    }
    router.refresh();
    setBusy(false);
  };

  const continueWithGoogle = async () => {
    setBusy(true);
    setError(null);
    const result = await neonAuthClient.signIn.social({
      provider: "google",
      callbackURL: "/console/redirect",
    });
    if (result.error) {
      setError(result.error.message || "Google sign-in failed");
      setBusy(false);
      return;
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-zinc-50 px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-full max-w-[180px] items-center justify-center sm:h-11 sm:max-w-[200px]">
            <Image
              src="/standexailogo.png"
              alt="StandexAI"
              width={180}
              height={48}
              className="h-full w-auto max-h-11 object-contain object-center"
              priority
              unoptimized
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span>Professional Network for AI Researchers</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-xl font-bold text-zinc-900">
            {isSignedIn ? "Welcome back" : mode === "sign-up" ? "Create your account" : "Sign in"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {isSignedIn
              ? `Signed in as ${session.data?.user?.email ?? "user"}`
              : mode === "sign-up"
                ? "Start analyzing and improving your communication."
                : "Continue to the network."}
          </p>

          {isSignedIn ? (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push("/r/me")}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/25"
              >
                Go to My Profile
              </button>
              <button
                onClick={signOut}
                disabled={busy}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
              >
                {busy ? "Signing out..." : "Sign out"}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "sign-up" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">I am joining as a...</label>
                    <div className="grid grid-cols-3 gap-2">
                       {[
                         { id: "RESEARCHER", label: "Researcher", desc: "Scientific focus" },
                         { id: "ENGINEER", label: "Engineer", desc: "Implementation" },
                         { id: "LAB", label: "Lab / Org", desc: "Enterprise" }
                       ].map((r) => (
                         <button
                           key={r.id}
                           type="button"
                           onClick={() => setRole(r.id as any)}
                           className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${
                             role === r.id 
                               ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm" 
                               : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"
                           }`}
                         >
                            <span className="text-[10px] font-black uppercase tracking-tighter">{r.label}</span>
                            <span className="text-[8px] font-medium opacity-60">{r.desc}</span>
                         </button>
                       ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Name</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:bg-white focus:border-indigo-300 transition"
                      placeholder="Your name"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:bg-white focus:border-indigo-300 transition"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:bg-white focus:border-indigo-300 transition"
                  placeholder="Min. 8 characters"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-zinc-400 bg-zinc-100 px-4 py-3 text-sm text-zinc-900">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 disabled:opacity-60"
              >
                {busy ? "Please wait..." : mode === "sign-up" ? "Create account" : "Sign in"}
              </button>

              <button
                type="button"
                onClick={continueWithGoogle}
                disabled={busy}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
              >
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => router.push(mode === "sign-up" ? "/auth/sign-in" : "/auth/sign-up")}
                className="w-full text-sm text-zinc-500 hover:text-zinc-800 transition"
              >
                {mode === "sign-up" ? "Already have an account? Sign in" : "No account? Create one"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
