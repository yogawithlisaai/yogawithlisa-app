/**
 * Ported from corporate-wellness-embed.html (a one-time static snapshot of
 * corporate-wellness.html's Benefits/Programs/How it works/Pricing/Contact
 * sections). Hero, intro, nav, and footer are intentionally omitted per spec.
 *
 * STOPGAP: this is a static copy, not a live sync. If the source page at
 * CORPORATE_URL is edited and republished, this component will NOT reflect
 * those changes until someone updates it by hand. The recommended follow-up
 * is a server-side live-fetch (Next.js API route/server component + cheerio,
 * ISR-revalidated) that pulls and parses the real page at request time --
 * see claude-code-corporate-bali-embed-prompt.md. Not built yet.
 */

const CORPORATE_URL = "https://corporate.yogawithlisa.ai";
const CONTACT_MAILTO = "mailto:contact@yogawithlisa.ai?subject=Corporate%20Wellness%20Inquiry";

const BENEFITS = [
  { title: "Less Stress", desc: "Short guided resets to downshift the nervous system." },
  { title: "More Energy", desc: "Movement snacks that counter sitting & screen time." },
  { title: "Team Cohesion", desc: "Optional live sessions to build culture & connection." },
  { title: "Turn-key Setup", desc: "We handle onboarding, comms, and ongoing support." },
];

const PROGRAMS = [
  {
    title: "Corporate / Staff Package",
    image: `${CORPORATE_URL}/images/corporate-staff.jpg`,
    description:
      "Weekly live or on-demand yoga + mindfulness with optional strength add-ons. Access to the full class library, monthly wellness prompts, and team challenges. Great for departments or company-wide.",
    bullets: [
      "All-levels yoga & mobility",
      "Guided breathwork & meditation",
      "Optional live Zoom sessions",
      "Onboarding kit & comms templates",
    ],
    packagesHref: `${CORPORATE_URL}/corporate-packages.html`,
  },
  {
    title: "Student / Grad Package",
    image: `${CORPORATE_URL}/images/student-grad.jpg`,
    description:
      "Designed for academic schedules: shorter modules, exam-week de-stress flows, and study breaks. Student pricing, .edu perks, and group options for labs, teams, & clubs.",
    bullets: [
      "Cycle-aware & recovery-friendly options",
      "Focus & sleep meditations",
      ".edu discounts & group rates",
      "Fast setup for departments & orgs",
    ],
    packagesHref: `${CORPORATE_URL}/student-wellness.html`,
  },
];

const HOW_IT_WORKS = [
  { title: "1) Quick intake", desc: "Share team size, schedule preferences, and goals." },
  { title: "2) Program setup", desc: "We tailor a calendar + access: on-demand library and optional live sessions." },
  { title: "3) Rollout & support", desc: "We provide comms templates, check-ins, and usage tips to boost adoption." },
];

function PillButton({ href, children, outline = false }: { href: string; children: React.ReactNode; outline?: boolean }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener"}
      className={
        outline
          ? "inline-block whitespace-nowrap rounded-full border border-white px-[1.6rem] py-[0.6rem] text-[0.9rem] text-white no-underline transition-opacity hover:opacity-90"
          : "inline-block whitespace-nowrap rounded-full bg-[var(--color-ink)] px-[1.6rem] py-[0.6rem] text-[0.9rem] text-white no-underline transition-opacity hover:opacity-90"
      }
    >
      {children}
    </a>
  );
}

