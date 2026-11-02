"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { postJson } from "@/lib/fetch-json";

export default function EmailPreferences() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["email-preferences"],
    queryFn: async () => (await fetch("/api/email-preferences")).json(),
  });

  const [emailOptOut, setEmailOptOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (data) setEmailOptOut(Boolean(data.emailOptOut));
  }, [data]);

  const save = useMutation({
    mutationFn: (next: boolean) => postJson("/api/email-preferences", { emailOptOut: next }),
    onSuccess: (_, next) => {
      setEmailOptOut(next);
      setSaved(true);
      setSaveError(null);
      qc.invalidateQueries({ queryKey: ["email-preferences"] });
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err: Error) => {
      setSaveError(err.message);
    },
  });

  return (
    <PageShell>
      <section className="bg-white px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-soft)]">
            Your account
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)]">
            Email <em className="italic">preferences</em>
          </h1>
          <p className="mt-4 text-[var(--color-ink-soft)]">
            Choose whether you'd like to hear from us by email. Account emails — like password
            resets — will always be sent regardless of this setting.
          </p>

          <div className="mt-9 rounded-[20px] border border-[var(--color-line)] p-8">
            <label className="flex items-start gap-3 rounded-2xl bg-[var(--color-cream)] p-4">
              <input
                type="checkbox"
                checked={!emailOptOut}
                onChange={(e) => save.mutate(!e.target.checked)}
                disabled={save.isPending}
                className="mt-1 h-4 w-4 accent-[var(--color-ink)]"
              />
              <span className="text-sm text-[var(--color-ink-soft)]">
                <span className="font-semibold text-[var(--color-ink)]">
                  Yes, send me occasional emails
                </span>{" "}
                from Yoga with Lisa Rose, like welcome messages and product updates.
              </span>
            </label>

            {saved && <p className="mt-4 text-sm text-[var(--color-ink-soft)]">Saved ✓</p>}
            {saveError && <p className="mt-4 text-sm text-[#a4453a]">{saveError}</p>}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
