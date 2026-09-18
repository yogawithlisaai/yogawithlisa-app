import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { WellnessDashboard } from "@/features/wellness/wellness-dashboard";
import { wellnessTrackerEnabled } from "@/lib/feature-flags";

export default function WellnessPage() {
  if (!wellnessTrackerEnabled) notFound();

  return (
    <PageShell>
      <WellnessDashboard />
    </PageShell>
  );
}
