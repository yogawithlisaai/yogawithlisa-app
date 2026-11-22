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

/**
 * Vertical/9:16 format and "featured" placement aren't DB columns (they're cosmetic) — derived
 * from the title so the Grounded Mornings series keeps its current vertical, hero-section look.
 */
export function mapClass(row: any) {
  const isGroundedMornings = typeof row.title === "string" && row.title.startsWith("Grounded Mornings");
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    durationMinutes: row.length_minutes,
    level: row.level,
    style: row.style,
    intensity: row.intensity,
    bodyFocus: row.body_focus,
    thumbnailKey: row.thumbnail_key,
    tags: row.tags ?? [],
    videoSource: row.video_source,
    videoRef: row.video_ref,
    isFree: row.is_free,
    sortOrder: row.sort_order,
    format: isGroundedMornings ? "vertical" : "horizontal",
    featured: isGroundedMornings,
    available: row.video_source !== "pending" && !!row.video_ref,
  };
}

/** Safe for any client, signed in or not: never includes videoSource/videoRef. */
export function mapPublicClass(row: any) {
  const { videoSource: _videoSource, videoRef: _videoRef, ...safe } = mapClass(row);
  return safe;
}
