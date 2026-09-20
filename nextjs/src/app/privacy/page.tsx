import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import {
  privacyPolicyIntro,
  privacyPolicyLastUpdated,
  privacyPolicySections,
  type PrivacyPolicySection,
  type PrivacyPolicySubsection,
} from "@/content/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy | Yoga with Lisa",
  description: "How Yoga with Lisa collects, uses, and protects your information.",
  alternates: {
    // The marketing site's copy is the canonical version of this policy.
    canonical: "https://www.yogawithlisa.ai/privacy.html",
  },
};

function Blocks({ blocks }: { blocks: PrivacyPolicySection["blocks"] }) {
  return (
    <>
      {blocks?.map((block, i) =>
        block.type === "paragraph" ? (
          <p key={i} className="mt-4 leading-relaxed text-[var(--color-ink-soft)]">
            {block.lead && <strong className="text-[var(--color-ink)]">{block.lead} </strong>}
            {block.text}
          </p>
        ) : (
          <ul key={i} className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--color-ink-soft)]">
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

function Section({ section }: { section: PrivacyPolicySection }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-[var(--color-ink)]">{section.heading}</h2>
      <Blocks blocks={section.blocks} />
      {section.subsections?.map((sub: PrivacyPolicySubsection) => (
        <div key={sub.heading} className="mt-8">
          <h3 className="font-serif text-xl text-[var(--color-ink)]">{sub.heading}</h3>
          <Blocks blocks={sub.blocks} />
        </div>
      ))}
    </div>
  );
}

export default function Privacy() {
  return (
    <PageShell>
      <section className="bg-white px-5 pb-24 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-[720px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)]">
            Legal
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)] sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-[var(--color-ink-soft)]">Effective Date: {privacyPolicyLastUpdated}</p>
          <p className="mt-8 leading-relaxed text-[var(--color-ink-soft)]">{privacyPolicyIntro}</p>

          <div className="mt-4 space-y-10">
            {privacyPolicySections.map((section) => (
              <Section key={section.heading} section={section} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
