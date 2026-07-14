"use client";

import { useMemo, useRef, useState } from "react";

/**
 * Ported from live-group-classes-embed.html (the "Find a Class" section of
 * yogawithlisa.ai's class-schedule.html, extracted for this /book panel).
 * Structure, class data, and behavior (accordion grouping, modal signup,
 * Formspree submit) are faithfully ported from that file. The modal's visual
 * styling is newly designed to match this app's existing form conventions
 * (see sign-in/sign-up/recipes pages) since the source extraction did not
 * include the site-wide CSS that originally styled the modal.
 */

type ClassRow = {
  id: string;
  date: string;
  time: string;
  duration: string;
  className: string;
  instructor: string;
  location: string;
  cta: { type: "modal" } | { type: "link"; href: string };
};

// Rows with a bare "signup.html?class=X" href in the source (no page at that
// path) are treated as modal signups — same as the one row already wired to
// openClassModal(...) directly. Rows linking to an external booking page
// (Sports Basement, Beach Glass, Partiful, Urban Adamah) keep that as a
// real external link. See chat summary for the couple of source-content
// anomalies (duplicate row id, a couple of stale pill anchors) left as-is.
const ROWS: ClassRow[] = [
  { id: "jul30", date: "Thursday, July 30th", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "jul23", date: "Thursday, July 23rd", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "jul16", date: "Thursday, July 16th", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "jul9", date: "Thursday, July 9th", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "jul2", date: "Thursday, July 2nd", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "jun25", date: "Thursday, June 25th", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "jun18", date: "Thursday, June 18th", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "jun12", date: "Thursday, June 12th", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "jun5", date: "Thursday, June 5th", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "may28", date: "Thursday, May 28th", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "may21", date: "Thursday, May 21st", time: "5:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "modal" } },
  { id: "may14", date: "Thursday, May 14th", time: "4:30 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44" } },
  { id: "may9-3pm", date: "Saturday, May 9th", time: "3:00 PM", duration: "60 min", className: "Ashtanga Vinyasa", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "may9-430pm", date: "Saturday, May 9th", time: "4:30 PM", duration: "60 min", className: "Hatha Vinyasa + Sound Bath", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "may7th", date: "Thursday, May 7th", time: "4:30 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44" } },
  { id: "feb13", date: "Friday, Feb 13th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "feb12", date: "Thursday, Feb 12th", time: "12:00 PM", duration: "60 min", className: "Power Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44" } },
  { id: "feb10", date: "Tuesday, Feb 10th", time: "12:00 PM", duration: "60 min", className: "Power Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44" } },
  { id: "feb6", date: "Friday, Feb 6th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "feb5", date: "Thursday, Feb 5th", time: "12:00 PM", duration: "60 min", className: "Power Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44" } },
  { id: "feb3", date: "Tuesday, Feb 3rd", time: "12:00 PM", duration: "60 min", className: "Power Vinyasa Flow", instructor: "Lisa", location: "Sports Basement Berkeley", cta: { type: "link", href: "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44" } },
  { id: "jan30", date: "Friday, Jan 30th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "jan29", date: "Thursday, Jan 29th", time: "12:00 PM", duration: "60 min", className: "Power Vinyasa Flow", instructor: "Lisa", location: "Sportsbasement Berkeley", cta: { type: "link", href: "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44" } },
  { id: "jan27", date: "Tuesday, Jan 27th", time: "12:00 PM", duration: "60 min", className: "Power Vinyasa Flow", instructor: "Lisa", location: "Sportsbasement Berkeley", cta: { type: "link", href: "https://shop.sportsbasement.com/blogs/community-spaces/community-room-1?srsltid=AfmBOop6RwgBJOVRhL-YJSWCV4j3HMgC6K4FyqqtrUtuEIL3VxScBP44" } },
  { id: "jan23", date: "Friday, Jan 23rd", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "jan16", date: "Friday, Jan 16th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "jan9", date: "Friday, Jan 9th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "jan8", date: "Thursday, Jan 8th", time: "7:45 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "jan6", date: "Tuesday, Jan 6th", time: "4:30 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Green Yogi Telegraph", cta: { type: "link", href: "https://partiful.com/e/bMY1KIJ8QG5wCGZ3VtnM" } },
  { id: "jan3", date: "Saturday, Jan 3rd", time: "11:00 AM", duration: "60 min", className: "Beginner Vinyasa Flow", instructor: "Lisa", location: "Urban Adamah Silent Retreat", cta: { type: "link", href: "https://www.urbanadamah.org" } },
  { id: "jan2", date: "Friday, Jan 2nd", time: "11:00 AM", duration: "60 min", className: "Beginner Vinyasa Flow", instructor: "Lisa", location: "Urban Adamah Silent Retreat", cta: { type: "link", href: "https://www.urbanadamah.org" } },
  // Source markup had id="dec13" on both this row and the real Dec 13th row
  // below (a copy-paste bug — invalid duplicate DOM id). Corrected to
  // "dec23" here to match its own content and the "Dec 23" nav pill, which
  // already pointed at "#dec23".
  { id: "dec23", date: "Tuesday, Dec 23rd", time: "11:00 AM", duration: "60 min", className: "Deep Flow", instructor: "Lisa", location: "Hermosa Beach Pier", cta: { type: "link", href: "https://partiful.com/e/1sBlxZltNg9ss1PobRjF" } },
  { id: "dec13", date: "Saturday, Dec 13th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa & Brynn", location: "Green Yogi Berkeley", cta: { type: "link", href: "https://partiful.com/e/2aidGxGBVlRF2Q5FaXpf" } },
  { id: "dec12", date: "Friday, Dec 12th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "dec5", date: "Friday, Dec 5th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "nov28", date: "Friday, Nov 28th", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "nov21", date: "Friday, Nov 21st", time: "1:00 PM", duration: "60 min", className: "Vinyasa Flow", instructor: "Lisa", location: "Beach Glass Hot Yoga & Pilates", cta: { type: "link", href: "https://www.beachglasshyp.com/schedule" } },
  { id: "nov15", date: "Friday, Nov 15th", time: "3:00 PM", duration: "60 min", className: "Center & Flow", instructor: "Lisa & Brynn", location: "Berkeley Ballet Theater", cta: { type: "link", href: "https://partiful.com/e/DHUxfV9lVuVZHBs4idoE" } },
  { id: "oct18", date: "Friday, Oct 18th", time: "5:30 PM", duration: "60 min", className: "Evening Deep Flow", instructor: "Lisa & Brynn", location: "Green Yogi Berkeley", cta: { type: "link", href: "https://partiful.com/e/TCEOyAKeVyFvav9ayY30?" } },
  { id: "sept19", date: "Thursday, Sept 19th", time: "5:30 PM", duration: "60 min", className: "Sunset Flow", instructor: "Lisa & Brynn", location: "Green Yogi Berkeley", cta: { type: "link", href: "https://partiful.com/e/KKvYNm7SQLW4SXslqEhJ" } },
  { id: "aug19", date: "Monday, Aug 19th", time: "5:30 PM", duration: "60 min", className: "Core Restore", instructor: "Lisa", location: "Green Yogi Berkeley", cta: { type: "link", href: "https://partiful.com/e/TCEOyAKeVyFvav9ayY30?" } },
];

type Pill = { label: string; hash: string };

// Verbatim from the source nav — including a couple of stale anchors
// ("Jan 3" points at #jan5, which no row has; "May 9" and "May 7" point at
// ids that don't match either May 9th row or the "may7th" row) left as-is
// per instructions to use the extracted file as source of truth. Flagged
// in the chat summary rather than silently "corrected" here.
const PILLS: Pill[] = [
  { label: "Jul 30", hash: "jul30" },
  { label: "Jul 23", hash: "jul23" },
  { label: "Jul 16", hash: "jul16" },
  { label: "Jul 9", hash: "jul9" },
  { label: "Jul 2", hash: "jul2" },
  { label: "Jun 25", hash: "jun25" },
  { label: "Jun 18", hash: "jun18" },
  { label: "Jun 12", hash: "jun12" },
  { label: "Jun 5", hash: "jun5" },
  { label: "May 28", hash: "may28" },
  { label: "May 21", hash: "may21" },
  { label: "May 14", hash: "may14" },
  { label: "May 9", hash: "may9" },
  { label: "May 7", hash: "may7" },
  { label: "Feb 13", hash: "feb13" },
  { label: "Feb 12", hash: "feb12" },
  { label: "Feb 10", hash: "feb10" },
  { label: "Feb 6", hash: "feb6" },
  { label: "Feb 5", hash: "feb5" },
  { label: "Feb 3", hash: "feb3" },
  { label: "Jan 30", hash: "jan30" },
  { label: "Jan 29", hash: "jan29" },
  { label: "Jan 27", hash: "jan27" },
  { label: "Jan 23", hash: "jan23" },
  { label: "Jan 16", hash: "jan16" },
  { label: "Jan 9", hash: "jan9" },
  { label: "Jan 8", hash: "jan8" },
  { label: "Jan 6", hash: "jan6" },
  { label: "Jan 3", hash: "jan5" },
  { label: "Jan 2", hash: "jan2" },
  { label: "Dec 23", hash: "dec23" },
  { label: "Dec 13", hash: "dec13" },
  { label: "Dec 12", hash: "dec12" },
  { label: "Dec 5", hash: "dec5" },
  { label: "Nov 21", hash: "nov21" },
  { label: "Nov 15", hash: "nov15" },
  { label: "Oct 18", hash: "oct18" },
  { label: "Sept 19", hash: "sept19" },
  { label: "Aug 19", hash: "aug19" },
];

const MONTHS: Record<string, string> = {
  jan: "January", feb: "February", mar: "March", apr: "April",
  may: "May", jun: "June", jul: "July", aug: "August",
  sept: "September", oct: "October", nov: "November", dec: "December",
};
const ORDER = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];

type MonthSection = { label: string; pills: Pill[] };

/** Ported 1:1 from the source's month-accordion script, run at render time via useMemo instead of DOM manipulation. */
function buildSections(pills: Pill[]): MonthSection[] {
  type Group = { abbr: string; name: string; pills: Pill[]; year: number };
  const groups: Group[] = [];
  let current: Group | null = null;
  for (const pill of pills) {
    const match = pill.hash.match(/^[a-z]+/i);
    const abbr = match ? match[0].toLowerCase() : "";
    if (!current || current.abbr !== abbr) {
      current = { abbr, name: MONTHS[abbr] ?? abbr, pills: [], year: 0 };
      groups.push(current);
    }
    current.pills.push(pill);
  }

  const currentYear = new Date().getFullYear();
  let year = currentYear;
  let prevIdx: number | null = null;
  for (const g of groups) {
    const idx = ORDER.indexOf(g.abbr);
    if (prevIdx !== null && idx > prevIdx) year -= 1;
    prevIdx = idx;
    g.year = year;
  }

  const sections: MonthSection[] = [];
  let pastYearSection: (MonthSection & { year: number }) | null = null;
  for (const g of groups) {
    if (g.year < currentYear) {
      if (!pastYearSection || pastYearSection.year !== g.year) {
        pastYearSection = { label: String(g.year), pills: [], year: g.year };
        sections.push(pastYearSection);
      }
      pastYearSection.pills.push(...g.pills);
    } else {
      sections.push({ label: `${g.name} ${g.year}`, pills: g.pills });
      pastYearSection = null;
    }
  }
  return sections;
}

type ActiveClass = { name: string; date: string; time: string; location: string };

const FORMSPREE_URL = "https://formspree.io/f/xnjrzzro";

export function LiveGroupClasses() {
  const sections = useMemo(() => buildSections(PILLS), []);
  const [openSections, setOpenSections] = useState<Set<number>>(() => new Set([0]));
  const [activeClass, setActiveClass] = useState<ActiveClass | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function toggleSection(i: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

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
    data._subject = "New Class Signup - Yoga with Lisa";

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
            Join us in person to sweat, glow and grow. Designed to lift your body and your mood. All times are in Pacific Time.
          </p>

          <nav aria-label="Upcoming dates" className="mt-2">
            {sections.map((section, i) => {
              const open = openSections.has(i);
              const headerId = `month-header-${i}`;
              const panelId = `month-panel-${i}`;
              return (
                <div key={section.label} className="mb-[0.6rem] overflow-hidden rounded-xl border border-black bg-transparent">
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggleSection(i)}
                    className="flex min-h-12 w-full items-center justify-between gap-3 bg-[var(--color-ink)] px-[1.1rem] py-3 text-left text-[0.95rem] font-semibold tracking-[0.02em] text-white transition-colors hover:bg-[#2a2a2a]"
                  >
                    <span>{section.label}</span>
                    <svg
                      className={`h-[1.1em] w-[1.1em] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open && (
                    <div id={panelId} role="region" aria-labelledby={headerId} className="px-[1.1rem] pb-[1.05rem] pt-[0.9rem]">
                      <div className="flex flex-wrap gap-3 text-[0.9rem]">
                        {section.pills.map((pill) => (
                          <a
                            key={pill.hash}
                            href={`#${pill.hash}`}
                            className="rounded-full border border-[var(--color-ink)] bg-[var(--color-ink)] px-[0.95rem] py-[0.35rem] text-white no-underline transition-colors duration-[180ms] hover:border-[#8b6c5c] hover:bg-[#8b6c5c] hover:text-white"
                          >
                            {pill.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
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
                  {row.cta.type === "modal" ? (
                    <button
                      type="button"
                      onClick={() => openClassModal(row)}
                      className="inline-block whitespace-nowrap rounded-full bg-[var(--color-ink)] px-[1.6rem] py-[0.6rem] text-[0.9rem] lowercase text-white transition-opacity hover:opacity-90"
                    >
                      join
                    </button>
                  ) : (
                    <a
                      href={row.cta.href}
                      target="_blank"
                      rel="noopener"
                      className="inline-block whitespace-nowrap rounded-full bg-[var(--color-ink)] px-[1.6rem] py-[0.6rem] text-[0.9rem] lowercase text-white transition-opacity hover:opacity-90"
                    >
                      join
                    </a>
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
                  I understand that yoga involves physical activity and I participate at my own risk. I release Yoga with Lisa, Lisa Eshun-Wilson, and their associates from any liability for injury or damages.
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
                  I consent to being photographed or filmed during class for use on the Yoga with Lisa website
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
