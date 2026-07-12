import { useQuery } from "@tanstack/react-query";
import { mindshiftApi } from "../api";

export const PRACTICE_LOGS_QUERY_KEY = ["mindshift", "logs"];

export function usePracticeLogs() {
  return useQuery({
    queryKey: PRACTICE_LOGS_QUERY_KEY,
    queryFn: async () => (await mindshiftApi.listLogs()).json(),
  });
}
