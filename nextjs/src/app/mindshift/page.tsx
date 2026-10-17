"use client";

import { useRef } from "react";
import { PageShell } from "@/components/page-shell";
import { SignInGate } from "@/components/sign-in-gate";
import { MindShiftDashboard } from "@/features/mindshift/mindshift-dashboard";
import { MindShiftPlaceholder } from "@/features/mindshift/mindshift-placeholder";
import { useSession } from "@/lib/use-session";
import { cormorant } from "@/features/mindshift/fonts";
import styles from "@/features/mindshift/mindshift-brand.module.css";

export default function MindShiftPage() {
  const gateSentinelRef = useRef<HTMLDivElement>(null);
  const { session } = useSession();

  return (
    <PageShell>
      <section className={`${styles.scope} ${cormorant.variable} px-5 pb-16 pt-32 sm:px-6 sm:pt-36`}>
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--clay-ink)" }}>
            A little space in a loud world
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl">MindShift</h1>
          <p className="mt-4 max-w-xl" style={{ color: "var(--muted)" }}>
            Explore a gentle rhythm of practice. Keep what feels useful, leave the rest.
          </p>

          <div ref={gateSentinelRef} aria-hidden="true" />

          <SignInGate
            sentinelRef={gateSentinelRef}
            headline="Track your practice"
            copy="Create a free account to log sessions and chat with your practice companion."
          >
            <div className="mt-12">
              {session ? <MindShiftDashboard /> : <MindShiftPlaceholder />}
            </div>
          </SignInGate>
        </div>
      </section>
    </PageShell>
  );
}
