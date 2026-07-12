import { StatCard } from "./components/stat-card";
import { PracticeHistory } from "./components/practice-history";
import { ChatPanel } from "./components/chat-panel";
import { usePracticeLogs } from "./hooks/use-practice-logs";

/**
 * The whole MindShift feature UI — stat cards, practice history, and the AI chat — with no
 * dependency on this app's page layout/nav/auth-guard. Drop it into any page/route in a host app;
 * it only needs a React Query provider and a signed-in user (its API calls are already
 * bearer-token aware via `lib/auth`).
 */
export function MindShiftDashboard() {
  const { data } = usePracticeLogs();
  const streaks = data?.streaks ?? { currentStreak: 0, longestStreak: 0, totalDays: 0 };
  const logs = data?.logs ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-1">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Day Streak" value={streaks.currentStreak} accent />
          <StatCard label="Best Streak" value={streaks.longestStreak} />
          <StatCard label="Total Logged" value={streaks.totalDays} />
        </div>
        <PracticeHistory logs={logs} />
      </div>
      <ChatPanel />
    </div>
  );
}
