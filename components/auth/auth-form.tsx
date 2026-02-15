"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { neonAuthClient } from "@/lib/neon/auth-client";

export type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode: initialMode }: AuthFormProps) {
  const router = useRouter();
  const session = neonAuthClient.useSession();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const isSignedIn = useMemo(() => Boolean(session.data?.user), [session.data]);

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

      router.push("/dashboard");
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
      callbackURL: "/dashboard",
    });

    if (result.error) {
      setError(result.error.message || "Google sign-in failed");
      setBusy(false);
      return;
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E5EA] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1D1D1F]">Neon Authentication</h1>
        <p className="mt-2 text-sm text-[#6E6E73]">
          {isSignedIn
            ? `Signed in as ${session.data?.user?.email ?? "user"}`
            : mode === "sign-up"
              ? "Create your account."
              : "Sign in to your account."}
        </p>

        {isSignedIn ? (
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-full bg-[#1D1D1F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
            >
              Go to dashboard
            </button>
            <button
              onClick={signOut}
              disabled={busy}
              className="w-full rounded-full border border-[#D1D1D6] px-4 py-2.5 text-sm font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:opacity-60"
            >
              {busy ? "Signing out..." : "Sign out"}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "sign-up" && (
              <div>
                <label className="mb-1 block text-sm text-[#6E6E73]">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E5EA] px-3 py-2.5 text-sm text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm text-[#6E6E73]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E5E5EA] px-3 py-2.5 text-sm text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#6E6E73]">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E5E5EA] px-3 py-2.5 text-sm text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-[#1D1D1F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-60"
            >
              {busy ? "Please wait..." : mode === "sign-up" ? "Create account" : "Sign in"}
            </button>

            <button
              type="button"
              onClick={continueWithGoogle}
              disabled={busy}
              className="w-full rounded-full border border-[#D1D1D6] px-4 py-2.5 text-sm font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:opacity-60"
            >
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => router.push(mode === "sign-up" ? "/auth/sign-in" : "/auth/sign-up")}
              className="w-full text-sm text-[#6E6E73] underline-offset-2 hover:text-[#1D1D1F] hover:underline"
            >
              {mode === "sign-up" ? "Already have an account? Sign in" : "No account? Create one"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
