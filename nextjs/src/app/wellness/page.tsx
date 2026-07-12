"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { classCatalog } from "@/lib/classes";

const moods = ["Calm", "Energized", "Stressed", "Tired", "Anxious", "Joyful"];
const cyclePhases = [
  { value: "not_tracking", label: "Not tracking" },
  { value: "menstrual", label: "Menstrual" },
  { value: "follicular", label: "Follicular" },
  { value: "ovulation", label: "Ovulation" },
  { value: "luteal", label: "Luteal" },
  { value: "perimenopause", label: "Perimenopause" },
  { value: "menopause", label: "Menopause" },
];

function recommendationFor(checkin: any) {
  const mood = checkin?.mood?.toLowerCase() ?? "";
  const energy = checkin?.energy ?? 3;
  const sleep = checkin?.sleepRating ?? 3;

  let style = "Vinyasa";
  let reason = "A balanced flow to meet you where you are today.";

  if (mood.includes("stressed") || mood.includes("anxious") || sleep <= 2) {
    style = "Restorative";
    reason = "Your check-in suggests you could use some calming down-regulation today.";
  } else if (mood.includes("tired") || energy <= 2) {
    style = "Yin";
    reason = "Lower energy today — a slow, supported Yin practice will meet you gently.";
  } else if (mood.includes("energized") || mood.includes("joyful") || energy >= 4) {
    style = "Power";
    reason = "You've got energy to spare — channel it into a stronger practice.";
  } else if (checkin?.cyclePhase === "menstrual") {
    style = "Restorative";
    reason = "During menstruation, gentle and restorative movement often feels best.";
  }

  const match = classCatalog.find((v) => v.style === style) ?? classCatalog[0];
  return { match, reason };
}

export default function Wellness() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["checkin-today"],
    queryFn: async () => (await fetch("/api/checkins/today")).json(),
  });

  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState(3);
  const [sleepRating, setSleepRating] = useState(3);
  const [cyclePhase, setCyclePhase] = useState("not_tracking");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.checkin) {
      setMood(data.checkin.mood ?? "");
      setEnergy(data.checkin.energy ?? 3);
      setSleepRating(data.checkin.sleepRating ?? 3);
      setCyclePhase(data.checkin.cyclePhase ?? "not_tracking");
      setNotes(data.checkin.notes ?? "");
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, energy, sleepRating, cyclePhase, notes }),
      });
      return res.json();
    },
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["checkin-today"] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const rec = recommendationFor({ mood, energy, sleepRating, cyclePhase });

  return (
    <PageShell>
      <section className="bg-white px-5 pb-10 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)]">Daily Check-in</p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)] sm:text-5xl">
            Wellness <em className="italic">Dashboard</em>
          </h1>
          <p className="mt-4 max-w-xl text-[var(--color-ink-soft)]">
            A quick daily check-in helps MindShift recommend the right practice for how you&apos;re
            actually feeling.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-5 py-16 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Check-in form */}
          <div className="rounded-[20px] bg-[var(--color-dark)] p-8 text-white">
            <h2 className="font-serif text-2xl">How are you today?</h2>

            <div className="mt-7">
              <p className="mb-3 text-sm font-medium text-white/80">Mood</p>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      mood === m ? "border-white bg-white text-[var(--color-ink)]" : "border-white/25 text-white/70"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-2 text-sm font-medium text-white/80">Energy level: {energy}/5</p>
              <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full accent-white" />
            </div>

            <div className="mt-7">
              <p className="mb-2 text-sm font-medium text-white/80">Sleep quality: {sleepRating}/5</p>
              <input type="range" min={1} max={5} value={sleepRating} onChange={(e) => setSleepRating(Number(e.target.value))} className="w-full accent-white" />
            </div>

            <div className="mt-7">
              <p className="mb-2 text-sm font-medium text-white/80">Cycle / menopause tracking</p>
              <select
                value={cyclePhase}
                onChange={(e) => setCyclePhase(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white"
              >
                {cyclePhases.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[var(--color-dark)]">{c.label}</option>
                ))}
              </select>
            </div>

            <div className="mt-7">
              <p className="mb-2 text-sm font-medium text-white/80">Notes (optional)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                placeholder="Anything else going on today..."
              />
            </div>

            <button
              onClick={() => save.mutate()}
              disabled={save.isPending}
              className="mt-8 w-full rounded-full bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {save.isPending ? "Saving..." : saved ? "Saved ✓" : "Save check-in"}
            </button>
          </div>

          {/* Recommendation + integrations */}
          <div className="space-y-6">
            <div className="rounded-[20px] bg-[var(--color-blush)] p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)]">Recommended for you</p>
              <h3 className="mt-3 font-serif text-2xl text-[var(--color-ink)]">{rec.match?.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{rec.reason}</p>
              <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
                {rec.match?.durationMinutes} min · {rec.match?.level} · {rec.match?.style}
              </p>
            </div>

            <div className="rounded-[20px] border border-[var(--color-line)] bg-white p-8">
              <p className="mb-4 text-sm font-semibold text-[var(--color-ink)]">Coming soon: connect your devices</p>
              <div className="space-y-3">
                {["Strava", "Apple Health", "Oura Ring"].map((s) => (
                  <div key={s} className="flex items-center justify-between rounded-2xl bg-[var(--color-cream)] px-4 py-3">
                    <span className="text-sm text-[var(--color-ink)]">{s}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                      Coming soon
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
