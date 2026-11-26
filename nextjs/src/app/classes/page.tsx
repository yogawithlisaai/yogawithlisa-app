"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { SignInGate } from "@/components/sign-in-gate";
import { MembershipSection } from "@/components/membership-section";
import { ClassPlayer } from "@/components/class-player";
import { useMembership } from "@/lib/use-membership";
import type { PublicClassVideo } from "@/lib/classes-client";

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const durations = [
  { label: "Any length", max: Infinity },
  { label: "Under 15 min", max: 15 },
  { label: "15-30 min", max: 30 },
  { label: "30+ min", max: Infinity, min: 30 },
] as { label: string; max: number; min?: number }[];

function scrollToMembership() {
  document.getElementById("membership")?.scrollIntoView({ behavior: "smooth" });
}

function ClassCard({ v, className = "" }: { v: PublicClassVideo; className?: string }) {
  return (
    <div
      id={v.id}
      className={`scroll-mt-24 overflow-hidden rounded-[20px] border border-[var(--color-line-dark)] bg-[var(--color-dark-card)] ${className}`}
    >
      <div
        className={
          v.format === "vertical"
            ? "mx-auto aspect-[9/16] max-w-[220px] bg-[var(--color-dark-card)]"
            : "aspect-video bg-[var(--color-dark-card)]"
        }
      >
        <ClassPlayer v={v} onLocked={scrollToMembership} />
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-2 flex flex-wrap gap-1 sm:mb-3 sm:gap-1.5">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/70 sm:px-3 sm:py-1 sm:text-[11px]">
            {v.durationMinutes} min
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/70 sm:px-3 sm:py-1 sm:text-[11px]">
            {v.level}
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/70 sm:px-3 sm:py-1 sm:text-[11px]">
            {v.style}
          </span>
          {v.isFree && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--color-ink)] sm:px-3 sm:py-1 sm:text-[11px]">
              Free
            </span>
          )}
        </div>
        <h3 className="font-serif text-base text-white sm:text-xl">{v.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-white/55 sm:mt-2 sm:text-sm">{v.description}</p>
      </div>
    </div>
  );
}

export default function Classes() {
  const [level, setLevel] = useState("All");
  const [style, setStyle] = useState("All");
  const [duration, setDuration] = useState(durations[0]);
  const gateSentinelRef = useRef<HTMLDivElement>(null);
  const { isMember } = useMembership();

  const { data } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => (await fetch("/api/classes")).json() as Promise<{ classes: PublicClassVideo[] }>,
  });
  const allVideos = data?.classes ?? [];
  const featured = allVideos.filter((v) => v.featured);
  const styles = Array.from(new Set(allVideos.map((v) => v.style).filter(Boolean)));

  const filtered = useMemo(() => {
    return allVideos.filter((v) => {
      if (level !== "All" && v.level !== level) return false;
      if (style !== "All" && v.style !== style) return false;
      if (duration.min && v.durationMinutes < duration.min) return false;
      if (!duration.min && v.durationMinutes > duration.max) return false;
      return true;
    });
  }, [allVideos, level, style, duration]);

  return (
    <PageShell>
      {/* Header */}
      <section className="bg-white px-5 pb-14 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)]">Class Library</p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)] sm:text-5xl">
            Practice on your <em className="italic">time</em>
          </h1>
          <p className="mt-4 max-w-xl text-[var(--color-ink-soft)]">
            Filter by duration, level, and style, or start with the free vertical series below,
            made for practicing straight from your phone.
          </p>
        </div>
      </section>

      {/* Featured vertical free series — cream tint */}
      <section className="bg-[var(--color-cream)] px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">Grounded Mornings: Free Series</h2>
            <p className="text-sm text-[var(--color-ink-soft)]">Vertical format · Free forever</p>
          </div>
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
            {featured.map((v) => (
              <ClassCard
                key={v.id}
                v={v}
                className="w-[70%] flex-shrink-0 snap-center sm:w-auto sm:flex-shrink"
              />
            ))}
          </div>
        </div>
      </section>

      <div ref={gateSentinelRef} aria-hidden="true" />

      <SignInGate
        sentinelRef={gateSentinelRef}
        headline="Keep practicing with us"
        copy="Create a free account to unlock the full class library."
      >
        {/* Filters */}
        <section className="bg-white px-5 pb-8 pt-14 sm:px-6">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-wrap gap-3">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="rounded-full border border-[var(--color-line)] bg-transparent px-5 py-2.5 text-sm text-[var(--color-ink)]"
              >
                <option value="All">All Levels</option>
                {levels.slice(1).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="rounded-full border border-[var(--color-line)] bg-transparent px-5 py-2.5 text-sm text-[var(--color-ink)]"
              >
                <option value="All">All Styles</option>
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={duration.label}
                onChange={(e) => setDuration(durations.find((d) => d.label === e.target.value)!)}
                className="rounded-full border border-[var(--color-line)] bg-transparent px-5 py-2.5 text-sm text-[var(--color-ink)]"
              >
                {durations.map((d) => (
                  <option key={d.label} value={d.label}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="bg-white px-5 pb-24 sm:px-6">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {filtered.map((v) => (
                <ClassCard key={v.id} v={v} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-16 text-center text-[var(--color-ink-soft)]">No classes match those filters yet.</p>
            )}
          </div>
        </section>

        {!isMember && <MembershipSection />}
      </SignInGate>
    </PageShell>
  );
}
