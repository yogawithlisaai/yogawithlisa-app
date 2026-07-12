type PracticeLog = {
  id: number;
  date: string;
  classTitle?: string | null;
  style?: string | null;
  durationMinutes?: number | null;
  mood?: string | null;
};

export function PracticeHistory({ logs }: { logs: PracticeLog[] }) {
  return (
    <div className="rounded-[20px] border border-[var(--color-line-dark)] bg-[var(--color-dark-card)] p-6">
      <h3 className="font-serif text-lg text-white">Practice history</h3>
      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
        {logs.length === 0 && (
          <p className="text-sm text-white/50">No sessions logged yet — tell MindShift about your practice!</p>
        )}
        {logs.map((log) => (
          <div key={log.id} className="rounded-xl bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">{log.classTitle || log.style || "Practice"}</p>
              <p className="text-xs text-white/40">{log.date}</p>
            </div>
            <p className="mt-1 text-xs text-white/50">
              {[log.durationMinutes ? `${log.durationMinutes} min` : null, log.mood ? `felt ${log.mood}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
