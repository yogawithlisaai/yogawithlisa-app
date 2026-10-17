import styles from "../mindshift-brand.module.css";

export function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      className="rounded-[20px] p-5"
      style={{ backgroundColor: accent ? "var(--teal)" : "var(--cream)" }}
    >
      <p className={`${styles.display} text-3xl`} style={{ color: accent ? "var(--linen)" : "var(--espresso)" }}>
        {value}
      </p>
      <p
        className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: accent ? "var(--rose)" : "var(--clay-ink)" }}
      >
        {label}
      </p>
    </div>
  );
}
