import { api } from "../../lib/api";

/**
 * Thin wrapper around the typed Hono client, scoped to MindShift's `/api/mindshift/*` routes.
 * This is the only file outside `hooks/` and `components/` that talks to the network — if you
 * extract this feature elsewhere, this is the one file to repoint at a different API base.
 */
export const mindshiftApi = {
  listLogs: () => api.mindshift.logs.$get(),
  createLog: (json: {
    date?: string;
    classTitle?: string;
    style?: string;
    durationMinutes?: number;
    mood?: string;
    notes?: string;
  }) => api.mindshift.logs.$post({ json }),
  deleteLog: (id: number) => api.mindshift.logs[":id"].$delete({ param: { id: String(id) } }),
  chatEndpoint: "/api/mindshift/chat",
};
