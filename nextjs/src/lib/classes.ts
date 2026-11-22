import type { SupabaseClient } from "@supabase/supabase-js";
import { mapClass, mapPublicClass } from "@/lib/rows";

/**
 * Server-only — reads the real video_source/video_ref. Never import this from a "use client"
 * file; the browser gets class data through /api/classes (metadata only) or the per-class
 * /video-url route (gated), never this module directly.
 */
export async function getClassCatalog(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("classes").select().order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapClass);
}

/** Safe to hand to any client — strips videoSource/videoRef. */
export async function getPublicClassCatalog(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("classes").select().order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapPublicClass);
}

export async function findClassById(supabase: SupabaseClient, id: string) {
  const { data } = await supabase.from("classes").select().eq("id", id).maybeSingle();
  return data ? mapClass(data) : undefined;
}
