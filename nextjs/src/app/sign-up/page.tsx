"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/client";

export default function SignUp() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      return;
    }
    // If "Confirm email" is enabled in Supabase, there's no session yet.
    if (!data.session) {
      setNotice("Check your email to confirm your account, then sign in.");
      return;
    }
    router.push("/mindshift");
    router.refresh();
  }

  return (
    <PageShell>
      <section className="flex min-h-[92vh] items-center justify-center bg-[var(--color-cream)] px-6 pt-24">
        <div className="w-full max-w-md">
          <h1 className="text-center font-serif text-3xl text-[var(--color-ink)] sm:text-4xl">
            Start your <em className="italic">practice</em>
          </h1>
          <p className="mt-2 text-center text-[var(--color-ink-soft)]">Create an account to save your logs, streaks, and check-ins.</p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-4 rounded-[20px] border border-[var(--color-line)] bg-white p-8">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)]"
              />
            </div>
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)]"
              />
            </div>
            {error && <p className="text-sm text-[#a4453a]">{error}</p>}
            {notice && <p className="text-sm text-[var(--color-terracotta)]">{notice}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[var(--color-ink-soft)]">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-[var(--color-ink)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
