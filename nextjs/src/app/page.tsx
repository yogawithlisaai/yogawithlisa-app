import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function Home() {
  return (
    <PageShell heroDark>
      {/* Hero — Lisa's real photo, full bleed */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-[var(--color-dark)]">
        <img src="/brand/hero.jpg" alt="Lisa in practice" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(26,26,26,0.45) 0%, rgba(26,26,26,0.25) 45%, rgba(26,26,26,0.7) 100%)" }}
        />

        <div className="relative z-10 mx-auto max-w-2xl px-6 pt-20 text-center">
          <h1 className="font-serif text-4xl font-medium leading-tight text-white sm:text-5xl md:text-6xl">
            Helping you find <em className="italic">stillness</em> in a loud world.
          </h1>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/classes"
              className="rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-85"
            >
              Start Now
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-white/70 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* Free series — white section */}
      <section className="bg-white px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)]">
                Free · Vertical Series
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[var(--color-ink)] sm:text-4xl">
                Grounded Mornings
              </h2>
              <p className="mt-3 max-w-md text-[var(--color-ink-soft)]">
                A 3-part vertical-format series, made for your phone. Start your day grounded —
                free, always. Download the app to take it with you.
              </p>
            </div>
            <Link href="/classes" className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)] hover:opacity-70">
              View all classes →
            </Link>
          </div>
        </div>
      </section>

      {/* Founder — Lisa's real photo, editorial split */}
      <section className="bg-[var(--color-cream)] px-5 py-24 sm:px-6">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <img src="/images/card-mindshift-default.jpg" alt="Lisa meditating on an outdoor deck" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)]">
              Meet Lisa
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[var(--color-ink)] sm:text-4xl">
              A practice built on <em className="italic">presence</em>, not perfection.
            </h2>
            <p className="mt-5 max-w-md text-[var(--color-ink-soft)]">
              Lisa is a Berkeley-based yoga instructor who believes movement should meet you where
              you are — no rigid shapes, no unattainable poses. Every class, recipe, and check-in
              here is built around one idea: find stillness first, strength follows.
            </p>
            <Link
              href="/book"
              className="mt-8 inline-block rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-85"
            >
              Work with Lisa
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid — dark band, matches the real site's dark testimonial-style section */}
      <section className="bg-[var(--color-dark)] px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-center font-serif text-3xl text-white sm:text-4xl">
            Everything you need, in one <em className="italic">quiet</em> space
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/classes", title: "Classes", desc: "On-demand video library by duration, level, and style." },
              { href: "/recipes", title: "Recipes", desc: "Filterable vegan & gluten-free recipes with real photos." },
              { href: "/mindshift", title: "MindShift", desc: "Log your practice, track streaks, get recommendations." },
              { href: "/wellness", title: "Wellness", desc: "Mood, energy, sleep & cycle tracking with tailored suggestions." },
            ].map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group rounded-[20px] border border-[var(--color-line-dark)] bg-[var(--color-dark-card)] p-8 transition-colors hover:bg-[#2c2c2c]"
              >
                <h3 className="font-serif text-2xl text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{f.desc}</p>
                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                  Explore →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — cream section */}
      <section className="bg-white px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-[var(--color-blush)] px-8 py-16 text-center sm:py-20">
          <h2 className="font-serif text-3xl text-[var(--color-ink)] sm:text-4xl">
            Ready to practice together?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--color-ink-soft)]">
            Book a group class, a private session, or a discovery call — Lisa will meet you where
            you are.
          </p>
          <Link
            href="/book"
            className="mt-9 inline-block rounded-full bg-[var(--color-ink)] px-9 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-85"
          >
            Book with Lisa
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
