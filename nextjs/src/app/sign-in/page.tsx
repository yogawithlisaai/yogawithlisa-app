"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { GoogleLogo } from "@/components/google-logo";
import { createClient } from "@/lib/supabase/client";

export default function SignIn() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/mindshift";
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") || "");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) {
      setGoogleLoading(false);
      setError(error.message ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <PageShell>
      <section className="flex min-h-[92vh] items-center justify-center bg-[var(--color-cream)] px-6 pt-24">
        <div className="w-full max-w-md">
          <h1 className="text-center font-serif text-3xl text-[var(--color-ink)] sm:text-4xl">
            Welcome <em className="italic">back</em>
          </h1>
          <p className="mt-2 text-center text-[var(--color-ink-soft)]">Sign in to pick up your practice where you left off.</p>

          <div className="mt-9 rounded-[20px] border border-[var(--color-line)] bg-white p-8">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--color-line)] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] hover:opacity-90 disabled:opacity-60"
            >
              <GoogleLogo />
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--color-line)]" />
              <span className="text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">or</span>
              <div className="h-px flex-1 bg-[var(--color-line)]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)]"
                />
              </div>
              {error && <p className="text-sm text-[#a4453a]">{error}</p>}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <p className="mt-7 text-center text-sm text-[var(--color-ink-soft)]">
            New here?{" "}
            <Link
              href={`/sign-up?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-semibold text-[var(--color-ink)] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
