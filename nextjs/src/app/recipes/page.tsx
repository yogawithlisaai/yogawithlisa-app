"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import recipesData from "@/data/recipes.json";

type Recipe = {
  id: string;
  title: string;
  photo: string;
  tags: string[];
  description: string;
  ingredients: string[];
  steps: string[];
};

const recipes = recipesData as Recipe[];
const allTags = Array.from(new Set(recipes.flatMap((r) => r.tags))).sort();

export default function Recipes() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [open, setOpen] = useState<Recipe | null>(null);

  const filtered = useMemo(() => {
    if (activeTags.length === 0) return recipes;
    return recipes.filter((r) => activeTags.every((t) => r.tags.includes(t)));
  }, [activeTags]);

  function toggleTag(tag: string) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <PageShell>
      <section className="bg-white px-5 pb-10 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)]">Nourishment</p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)] sm:text-5xl">
            Recipes from the <em className="italic">community</em>
          </h1>
          <p className="mt-4 max-w-xl text-[var(--color-ink-soft)]">
            Simple, vegan and gluten-free recipes to fuel your practice. Filter by what matters to you.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide capitalize transition-colors ${
                  activeTags.includes(tag)
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                    : "border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]/40"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-5 py-20 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setOpen(r)}
                className="group overflow-hidden rounded-[20px] bg-white text-left transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={r.photo} alt={r.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {r.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full bg-[var(--color-blush)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide capitalize text-[var(--color-terracotta)]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-serif text-xl text-[var(--color-ink)]">{r.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-ink-soft)]">{r.description}</p>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-16 text-center text-[var(--color-ink-soft)]">No recipes match those filters yet.</p>
          )}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[20px] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={open.photo} alt={open.title} className="aspect-[16/9] w-full object-cover" />
            <div className="p-8">
              <button onClick={() => setOpen(null)} className="float-right text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
                Close ✕
              </button>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {open.tags.map((t) => (
                  <span key={t} className="rounded-full bg-[var(--color-blush)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide capitalize text-[var(--color-terracotta)]">
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">{open.title}</h2>
              <p className="mt-2 text-[var(--color-ink-soft)]">{open.description}</p>

              <h3 className="mt-8 font-serif text-lg text-[var(--color-ink)]">Ingredients</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-ink-soft)]">
                {open.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>

              <h3 className="mt-8 font-serif text-lg text-[var(--color-ink)]">Steps</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--color-ink-soft)]">
                {open.steps.map((s, idx) => <li key={idx}>{s}</li>)}
              </ol>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
