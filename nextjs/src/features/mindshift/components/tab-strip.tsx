export type MindShiftTab = "today" | "practice" | "insights" | "profile";

const TABS: { id: MindShiftTab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "practice", label: "Practice" },
  { id: "insights", label: "Insights" },
  { id: "profile", label: "Profile" },
];

/**
 * MindShift's four sections as a tab strip at the top of the page (Decision 4) — it scrolls
 * with the page rather than floating, since the app's global nav already lives in the footer.
 */
export function TabStrip({ active, onChange }: { active: MindShiftTab; onChange: (tab: MindShiftTab) => void }) {
  return (
    <div role="tablist" aria-label="MindShift sections" className="grid grid-cols-4 gap-2">
      {TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`mindshift-panel-${tab.id}`}
            id={`mindshift-tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className="flex items-center justify-center rounded-full px-2 text-center text-sm leading-tight transition-colors sm:px-5"
            style={{
              minHeight: 44,
              backgroundColor: selected ? "var(--teal)" : "transparent",
              color: selected ? "var(--linen)" : "var(--muted)",
              border: selected ? "1px solid var(--teal)" : "1px solid var(--hairline)",
              // Weight carries the active state too, not fill/border alone.
              fontWeight: selected ? 700 : 500,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