export function CorporateWellness() {
  return (
    <div className="mx-auto my-8 max-w-[1120px]">
      <div className="rounded-3xl bg-[#f5eee4] px-5 pb-7 pt-7 shadow-[0_20px_45px_rgba(0,0,0,0.05)] md:px-8 md:pb-8 md:pt-10">
        {/* Benefits strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-xl bg-white p-5">
              <h3 className="mb-1.5 font-serif text-lg text-[var(--color-ink)]">{b.title}</h3>
              <p className="text-sm text-[var(--color-ink-soft)]">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Programs */}
        <div className="mt-10">
          <h2 className="mb-5 text-center font-serif text-2xl text-[var(--color-ink)]">Programs</h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {PROGRAMS.map((p) => (
              <article key={p.title} className="overflow-hidden rounded-xl bg-white">
                <div className="h-[200px] bg-cover bg-center" style={{ backgroundImage: `url('${p.image}')` }} />
                <div className="p-5">
                  <h3 className="mb-2 font-serif text-lg text-[var(--color-ink)]">{p.title}</h3>
                  <p className="mb-3 text-sm text-[var(--color-ink-soft)]">{p.description}</p>
                  <ul className="mb-4 list-disc space-y-1 pl-[18px] text-sm text-[var(--color-ink-soft)]">
                    {p.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2.5">
                    <PillButton href={p.packagesHref}>View Packages</PillButton>
                    <PillButton href={CONTACT_MAILTO}>Work With Me</PillButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-10">
          <h2 className="mb-5 text-center font-serif text-2xl text-[var(--color-ink)]">How it works</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.title} className="rounded-xl bg-white p-5">
                <h3 className="mb-1.5 font-serif text-base text-[var(--color-ink)]">{step.title}</h3>
                <p className="text-sm text-[var(--color-ink-soft)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing examples */}
        <div className="mt-10 rounded-xl border border-[var(--color-line)] bg-white p-6">
          <h3 className="mb-2 font-serif text-lg text-[var(--color-ink)]">Pricing examples</h3>
          <p className="mb-2 text-sm text-[var(--color-ink-soft)]">Cohorts &amp; orgs vary, but ballparks help planning:</p>
          <ul className="list-disc space-y-1 pl-[18px] text-sm text-[var(--color-ink-soft)]">
            <li><strong className="text-[var(--color-ink)]">Team license:</strong> tiered per-seat or flat monthly for 25-250 seats</li>
            <li><strong className="text-[var(--color-ink)]">Campus groups:</strong> discounted .edu pricing + multi-group bundles</li>
            <li><strong className="text-[var(--color-ink)]">Add-ons:</strong> live sessions, private events, custom challenges</li>
          </ul>
          <p className="mt-3.5 text-sm text-[var(--color-ink)]">
            Ready to scope?{" "}
            <a href={CONTACT_MAILTO} className="underline">Email me today</a>.
          </p>
        </div>

        {/* Membership invite band */}
        <div
          className="relative mt-10 overflow-hidden rounded-xl bg-cover bg-center px-6 py-12 text-center"
          style={{ backgroundImage: `url('${CORPORATE_URL}/images/corporate-band.jpg')` }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative">
            <h2 className="mb-2 font-serif text-2xl text-white">Bring wellness to your workplace or campus</h2>
            <p className="mb-5 text-sm text-white/85">
              Flexible plans, fast setup, real results. Let&apos;s design a program that fits your people.
            </p>
            <PillButton href={CONTACT_MAILTO} outline>Request a Quote</PillButton>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-10 rounded-xl border border-[var(--color-line)] bg-white p-6">
          <h2 className="mb-2 font-serif text-xl text-[var(--color-ink)]">Contact</h2>
          <p className="mb-4 text-sm text-[var(--color-ink-soft)]">
            Tell us about your team or department, ideal start date, and any goals or constraints. We&apos;ll reply with options within 1-2 business days.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <PillButton href={CONTACT_MAILTO}>Email Us</PillButton>
            <a
              href={`${CORPORATE_URL}/login.html`}
              target="_blank"
              rel="noopener"
              className="inline-block whitespace-nowrap rounded-full border border-[var(--color-ink)] px-[1.6rem] py-[0.6rem] text-[0.9rem] text-[var(--color-ink)] no-underline transition-opacity hover:opacity-90"
            >
              Preview Membership
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href={CORPORATE_URL} target="_blank" rel="noopener" className="text-sm font-semibold text-[var(--color-ink)] underline">
            See full page &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
