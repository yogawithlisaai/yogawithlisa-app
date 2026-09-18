/**
 * Single source of truth for feature flags — NEXT_PUBLIC_ so the same value reads the same way
 * in middleware, server components, and client components without duplicating the check.
 */
export const wellnessTrackerEnabled = process.env.NEXT_PUBLIC_WELLNESS_TRACKER_ENABLED === "true";
