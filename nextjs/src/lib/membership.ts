import type { SupabaseClient } from "@supabase/supabase-js";

const ACTIVE_STATUSES = new Set(["trialing", "active"]);

/**
 * Server-only. Call with a cookie-scoped client (RLS already limits the row to this user) or
 * the admin client. Never trust a client-sent "isMember" flag — always re-check here.
 */
export async function isActiveMember(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();
  return !!data && ACTIVE_STATUSES.has(data.status);
}
