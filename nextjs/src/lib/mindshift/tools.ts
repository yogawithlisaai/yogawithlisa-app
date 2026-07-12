import { tool } from "ai";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { computeStreaks } from "./streaks";
import { classCatalog } from "@/lib/classes";
import { isoDate, mapPracticeLog, mapCheckin } from "@/lib/rows";

/**
 * MindShift's three agent tools, bound to the authenticated user's Supabase
 * client (RLS scopes every query to that user). Ported 1:1 from the original
 * Hono/Drizzle module: logPractice, getRecentActivity, suggestClasses.
 */
export function buildMindShiftTools(supabase: SupabaseClient, userId: string) {
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
      const { data, error } = await supabase
        .from("practice_logs")
        .insert({
          user_id: userId,
          date: input.date ?? isoDate(new Date()),
          class_title: input.classTitle ?? null,
          style: input.style ?? null,
          duration_minutes: input.durationMinutes ?? null,
          mood: input.mood ?? null,
          notes: input.notes ?? null,
          source: "ai",
        })
        .select()
        .single();
      if (error) return { logged: false, error: error.message };
      return { logged: true, log: mapPracticeLog(data) };
    },
  });

  const getRecentActivity = tool({
    description:
      "Get the user's recent practice logs, current streak, and recent wellness check-ins so you can give personalized recommendations based on mood, energy, and recent activity.",
    inputSchema: z.object({}),
    async execute() {
      const { data: logs } = await supabase
        .from("practice_logs")
        .select()
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(14);
      const streaks = computeStreaks((logs ?? []).map((l) => l.date));

      // Cross-feature context from the Wellness Dashboard (the old app injected
      // this via a deps hook; here we read the checkins table directly).
      const { data: checkins } = await supabase
        .from("checkins")
        .select("date, mood, energy, sleep_rating, cycle_phase")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(7);

      return {
        logs: (logs ?? []).map(mapPracticeLog),
        wellnessSignals: (checkins ?? []).map(mapCheckin),
        streaks,
      };
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
      return { matches: filtered.slice(0, 5) };
    },
  });

  return { logPractice, getRecentActivity, suggestClasses };
}
