export function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ${accent ? "bg-white" : "bg-[var(--color-dark-card)]"}`}>
      <p className={`font-serif text-3xl ${accent ? "text-[var(--color-ink)]" : "text-white"}`}>{value}</p>
      <p className={`mt-1 text-[11px] font-semibold uppercase tracking-widest ${accent ? "text-[var(--color-ink-soft)]" : "text-white/50"}`}>{label}</p>
    </div>
  );
}
