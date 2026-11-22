"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "./use-session";

/**
 * Client-side membership status — purely for UI decisions (what to show). Every actual gated
 * action re-checks isActiveMember() server-side; this hook is never a security boundary.
 */
export function useMembership() {
  const { session, isPending: sessionPending } = useSession();
  const { data, isPending: statusPending } = useQuery({
    queryKey: ["membership-status", session?.user.id],
    queryFn: async () => (await fetch("/api/membership/status")).json() as Promise<{ isMember: boolean }>,
    enabled: !!session,
  });

  return {
    session,
    isPending: sessionPending || (!!session && statusPending),
    isMember: !!session && !!data?.isMember,
  };
}
