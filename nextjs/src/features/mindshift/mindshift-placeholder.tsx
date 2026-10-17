/** Static stand-in for <MindShiftDashboard>, shown until a session is confirmed so signed-out
 * visitors never trigger its data fetches. Mirrors its tab-strip + Today-panel layout, no live
 * content. */
export function MindShiftPlaceholder() {
  return (
    <div aria-hidden="true">
      <div className="grid max-w-[480px] grid-cols-4 gap-2">
        {["Today", "Practice", "Insights", "Profile"].map((label, i) => (
          <div
            key={label}
            className="flex items-center justify-center rounded-full px-2 text-center text-sm sm:px-5"
            style={{
              minHeight: 44,
              backgroundColor: i === 0 ? "var(--teal)" : "transparent",
              color: i === 0 ? "var(--linen)" : "var(--muted)",
              border: `1px solid ${i === 0 ? "var(--teal)" : "var(--hairline)"}`,
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-[480px] space-y-6">
        <div className="h-9 w-2/3 rounded" style={{ backgroundColor: "var(--hairline)" }} />
        <div className="h-32 rounded-[20px]" style={{ backgroundColor: "var(--cream)" }} />
        <div className="h-11 rounded-full" style={{ backgroundColor: "var(--hairline)" }} />
      </div>
    </div>
  );
}
