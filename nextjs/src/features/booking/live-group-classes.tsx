"use client";

import { useRef, useState } from "react";

/**
 * The "Find a Class" panel on /book. Schedule is hand-maintained in ROWS
 * below — update it directly when Lisa's schedule changes. The signup
 * modal (Formspree) is kept for any future class that needs an in-house
 * RSVP; nothing currently uses it, since every row below links out to the
 * studio's own booking flow or is a restricted-audience session with no
 * signup link at all.
 */

type ClassRow = {
  id: string;
  date: string;
  time: string;
  duration: string;
  className: string;
  instructor: string;
  location: string;
  cta: { type: "modal" } | { type: "link"; href: string } | { type: "text"; label: string };
};

const SPORTS_BASEMENT_URL =
  "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44";

// Updated 2026-10-20. Sports Basement dates skip Nov 5 (traveling), Nov 26
// (Thanksgiving), Dec 24 and Dec 31 (holidays).
const ROWS: ClassRow[] = [
  { id: "sb-oct22", date: "Thursday, October 22nd", time: "5:00 PM PT", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: SPORTS_BASEMENT_URL } },
  { id: "sb-oct29", date: "Thursday, October 29th", time: "5:00 PM PT", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: SPORTS_BASEMENT_URL } },
  { id: "sb-nov12", date: "Thursday, November 12th", time: "5:00 PM PT", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: SPORTS_BASEMENT_URL } },
  { id: "sb-nov19", date: "Thursday, November 19th", time: "5:00 PM PT", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: SPORTS_BASEMENT_URL } },
  { id: "sb-dec3", date: "Thursday, December 3rd", time: "5:00 PM PT", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: SPORTS_BASEMENT_URL } },
  { id: "sb-dec10", date: "Thursday, December 10th", time: "5:00 PM PT", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: SPORTS_BASEMENT_URL } },
  { id: "sb-dec17", date: "Thursday, December 17th", time: "5:00 PM PT", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: SPORTS_BASEMENT_URL } },

  // First-Saturday donation-based pop-up. Nov 7 skipped.
  { id: "tantara-dec5", date: "Saturday, December 5th", time: "10:30 AM PT", duration: "1 hr", className: "Movement & Matcha", instructor: "Lisa", location: "Tantara SF, 914 Pacific Ave, San Francisco, CA 94133 (donation-based)", cta: { type: "link", href: "https://partiful.com/e/6U7Uw5wj8zEFg3BcEH2W?c=uajtumqh" } },

  // Grinnell College — hosted by SHAW, restricted audiences, no public signup link.
  { id: "grinnell-nov6", date: "Friday, November 6th", time: "4:15 PM CT", duration: "—", className: "Practice + Career Q&A", instructor: "Lisa", location: "Main 1st Lounge, Grinnell College, Grinnell, IA — hosted by SHAW", cta: { type: "text", label: "Grinnell students, open to all" } },
  { id: "grinnell-nov7", date: "Saturday, November 7th", time: "9:00 AM CT", duration: "—", className: "Practice", instructor: "Lisa", location: "Bear Multipurpose Dance Studio P103, Grinnell College, Grinnell, IA — hosted by SHAW", cta: { type: "text", label: "Grinnell Staff/Faculty, open to all" } },

  // One-off substitute sessions at Green Yogi Telegraph, each individually
  // confirmed by the studio — NOT a recurring weekly class. Do not extend
  // this list by day-of-week; anything after Nov 2 is on the studio's own
  // schedule (booking link below), not here.
  { id: "gy-oct21", date: "Wednesday, October 21st", time: "12:00 PM PT", duration: "60 min", className: "Flow + Fit (sub)", instructor: "Lisa", location: "Green Yogi Telegraph, 2807 Telegraph Ave, Berkeley, CA 94705 — Peacock Room", cta: { type: "link", href: "https://www.mygreenyogi.com/schedule" } },
  { id: "gy-oct22", date: "Thursday, October 22nd", time: "7:30 PM PT", duration: "50 min", className: "Restorative (sub)", instructor: "Lisa", location: "Green Yogi Telegraph, 2807 Telegraph Ave, Berkeley, CA 94705 — Peacock Room", cta: { type: "link", href: "https://www.mygreenyogi.com/schedule" } },
  { id: "gy-oct26", date: "Monday, October 26th", time: "12:00 PM PT", duration: "60 min", className: "Flow + Fit (sub)", instructor: "Lisa", location: "Green Yogi Telegraph, 2807 Telegraph Ave, Berkeley, CA 94705 — Peacock Room", cta: { type: "link", href: "https://www.mygreenyogi.com/schedule" } },
  { id: "gy-oct28", date: "Wednesday, October 28th", time: "12:00 PM PT", duration: "60 min", className: "Flow + Fit (sub)", instructor: "Lisa", location: "Green Yogi Telegraph, 2807 Telegraph Ave, Berkeley, CA 94705 — Peacock Room", cta: { type: "link", href: "https://www.mygreenyogi.com/schedule" } },
  { id: "gy-oct29", date: "Thursday, October 29th", time: "7:30 PM PT", duration: "50 min", className: "Restorative (sub)", instructor: "Lisa", location: "Green Yogi Telegraph, 2807 Telegraph Ave, Berkeley, CA 94705 — Peacock Room", cta: { type: "link", href: "https://www.mygreenyogi.com/schedule" } },
  { id: "gy-nov2", date: "Monday, November 2nd", time: "12:00 PM PT", duration: "60 min", className: "Flow + Fit (sub)", instructor: "Lisa", location: "Green Yogi Telegraph, 2807 Telegraph Ave, Berkeley, CA 94705 — Peacock Room", cta: { type: "link", href: "https://www.mygreenyogi.com/schedule" } },
];

