import { PageShell } from "../components/layout/page-shell";
import { ProtectedRoute } from "../components/protected-route";
import { MindShiftDashboard } from "../features/mindshift";

function MindShiftPageContent() {
  return (
    <PageShell>
      <section className="bg-[var(--color-dark)] px-5 pb-16 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">AI Practice Tracker</p>
          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Mind<em className="italic">Shift</em>
          </h1>
          <p className="mt-4 max-w-xl text-white/60">
            Chat with your practice companion — log sessions, ask for recommendations, and see your
            streaks build.
          </p>

          <div className="mt-12">
            <MindShiftDashboard />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default function MindShiftPage() {
  return (
    <ProtectedRoute>
      <MindShiftPageContent />
    </ProtectedRoute>
  );
}
