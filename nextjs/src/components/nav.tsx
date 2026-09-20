"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/use-session";

export function Nav({ overDark = false }: { overDark?: boolean }) {
  const [scrolled, setScrolled] = useState(!overDark);
  const { session, supabase } = useSession();

  useEffect(() => {
    if (!overDark) {
      setScrolled(true);
      return;
    }
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overDark]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const dark = overDark && !scrolled; // dark === true means "over the dark hero", i.e. white text on transparent bg

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: dark ? "transparent" : "var(--color-taupe)" }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 sm:px-6">
        <Link
          href="/"
          className="font-serif text-2xl italic lowercase tracking-wide transition-colors sm:text-3xl"
          style={{ color: dark ? "var(--color-white)" : "var(--color-ink)" }}
        >
          yoga with lisa
        </Link>

        {session ? (
          <button
            onClick={handleSignOut}
            className="text-xs font-semibold uppercase tracking-widest transition-colors"
            style={{ color: dark ? "var(--color-white)" : "var(--color-ink)" }}
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="text-xs font-semibold uppercase tracking-widest transition-colors"
            style={{ color: dark ? "var(--color-white)" : "var(--color-ink)" }}
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
