import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

// MindShift owns its own table definition in ../mindshift/schema.ts — re-exported here only so
// drizzle-kit (which scans this single entry file) picks it up for migrations. The feature module
// itself never imports from this file.
export * from "../mindshift/schema";

// --- Wellness daily check-ins ---
export const checkins = sqliteTable("checkins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD, one per user per day (upsert)
  mood: text("mood"),
  energy: integer("energy"), // 1-5
  sleepRating: integer("sleep_rating"), // 1-5
  cyclePhase: text("cycle_phase"), // menstrual, follicular, ovulation, luteal, perimenopause, menopause, not_tracking
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// --- SMS reminder opt-in ---
export const reminderOptins = sqliteTable("reminder_optins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  phone: text("phone"),
  optedIn: integer("opted_in", { mode: "boolean" }).notNull().default(false),
  preferredTime: text("preferred_time").notNull().default("18:00"), // HH:mm local
  timezone: text("timezone").default("America/New_York"),
  lastSentAt: integer("last_sent_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
