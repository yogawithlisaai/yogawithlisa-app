function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * Pure function, zero dependencies — computes current/longest streak and total distinct
 * practice days from a list of YYYY-MM-DD date strings. Safe to copy verbatim into any
 * other codebase.
 */
export function computeStreaks(dates: string[]) {
  const unique = Array.from(new Set(dates)).sort();
  if (unique.length === 0) return { currentStreak: 0, longestStreak: 0, totalDays: 0 };

  const daySet = new Set(unique);
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const d of unique) {
    const cur = new Date(d + "T00:00:00Z");
    if (prev) {
      const diff = (cur.getTime() - prev.getTime()) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = cur;
  }

  // current streak counting back from today
  let current = 0;
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  // allow today to be "not logged yet" without breaking streak
  if (!daySet.has(isoDate(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  while (daySet.has(isoDate(cursor))) {
    current++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return { currentStreak: current, longestStreak: longest, totalDays: unique.length };
}
