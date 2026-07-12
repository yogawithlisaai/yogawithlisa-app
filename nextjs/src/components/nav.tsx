"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/use-session";

const links = [
  { href: "/classes", label: "Classes" },
  { href: "/recipes", label: "Recipes" },
  { href: "/mindshift", label: "MindShift" },
  { href: "/wellness", label: "Wellness" },
  { href: "/book", label: "Book with Lisa" },
  { href: "/reminders", label: "Reminders" },
];

export function Nav({ overDark = false }: { overDark?: boolean }) {
  const [open, setOpen] = useState(false);
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

        <div className="flex items-center gap-5">
          {session ? (
            <button
              onClick={handleSignOut}
              className="hidden text-xs font-semibold uppercase tracking-widest sm:inline transition-colors"
              style={{ color: dark ? "var(--color-white)" : "var(--color-ink)" }}
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="hidden text-xs font-semibold uppercase tracking-widest sm:inline transition-colors"
              style={{ color: dark ? "var(--color-white)" : "var(--color-ink)" }}
            >
              Sign in
            </Link>
          )}

          <button
            className="flex h-9 w-9 items-center justify-center"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
              <line x1="0" y1="1" x2="20" y2="1" stroke={dark ? "white" : "#111111"} strokeWidth="1.4" />
              <line x1="0" y1="7.5" x2="20" y2="7.5" stroke={dark ? "white" : "#111111"} strokeWidth="1.4" />
              <line x1="0" y1="14" x2="20" y2="14" stroke={dark ? "white" : "#111111"} strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full bg-[var(--color-cream)] px-8 py-12 sm:px-16">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif text-3xl italic text-[var(--color-ink)] transition-opacity hover:opacity-60"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-4 border-t border-[var(--color-line)] pt-6">
              {session ? (
                <button onClick={handleSignOut} className="text-left text-sm font-semibold uppercase tracking-widest text-[var(--color-ink-soft)]">
                  Sign out
                </button>
              ) : (
                <>
                  <Link href="/sign-in" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ink-soft)]">
                    Sign in
                  </Link>
                  <Link href="/sign-up" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ink-soft)]">
                    Create account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
