"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { classCatalog, type ClassVideo } from "@/lib/classes";

const allVideos = classCatalog;
const featured = allVideos.filter((v) => v.featured);

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const durations = [
  { label: "Any length", max: Infinity },
  { label: "Under 15 min", max: 15 },
  { label: "15-30 min", max: 30 },
  { label: "30+ min", max: Infinity, min: 30 },
] as { label: string; max: number; min?: number }[];
const styles = Array.from(new Set(allVideos.map((v) => v.style)));

function embedUrl(v: ClassVideo) {
  return v.platform === "youtube"
    ? `https://www.youtube.com/embed/${v.videoId}`
    : `https://player.vimeo.com/video/${v.videoId}`;
}

function ClassCard({ v }: { v: ClassVideo }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[var(--color-line-dark)] bg-[var(--color-dark-card)]">
      <div className={v.format === "vertical" ? "mx-auto aspect-[9/16] max-w-[220px] bg-black" : "aspect-video bg-black"}>
        <iframe
          src={embedUrl(v)}
          title={v.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            {v.durationMinutes} min
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            {v.level}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            {v.style}
          </span>
          {v.free && (
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink)]">
              Free
            </span>
          )}
        </div>
        <h3 className="font-serif text-xl text-white">{v.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{v.description}</p>
      </div>
    </div>
  );
}

export default function Classes() {
  const [level, setLevel] = useState("All");
  const [style, setStyle] = useState("All");
  const [duration, setDuration] = useState(durations[0]);

  const filtered = useMemo(() => {
    return allVideos.filter((v) => {
      if (level !== "All" && v.level !== level) return false;
      if (style !== "All" && v.style !== style) return false;
      if (duration.min && v.durationMinutes < duration.min) return false;
      if (!duration.min && v.durationMinutes > duration.max) return false;
      return true;
    });
  }, [level, style, duration]);

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
            Filter by duration, level, and style — or start with the free vertical series below,
            made for practicing straight from your phone.
          </p>
        </div>
      </section>

      {/* Featured vertical free series — cream tint */}
      <section className="bg-[var(--color-cream)] px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">Grounded Mornings — Free Series</h2>
            <p className="text-sm text-[var(--color-ink-soft)]">Vertical format · Free forever</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {featured.map((v) => (
              <ClassCard key={v.id} v={v} />
            ))}
          </div>
        </div>
      </section>

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <ClassCard key={v.id} v={v} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-16 text-center text-[var(--color-ink-soft)]">No classes match those filters yet.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
