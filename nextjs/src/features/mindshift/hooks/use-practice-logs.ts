"use client";

import { useQuery } from "@tanstack/react-query";

export const PRACTICE_LOGS_QUERY_KEY = ["mindshift", "logs"];

export function usePracticeLogs() {
  return useQuery({
    queryKey: PRACTICE_LOGS_QUERY_KEY,
    queryFn: async () => (await fetch("/api/mindshift/logs")).json(),
  });
}
