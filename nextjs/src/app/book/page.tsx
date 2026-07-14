"use client";

import { useState } from "react";
import { InlineWidget } from "react-calendly";
import { PageShell } from "@/components/page-shell";
import { LiveGroupClasses } from "@/features/booking/live-group-classes";
import { CorporateWellness } from "@/features/booking/corporate-wellness";
import { RetreatSessions } from "@/features/booking/retreat-sessions";

const CALENDLY_URL = "https://calendly.com/contact-yogawithlisa/30min";

type Category = {
  id: string;
  label: string;
  desc: string;
  embedType: "calendly" | "iframe" | "custom";
  embedUrl?: string;
};

const categories: Category[] = [
  {
    id: "group",
    label: "Live Group Classes",
    desc: "Join a local group class in a shared, supportive space.",
    embedType: "custom",
  },
  {
    id: "private",
    label: "One-on-One Private Sessions",
    desc: "Fully personalized practice tailored to your body and goals.",
    embedType: "calendly",
    embedUrl: CALENDLY_URL,
  },
  {
    id: "corporate",
    label: "Corporate Wellness",
    desc: "On-site or virtual sessions for teams, off-sites, and wellness days.",
    embedType: "custom",
  },
  {
    id: "retreat",
    label: "Retreat Sessions",
    desc: "Immersive multi-day retreat programming and workshops.",
    embedType: "custom",
  },
  {
    id: "discovery",
    label: "Discovery Call",
    desc: "Not sure what you need? Start with a free 30-minute call.",
    embedType: "calendly",
    embedUrl: CALENDLY_URL,
  },
];

export default function Book() {
  const [active, setActive] = useState(categories[0].id);
  const activeCategory = categories.find((c) => c.id === active)!;

  return (
    <PageShell>
      <section className="bg-[var(--color-dark)] px-5 pb-16 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Work with Lisa</p>
          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Book with <em className="italic">Lisa</em>
          </h1>
          <p className="mt-4 max-w-xl text-white/60">
            Choose the kind of session you&apos;re looking for, then find a time that works for you.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`rounded-[20px] border p-6 text-left transition-colors ${
                  active === c.id
                    ? "border-white bg-white"
                    : "border-[var(--color-line-dark)] bg-[var(--color-dark-card)] hover:bg-[#2c2c2c]"
                }`}
              >
                <p className={`font-serif text-lg ${active === c.id ? "text-[var(--color-ink)]" : "text-white"}`}>{c.label}</p>
                <p className={`mt-2 text-xs leading-relaxed ${active === c.id ? "text-[var(--color-ink-soft)]" : "text-white/50"}`}>{c.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[20px] border border-[var(--color-line)] p-4 sm:p-6">
            <h2 className="mb-1 font-serif text-xl text-[var(--color-ink)]">{activeCategory.label}</h2>
            {activeCategory.embedType !== "custom" && (
              <p className="mb-4 text-sm text-[var(--color-ink-soft)]">
                {activeCategory.embedType === "calendly"
                  ? "Pick a time below, this uses Lisa's Calendly."
                  : "Pick a time below."}
              </p>
            )}
            {activeCategory.embedType === "custom" ? (
              activeCategory.id === "group" ? (
                <LiveGroupClasses />
              ) : activeCategory.id === "corporate" ? (
                <CorporateWellness />
              ) : (
                <RetreatSessions />
              )
            ) : (
              <div className="overflow-hidden rounded-[20px]">
                {activeCategory.embedType === "calendly" ? (
                  <InlineWidget url={activeCategory.embedUrl!} styles={{ height: "700px", width: "100%" }} />
                ) : (
                  <iframe
                    key={activeCategory.id}
                    src={activeCategory.embedUrl}
                    title={activeCategory.label}
                    style={{ height: "700px", width: "100%", border: 0 }}
                    loading="lazy"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
