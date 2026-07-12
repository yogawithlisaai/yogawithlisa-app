/** Minimal shape MindShift needs from a class/video catalog entry to make recommendations. */
export type ClassCatalogItem = {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  level?: string;
  style?: string;
  tags?: string[];
};

/** Optional cross-feature signal (e.g. a host app's daily mood/energy check-in). */
export type WellnessSignal = {
  date: string;
  mood?: string | null;
  energy?: number | null;
  sleepRating?: number | null;
  cyclePhase?: string | null;
};

export type MindShiftDeps = {
  /** Class catalog to search for recommendations. Defaults to an empty list if omitted. */
  classCatalog?: ClassCatalogItem[];
  /**
   * Optional integration point: fetch recent wellness signals (mood/energy/sleep) for a user
   * from a host app's own feature. MindShift works fine without this — it's purely additive
   * context for better recommendations. Omit when extracting MindShift standalone.
   */
  getRecentWellnessSignals?: (userId: string) => Promise<WellnessSignal[]>;
};
