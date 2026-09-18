"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/use-session";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Hard, NYT-style paywall gate. Renders nothing for signed-in or pending sessions. For a
 * signed-out visitor, `children` render normally until the page is scrolled past `sentinelRef`
 * (an empty marker element placed by the caller); from then on `children` are blurred and inert,
 * scroll is frozen, and a centered dialog with no close button takes over.
 */
export function SignInGate({
  sentinelRef,
  headline,
  copy,
  children,
}: {
  sentinelRef: RefObject<HTMLElement>;
  headline: string;
  copy: string;
  children: ReactNode;
}) {
  const { session, isPending } = useSession();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const gatedRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isPending || session) return;

    function onScroll() {
      const el = sentinelRef.current;
      if (!el) return;
      if (el.getBoundingClientRect().bottom < 0) {
        setActive(true);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPending, session, sentinelRef]);

  useEffect(() => {
    const el = gatedRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (el) el.inert = active;
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const redirect = encodeURIComponent(pathname || "/");

  return (
    <div className="relative">
      <div ref={gatedRef} className={active ? "pointer-events-none select-none blur-md" : undefined}>
        {children}
      </div>

      {active && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sign-in-gate-heading"
          aria-describedby="sign-in-gate-copy"
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
        >
          <div className="w-full max-w-sm rounded-[20px] border border-[var(--color-line)] bg-white p-8 text-center shadow-xl">
            <h2 id="sign-in-gate-heading" className="font-serif text-2xl text-[var(--color-ink)]">
              {headline}
            </h2>
            <p id="sign-in-gate-copy" className="mt-2 text-sm text-[var(--color-ink-soft)]">
              {copy}
            </p>
            <Link
              ref={primaryRef}
              href={`/sign-up?redirect=${redirect}`}
              className="mt-6 block w-full rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90"
            >
              Create a free account
            </Link>
            <Link
              href={`/sign-in?redirect=${redirect}`}
              className="mt-4 block text-sm font-semibold text-[var(--color-ink)] hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
