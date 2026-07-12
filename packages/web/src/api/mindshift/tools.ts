import z from "zod";
import { tool } from "ai";
import { eq, desc } from "drizzle-orm";
import { db } from "../database";
import { practiceLogs } from "./schema";
import { computeStreaks } from "./streaks";
import type { MindShiftDeps } from "./types";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Recursively convert Date instances to ISO strings so tool output is safely JSON-serializable. */
function serializeDates<T>(value: T): T {
  if (value instanceof Date) return value.toISOString() as unknown as T;
  if (Array.isArray(value)) return value.map(serializeDates) as unknown as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializeDates(v)])) as T;
  }
  return value;
}

/**
 * Build the MindShift tool set bound to a specific authenticated user.
 *
 * Hard dependency: a Drizzle `db` (imported directly) + the `practiceLogs` table from
 * `./schema` — this is the one thing MindShift actually owns and always needs.
 *
 * Everything else (class recommendations, wellness context) is injected via `deps` so this
 * module has no compile-time dependency on the rest of the host app. Omit `deps` entirely and
 * MindShift still works — it just logs/reads practice sessions and skips the extra context.
 */
export function buildMindShiftTools(userId: string, deps: MindShiftDeps = {}) {
  const { classCatalog = [], getRecentWellnessSignals } = deps;

  const logPractice = tool({
    description:
      "Log a yoga practice session for the user. Call this whenever the user tells you they practiced, did a class, or wants to log their session.",
    inputSchema: z.object({
      date: z.string().optional().describe("YYYY-MM-DD, defaults to today"),
      classTitle: z.string().optional().describe("Name of the class or style practiced"),
      style: z.string().optional().describe("e.g. Vinyasa, Yin, Restorative, Hatha, Power"),
      durationMinutes: z.number().optional(),
      mood: z
        .string()
        .optional()
        .describe("How the user felt, e.g. calm, energized, stressed, tired, anxious, joyful"),
      notes: z.string().optional(),
    }),
    async execute(input) {
      const [log] = await db
        .insert(practiceLogs)
        .values({
          userId,
          date: input.date ?? isoDate(new Date()),
          classTitle: input.classTitle ?? null,
          style: input.style ?? null,
          durationMinutes: input.durationMinutes ?? null,
          mood: input.mood ?? null,
          notes: input.notes ?? null,
          source: "ai",
        })
        .returning();
      return serializeDates({ logged: true, log });
    },
  });

  const getRecentActivity = tool({
    description:
      "Get the user's recent practice logs, current streak, and (if available) recent wellness check-ins so you can give personalized recommendations based on mood, energy, and recent activity.",
    inputSchema: z.object({}),
    async execute() {
      const logs = await db
        .select()
        .from(practiceLogs)
        .where(eq(practiceLogs.userId, userId))
        .orderBy(desc(practiceLogs.date))
        .limit(14);
      const streaks = computeStreaks(logs.map((l) => l.date));
      const wellnessSignals = getRecentWellnessSignals ? await getRecentWellnessSignals(userId) : [];
      return serializeDates({ logs, wellnessSignals, streaks });
    },
  });

  const suggestClasses = tool({
    description:
      "Look up classes from the library filtered by style, level, or max duration to recommend to the user.",
    inputSchema: z.object({
      style: z.string().optional(),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"]).optional(),
      maxDuration: z.number().optional().describe("Max duration in minutes"),
      mood: z.string().optional().describe("User's current mood, to match tags/description"),
    }),
    async execute({ style, level, maxDuration, mood }) {
      let filtered = classCatalog;
      if (style) filtered = filtered.filter((v) => v.style?.toLowerCase().includes(style.toLowerCase()));
      if (level) filtered = filtered.filter((v) => v.level === level);
      if (maxDuration) filtered = filtered.filter((v) => v.durationMinutes <= maxDuration);
      if (mood) {
        const m = mood.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.description?.toLowerCase().includes(m) ||
            v.tags?.some((t) => t.toLowerCase().includes(m)),
        );
      }
      return serializeDates({ matches: filtered.slice(0, 5) });
    },
  });

  return { logPractice, getRecentActivity, suggestClasses };
}
