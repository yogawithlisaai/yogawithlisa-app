/** Static stand-in for <MindShiftDashboard>, shown until a session is confirmed so signed-out
 * visitors never trigger its data fetches. Mirrors its layout, no live content. */
export function MindShiftPlaceholder() {
  return (
    <div className="grid gap-8 lg:grid-cols-3" aria-hidden="true">
      <div className="space-y-6 lg:col-span-1">
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 rounded-2xl bg-white/5" />
          <div className="h-20 rounded-2xl bg-white/5" />
          <div className="h-20 rounded-2xl bg-white/5" />
        </div>
        <div className="h-72 rounded-[20px] bg-white/5" />
      </div>
      <div className="h-[480px] rounded-[20px] bg-white/5 lg:col-span-2" />
    </div>
  );
}
