"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";

export default function Reminders() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["reminders-optin"],
    queryFn: async () => (await fetch("/api/reminders")).json(),
  });

  const [phone, setPhone] = useState("");
  const [optedIn, setOptedIn] = useState(false);
  const [preferredTime, setPreferredTime] = useState("18:00");
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (data?.optin) {
      setPhone(data.optin.phone ?? "");
      setOptedIn(!!data.optin.optedIn);
      setPreferredTime(data.optin.preferredTime ?? "18:00");
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, optedIn, preferredTime }),
      });
      return res.json();
    },
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["reminders-optin"] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const sendTest = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reminders/test", { method: "POST" });
      if (!res.ok) throw new Error("failed");
      return res.json();
    },
    onSuccess: (data: any) => {
      setTestResult(data.simulated ? "Simulated (no Twilio credentials set yet). Check server logs." : "Sent!");
      setTimeout(() => setTestResult(null), 4000);
    },
    onError: () => {
      setTestResult("Couldn't send. Make sure you're opted in with a phone number saved.");
    },
  });

  return (
    <PageShell>
      <section className="bg-[var(--color-dark)] px-5 pb-16 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Stay Consistent</p>
          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Daily <em className="italic">Reminders</em>
          </h1>
          <p className="mt-4 text-white/60">
            Opt in to a daily SMS nudging you to log your practice or check in. You can turn this
            off any time.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-[20px] border border-[var(--color-line)] p-8">
          <label className="flex items-start gap-3 rounded-2xl bg-[var(--color-cream)] p-4">
            <input
              type="checkbox"
              checked={optedIn}
              onChange={(e) => setOptedIn(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-ink)]"
            />
            <span className="text-sm text-[var(--color-ink-soft)]">
              <span className="font-semibold text-[var(--color-ink)]">Yes, text me daily reminders.</span>{" "}
              I agree to receive automated SMS messages from Yoga with Lisa at the number below.
              Message &amp; data rates may apply. Reply STOP at any time to opt out.
            </span>
          </label>

          <div className="mt-7">
            <p className="mb-2 text-sm font-medium text-[var(--color-ink)]">Phone number</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 123 4567"
              className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-2.5 text-sm text-[var(--color-ink)]"
            />
          </div>

          {/* Time picker hidden while reminders run on a single daily cron (Vercel Hobby plan).
              preferredTime is still stored/sent so per-user times can return with an hourly scheduler. */}
          <p className="mt-7 rounded-2xl bg-[var(--color-cream)] px-4 py-3 text-sm text-[var(--color-ink-soft)]">
            Reminders go out once daily, around 11am PT / 2pm ET.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => save.mutate()}
              disabled={save.isPending}
              className="rounded-full bg-[var(--color-ink)] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-60"
            >
              {save.isPending ? "Saving..." : saved ? "Saved ✓" : "Save preferences"}
            </button>
            <button
              onClick={() => sendTest.mutate()}
              disabled={sendTest.isPending}
              className="rounded-full border border-[var(--color-line)] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-cream)]"
            >
              Send test reminder
            </button>
          </div>
          {testResult && <p className="mt-4 text-sm text-[var(--color-ink-soft)]">{testResult}</p>}

          <p className="mt-7 text-xs text-[var(--color-ink-soft)]">
            SMS is sent via Twilio. Until real Twilio credentials are added to the server
            environment, test reminders are simulated (logged, not actually sent). See the README
            for setup.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
