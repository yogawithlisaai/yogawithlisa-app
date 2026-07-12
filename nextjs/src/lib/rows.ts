/**
 * Postgres columns are snake_case; the frontend (and the old API contract)
 * uses camelCase. These mappers keep the client code unchanged from the
 * original app.
 */

export function mapPracticeLog(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    classTitle: row.class_title,
    style: row.style,
    durationMinutes: row.duration_minutes,
    mood: row.mood,
    notes: row.notes,
    source: row.source,
    createdAt: row.created_at,
  };
}

export function mapCheckin(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    mood: row.mood,
    energy: row.energy,
    sleepRating: row.sleep_rating,
    cyclePhase: row.cycle_phase,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapOptin(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    phone: row.phone,
    optedIn: row.opted_in,
    preferredTime: row.preferred_time,
    timezone: row.timezone,
    lastSentAt: row.last_sent_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
