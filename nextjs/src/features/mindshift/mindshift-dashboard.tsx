"use client";

import { useState } from "react";
import Link from "next/link";
import { StatCard } from "./components/stat-card";
import { PracticeHistory } from "./components/practice-history";
import { ChatPanel } from "./components/chat-panel";
import { TabStrip, type MindShiftTab } from "./components/tab-strip";
import { usePracticeLogs } from "./hooks/use-practice-logs";
import { useSession } from "@/lib/use-session";
import styles from "./mindshift-brand.module.css";

function firstName(session: ReturnType<typeof useSession>["session"]) {
  const meta = session?.user?.user_metadata as { full_name?: string; name?: string } | undefined;
  const fromMetadata = meta?.full_name ?? meta?.name;
  if (fromMetadata) return fromMetadata.split(" ")[0];
  const emailPrefix = session?.user?.email?.split("@")[0];
  return emailPrefix || "there";
}

/**
 * MindShift's four sections (Decisions #4) as a tab strip at the top of /mindshift, styled per
 * the brand guide (Appendix A) and scoped so it can't leak into the rest of the app — see
 * mindshift-brand.module.css. Reads the same practice_logs data as before; no schema changes.
 */
export function MindShiftDashboard() {
  const [tab, setTab] = useState<MindShiftTab>("today");
  const { data } = usePracticeLogs();
  const { session, supabase } = useSession();
  const streaks = data?.streaks ?? { currentStreak: 0, longestStreak: 0, totalDays: 0 };
  const logs = data?.logs ?? [];

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div>
      <div className="max-w-[480px]">
        <TabStrip active={tab} onChange={setTab} />
      </div>

      <div className="mt-8">
        {tab === "today" && (
          <section
            id="mindshift-panel-today"
            role="tabpanel"
            aria-labelledby="mindshift-tab-today"
            className="mx-auto max-w-[480px] space-y-6"
          >
            <h2 className="text-3xl">A little space, {firstName(session)}.</h2>

            <div className="rounded-[20px] p-6" style={{ backgroundColor: "var(--cream)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--clay-ink)" }}>
                Current streak
              </p>
              <p className={`${styles.display} mt-1 text-5xl`} style={{ color: "var(--espresso)" }}>
                {streaks.currentStreak} <span className="text-xl">days</span>
              </p>
              <div className="mt-4 flex gap-1.5" aria-hidden="true">
                {Array.from({ length: 7 }, (_, i) => (
                  <span
                    key={i}
                    className="h-2 flex-1 rounded-full"
                    style={{ backgroundColor: i < Math.min(streaks.currentStreak, 7) ? "var(--rose)" : "var(--hairline)" }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTab("practice")}
              className="w-full rounded-full text-sm font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "var(--teal)", color: "var(--linen)", minHeight: 44 }}
            >
              Begin practice
            </button>
          </section>
        )}

        {tab === "practice" && (
          <section id="mindshift-panel-practice" role="tabpanel" aria-labelledby="mindshift-tab-practice">
            <ChatPanel />
          </section>
        )}

        {tab === "insights" && (
          <section id="mindshift-panel-insights" role="tabpanel" aria-labelledby="mindshift-tab-insights" className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Day Streak" value={streaks.currentStreak} accent />
              <StatCard label="Best Streak" value={streaks.longestStreak} />
              <StatCard label="Total Logged" value={streaks.totalDays} />
            </div>
            <PracticeHistory logs={logs} />
          </section>
        )}

        {tab === "profile" && (
          <section
            id="mindshift-panel-profile"
            role="tabpanel"
            aria-labelledby="mindshift-tab-profile"
            className="mx-auto max-w-[480px] space-y-4"
          >
            <div className="rounded-[20px] p-6" style={{ backgroundColor: "var(--cream)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--clay-ink)" }}>
                Signed in as
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--espresso)" }}>
                {session?.user?.email}
              </p>
            </div>

            <Link
              href="/reminders"
              className="block rounded-full px-5 py-3 text-center text-sm font-semibold"
              style={{ border: "1px solid var(--hairline)", color: "var(--espresso)", minHeight: 44 }}
            >
              Practice reminders
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-widest"
              style={{ border: "1px solid var(--hairline)", color: "var(--muted)", minHeight: 44 }}
            >
              Sign out
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
