"use client";

import { useEffect, useState } from "react";

/**
 * Ported from bali-retreat-embed.html (a one-time static snapshot of
 * bali.html's Hero/Overview/What's included/Gallery/Pricing/Final CTA
 * sections). Itinerary, Stays, Teachers, and Prepare sections are
 * intentionally omitted per spec -- they live only behind "See full page".
 *
 * STOPGAP: this is a static copy, not a live sync. If the source page at
 * BALI_PAGE is edited and republished, this component will NOT reflect
 * those changes until someone updates it by hand. The recommended follow-up
 * is a server-side live-fetch (Next.js API route/server component + cheerio,
 * ISR-revalidated) that pulls and parses the real page at request time --
 * see claude-code-corporate-bali-embed-prompt.md. Not built yet.
 *
 * BALI_ORIGIN is aetherayoga.com (Lisa's Aethera retreat brand), confirmed
 * against bali.html's own og:url metadata -- not a yogawithlisa.ai domain.
 */

const BALI_ORIGIN = "https://aetherayoga.com";
const BALI_PAGE = `${BALI_ORIGIN}/bali.html`;
const BALI_IMAGE_BASE = `${BALI_ORIGIN}/images`;

const WEEKS = [
  {
    label: "Week 1",
    title: "Creator Universe",
    dates: "🗓 April 17 - 23, 2027",
    desc:
      "We will transform the villa into a brand universe: morning routines, wellness rituals, behind-the-scenes moments, and aligned lifestyle content. A week of collaborative content creation alongside fellow creators, entrepreneurs, and global leaders. All meals will be hand prepared by an on-site personal chef.",
    itineraryHref: `${BALI_PAGE}#itinerary-creator`,
  },
  {
    label: "Week 2",
    title: "Aethera Yoga",
    dates: "🗓 April 24 - 30, 2027",
    desc:
      "Nourish mind, body and soul for a week in beautiful Canggu, Bali away from the noise in one of the most tranquil villas in the world. Enjoy daily yoga and meditation classes led by 3 Bali-trained, 500hr certified instructors: Lisa, Sara, and Sandra. All meals will be hand prepared by an on-site personal chef.",
    itineraryHref: `${BALI_PAGE}#itinerary-yoga`,
  },
];

const INCLUDED = [
  "6 nights boutique villa accommodation",
  "Daily yoga, meditation & breathwork sessions",
  "Morning meditation & movement every day",
  "Cacao ceremony & evening rituals",
  "All meals -- fresh, local & plant-rich, prepared by your private chef",
  "Temple & waterfall excursions (Pura Batu Ngaus, Tanah Lot)",
  "Airport transfers to & from Ngurah Rai (DPS)",
  "All ground transportation to planned group excursions",
  "Welcome & closing ceremonies",
  "Access to villa pools, grounds & amenities throughout your stay",
];

const PRICING = [
  {
    label: "Shared Room",
    rows: [
      ["1 Week", "$1,650"],
      ["2 Weeks", "$3,300"],
    ],
  },
  {
    label: "Private Room",
    note: "The whole room to yourself",
    rows: [
      ["1 Week", "$3,300"],
      ["2 Weeks", "$6,600"],
    ],
  },
];

const PAYMENT_LINK = "https://www.paypal.com/ncp/payment/4RPRDYNM3L252";
const APPLY_HREF = `${BALI_PAGE}#apply-modal`;

function testImage(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function resolveSlot(candidates: string[]): Promise<string | null> {
  for (const candidate of candidates) {
    const ok = await testImage(candidate);
    if (ok) return ok;
  }
  return null;
}

/** Ported 1:1 from the source's probing carousel script: tries bali-1..61.jpg (bali-1 may be .jpeg) and only renders the ones that actually load. */
function useBaliGalleryImages() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const slots: string[][] = [[`${BALI_IMAGE_BASE}/bali-1.jpg`, `${BALI_IMAGE_BASE}/bali-1.jpeg`]];
      for (let i = 2; i <= 61; i++) slots.push([`${BALI_IMAGE_BASE}/bali-${i}.jpg`]);
      const results = await Promise.all(slots.map(resolveSlot));
      if (!cancelled) setImages(results.filter((src): src is string => Boolean(src)));
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}

function BaliGallery() {
  const images = useBaliGalleryImages();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  if (images.length === 0) return null;

  function goTo(i: number) {
    setIndex((i + images.length) % images.length);
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex touch-pan-y"
        style={{ transform: `translateX(-${index * 100}%)`, transition: "transform 400ms ease" }}
        onTouchStart={(e) => setStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (startX === null) return;
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) > 50) goTo(dx < 0 ? index + 1 : index - 1);
          setStartX(null);
        }}
      >
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt={`Bali gallery photo ${i + 1}`} className="h-[320px] w-full flex-shrink-0 object-cover sm:h-[420px]" />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-lg text-[var(--color-ink)] shadow hover:bg-white"
          >
            &#8592;
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-lg text-[var(--color-ink)] shadow hover:bg-white"
          >
            &#8594;
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PillLink({
  href,
  children,
  outline = false,
  onDark = false,
}: {
  href: string;
  children: React.ReactNode;
  outline?: boolean;
  onDark?: boolean;
}) {
  const base = "inline-block whitespace-nowrap rounded-full px-[1.6rem] py-[0.6rem] text-[0.9rem] no-underline transition-opacity hover:opacity-90";
  const style = outline
    ? onDark
      ? "border border-white text-white"
      : "border border-[var(--color-ink)] text-[var(--color-ink)]"
    : "bg-[var(--color-ink)] text-white";
  return (
    <a href={href} target="_blank" rel="noopener" className={`${base} ${style}`}>
      {children}
    </a>
  );
}