type ActiveClass = { name: string; date: string; time: string; location: string };

const FORMSPREE_URL = "https://formspree.io/f/xnjrzzro";

export function LiveGroupClasses() {
  const [activeClass, setActiveClass] = useState<ActiveClass | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function openClassModal(row: ClassRow) {
    setActiveClass({ name: row.className, date: row.date, time: row.time, location: row.location });
    setSubmitState("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current || !activeClass) return;
    const formData = new FormData(formRef.current);
    const data: Record<string, string> = Object.fromEntries(formData.entries()) as Record<string, string>;
    data.class_name = activeClass.name;
    data.class_date = activeClass.date;
    data.class_time = activeClass.time;
    data.class_location = activeClass.location;
    data._replyto = data.email;
    data._subject = "New Class Signup - Yoga with Lisa Rose";

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitState(res.ok ? "success" : "error");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <div className="mx-auto my-8 max-w-[1120px]">
      <div className="rounded-3xl bg-[#f5eee4] px-5 pb-7 pt-7 shadow-[0_20px_45px_rgba(0,0,0,0.05)] md:px-8 md:pb-8 md:pt-10">
        <header className="mb-7">
          <h2 className="mb-2 font-serif text-[2rem] text-[var(--color-ink)]">Find a Class</h2>
          <p className="mb-4 max-w-[640px] text-[0.95rem] leading-[1.5] text-[var(--color-ink-soft)]">
            Join us in person to sweat, glow and grow. Designed to lift your body and your mood. Times are in
            Pacific Time unless noted.
          </p>
        </header>

        <div className="mb-3 text-[0.8rem] uppercase tracking-[0.12em] text-[#555]">Upcoming Classes</div>

        <table className="w-full border-collapse text-[0.95rem]" aria-label="In-person yoga schedule">
          <thead className="hidden md:table-header-group">
            <tr>
              <th scope="col" className="border-b border-[#ddd] p-3 text-left text-[0.8rem] font-semibold uppercase tracking-[0.1em]">Date</th>
              <th scope="col" className="border-b border-[#ddd] p-3 text-left text-[0.8rem] font-semibold uppercase tracking-[0.1em]">Time</th>
              <th scope="col" className="border-b border-[#ddd] p-3 text-left text-[0.8rem] font-semibold uppercase tracking-[0.1em]">Duration</th>
              <th scope="col" className="border-b border-[#ddd] p-3 text-left text-[0.8rem] font-semibold uppercase tracking-[0.1em]">Class</th>
              <th scope="col" className="border-b border-[#ddd] p-3 text-left text-[0.8rem] font-semibold uppercase tracking-[0.1em]">Instructor</th>
              <th scope="col" className="border-b border-[#ddd] p-3 text-left text-[0.8rem] font-semibold uppercase tracking-[0.1em]">Location</th>
              <th scope="col" className="w-[120px] border-b border-[#ddd] p-3 text-right text-[0.8rem] font-semibold uppercase tracking-[0.1em]">Sign Up</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {ROWS.map((row) => (
              <tr key={row.id} id={row.id} className="mb-3 block border-b border-[#eee] pb-3 md:mb-0 md:table-row md:border-b md:pb-0">
                <td className="block whitespace-nowrap py-1 md:table-cell md:p-3">{row.date}</td>
                <td className="block whitespace-nowrap py-1 md:table-cell md:p-3">{row.time}</td>
                <td className="block whitespace-nowrap py-1 md:table-cell md:p-3">{row.duration}</td>
                <td className="block py-1 md:table-cell md:p-3">{row.className}</td>
                <td className="block py-1 md:table-cell md:p-3">{row.instructor}</td>
                <td className="block py-1 md:table-cell md:p-3">{row.location}</td>
                <td className="mt-2 block w-full text-left md:mt-0 md:table-cell md:w-[120px] md:p-3 md:text-right">
                  {row.cta.type === "modal" && (
                    <button
                      type="button"
                      onClick={() => openClassModal(row)}
                      className="inline-block whitespace-nowrap rounded-full bg-[var(--color-ink)] px-[1.6rem] py-[0.6rem] text-[0.9rem] lowercase text-white transition-opacity hover:opacity-90"
                    >
                      join
                    </button>
                  )}
                  {row.cta.type === "link" && (
                    <a
                      href={row.cta.href}
                      target="_blank"
                      rel="noopener"
                      className="inline-block whitespace-nowrap rounded-full bg-[var(--color-ink)] px-[1.6rem] py-[0.6rem] text-[0.9rem] lowercase text-white transition-opacity hover:opacity-90"
                    >
                      join
                    </a>
                  )}
                  {row.cta.type === "text" && (
                    <span className="inline-block text-[0.85rem] text-[var(--color-ink-soft)] md:text-right">
                      {row.cta.label}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setActiveClass(null)}>
          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-[20px] bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-xl text-[var(--color-ink)]">
                {activeClass.name} - {activeClass.date} at {activeClass.time}
              </h2>
              <button
                type="button"
                onClick={() => setActiveClass(null)}
                aria-label="Close"
                className="text-2xl leading-none text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                &times;
              </button>
            </div>

            {submitState === "success" ? (
              <p className="mt-6 text-sm text-[var(--color-ink)]">✓ You&apos;re registered! Check your email for confirmation.</p>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="f-name" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Full Name</label>
                  <input id="f-name" name="name" type="text" required className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)]" />
                </div>
                <div>
                  <label htmlFor="f-email" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Email Address</label>
                  <input id="f-email" name="email" type="email" required className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)]" />
                </div>
                <div>
                  <label htmlFor="f-notes" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Health Notes / Comments</label>
                  <textarea
                    id="f-notes"
                    name="comments"
                    rows={3}
                    placeholder="e.g. I have knee pain, I have lower back pain, I'd like to share my emergency contact info, or any other notes for your instructor"
                    className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]"
                  />
                </div>

                <p className="text-xs leading-relaxed text-[var(--color-ink-soft)]">
                  I understand that yoga involves physical activity and I participate at my own risk. I release Yoga with Lisa Rose, Lisa Eshun-Wilson, and their associates from any liability for injury or damages.
                </p>

                <label className="flex items-start gap-2 text-sm text-[var(--color-ink-soft)]">
                  <input type="checkbox" name="liability_waiver" required className="mt-1 h-4 w-4 accent-[var(--color-ink)]" />
                  I agree to the liability waiver
                </label>
                <label className="flex items-start gap-2 text-sm text-[var(--color-ink-soft)]">
                  <input type="checkbox" name="consent_adjustments" className="mt-1 h-4 w-4 accent-[var(--color-ink)]" />
                  I consent to hands-on adjustments during class
                </label>
                <label className="flex items-start gap-2 text-sm text-[var(--color-ink-soft)]">
                  <input type="checkbox" name="consent_media" className="mt-1 h-4 w-4 accent-[var(--color-ink)]" />
                  I consent to being photographed or filmed during class for use on the Yoga with Lisa Rose website
                </label>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90"
                >
                  Reserve My Spot
                </button>

                {submitState === "error" && (
                  <p className="text-sm text-[#a4453a]">
                    Something went wrong. Please email{" "}
                    <a href="mailto:contact@yogawithlisa.ai" className="underline">contact@yogawithlisa.ai</a> directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
