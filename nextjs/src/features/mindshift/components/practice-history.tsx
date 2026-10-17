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
    <div className="rounded-[20px] p-6" style={{ backgroundColor: "var(--cream)" }}>
      <h3 className="text-lg">Practice history</h3>
      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
        {logs.length === 0 && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No sessions logged yet. Tell MindShift about your practice!
          </p>
        )}
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: "var(--linen)", border: "1px solid var(--hairline)" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: "var(--espresso)" }}>
                {log.classTitle || log.style || "Practice"}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {log.date}
              </p>
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
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