export function RetreatSessions() {
  return (
    <div className="mx-auto my-8 max-w-[1120px]">
      <div className="rounded-3xl bg-[#f5eee4] px-5 pb-7 pt-7 shadow-[0_20px_45px_rgba(0,0,0,0.05)] md:px-8 md:pb-8 md:pt-10">
        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-xl bg-cover bg-center px-6 py-14 text-center text-white"
          style={{ backgroundImage: "url('/images/retreat/bali-retreat.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
              Bali Retreat April 2027 &middot; Canggu, Indonesia
            </p>
            <h2 className="mb-4 font-serif text-3xl sm:text-4xl">
              Return to
              <br />
              Your Essence
            </h2>
            <p className="mx-auto mb-6 max-w-lg text-sm text-white/75">
              A soul-nourishing yoga retreat in Bali to reconnect with your rhythm, your body, and the beauty of simply being.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <PillLink href={APPLY_HREF}>Apply</PillLink>
              <PillLink href={BALI_PAGE} outline onDark>
                Explore Experience
              </PillLink>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="mt-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#8b6c5c]">A Transformative Escape</p>
          <h2 className="mb-5 font-serif text-2xl text-[var(--color-ink)]">
            Bali
            <br />
            awaits you.
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {WEEKS.map((week) => (
              <div key={week.label} className="rounded-xl bg-white p-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#8b6c5c]">{week.label}</p>
                <h3 className="mb-2 font-serif text-lg text-[var(--color-ink)]">{week.title}</h3>
                <p className="mb-3 text-sm font-medium text-[var(--color-ink)]">{week.dates}</p>
                <p className="mb-4 text-sm text-[var(--color-ink-soft)]">{week.desc}</p>
                <div className="flex flex-wrap gap-2.5">
                  <PillLink href={week.itineraryHref}>Itinerary &rarr;</PillLink>
                  <PillLink href={APPLY_HREF} outline>
                    Apply
                  </PillLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's included */}
        <div className="mt-10 rounded-xl bg-white p-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#8b6c5c]">What&apos;s included</p>
          <h2 className="mb-4 font-serif text-2xl text-[var(--color-ink)]">
            Everything
            <br />
            you need.
          </h2>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-[var(--color-ink-soft)] sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-[#8b6c5c]">
                  &#10003;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Gallery */}
        <div className="mt-10">
          <BaliGallery />
        </div>

        {/* Pricing */}
        <div className="mt-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#8b6c5c]">Investment</p>
          <h2 className="mb-2 font-serif text-2xl text-[var(--color-ink)]">
            Choose your
            <br />
            experience.
          </h2>
          <p className="mb-4 max-w-lg text-sm text-[var(--color-ink-soft)]">
            All prices per person, per stay. Accommodation, all meals and retreat programming included. Choose 1 or 2 weeks.
          </p>
          <p className="mb-5 text-sm font-medium text-[#8b6c5c]">
            Only 10 spots available &middot; Private rooms are limited &middot; Early applicants receive first choice of room type
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PRICING.map((tier) => (
              <div key={tier.label} className="rounded-xl bg-white p-6">
                <p className="mb-1 font-serif text-lg text-[var(--color-ink)]">{tier.label}</p>
                {tier.note && <p className="mb-3 text-xs text-[var(--color-ink-soft)]">{tier.note}</p>}
                {tier.rows.map(([label, amount]) => (
                  <div key={label} className="flex justify-between border-t border-[var(--color-line)] py-2 text-sm">
                    <span className="text-[var(--color-ink-soft)]">{label}</span>
                    <span className="font-semibold text-[var(--color-ink)]">{amount}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-5 max-w-lg rounded-xl border border-[#8b6c5c]/25 bg-[#f2e4e1] p-6">
            <h3 className="mb-2 font-serif text-xl text-[var(--color-ink)]">Payment Plan</h3>
            <p className="mb-3.5 text-sm text-[var(--color-ink-soft)]">
              A 50% non-refundable deposit secures your space. Remaining balance due 60 days before retreat. All sales are final.
            </p>
            <PillLink href={PAYMENT_LINK}>Secure My Spot &rarr;</PillLink>
          </div>
        </div>

        {/* Final CTA */}
        <div
          className="relative mt-10 overflow-hidden rounded-xl bg-cover bg-center px-6 py-12 text-center text-white"
          style={{ backgroundImage: "url('/images/retreat/teachers-hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/60">This is your time</p>
            <h2 className="mb-3 font-serif text-2xl">
              Come home
              <br />
              to you.
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-white/75">
              Step away from the noise and return to what truly matters. Your transformation awaits in Bali.
            </p>
            <PillLink href={APPLY_HREF} outline onDark>
              Apply &rarr;
            </PillLink>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href={BALI_PAGE} target="_blank" rel="noopener" className="text-sm font-semibold text-[var(--color-ink)] underline">
            See full page &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
