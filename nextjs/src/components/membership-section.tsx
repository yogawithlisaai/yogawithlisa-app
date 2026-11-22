"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postJson } from "@/lib/fetch-json";

const PERKS = [
  "Full access to MindShift AI",
  "Our full on-demand library",
  "New videos every month",
  "Meditation & mindfulness series",
  "Vegan, gluten-free meal plans",
];

/**
 * Rendered wherever a signed-in visitor isn't an active member yet (classes, MindShift,
 * recipes), and linked to from locked-content taps. id="membership" so callers can
 * scrollIntoView() it.
 */
export function MembershipSection() {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");

  const checkout = useMutation({
    mutationFn: () => postJson<{ url: string }>("/api/billing/checkout", { plan }),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  return (
    <section id="membership" className="scroll-mt-24 bg-[var(--color-cream)] px-5 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-[var(--color-dark)] px-8 py-14 text-center sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Want more?</p>
        <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Join Yoga with Lisa Rose</h2>

        <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-3 text-sm text-white/80">
              <span aria-hidden="true" className="mt-0.5 text-white">✓</span>
              {perk}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-9 inline-flex rounded-full border border-white/20 p-1">
          <button
            type="button"
            onClick={() => setPlan("monthly")}
            className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              plan === "monthly" ? "bg-white text-[var(--color-ink)]" : "text-white/70"
            }`}
          >
            Monthly — $16.99
          </button>
          <button
            type="button"
            onClick={() => setPlan("yearly")}
            className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              plan === "yearly" ? "bg-white text-[var(--color-ink)]" : "text-white/70"
            }`}
          >
            Yearly — $169.99 (2 months free)
          </button>
        </div>

        <button
          type="button"
          onClick={() => checkout.mutate()}
          disabled={checkout.isPending}
          className="mt-8 block w-full rounded-full bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:mx-auto sm:w-auto sm:px-9"
        >
          {checkout.isPending ? "Redirecting…" : "Start your 7-day free trial"}
        </button>
        {checkout.isError && (
          <p className="mt-3 text-sm text-[#f2b8ab]">Something went wrong. Please try again.</p>
        )}
        <p className="mt-4 text-xs text-white/40">Card required. Cancel anytime.</p>
      </div>
    </section>
  );
}
