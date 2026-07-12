import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "../database/auth-schema";

/**
 * MindShift's only database table. Self-contained — the only foreign key is to the
 * auth `user` table, which any host app is expected to already have (Better Auth).
 *
 * To extract MindShift standalone: keep this table, point `user.id` at whatever your
 * host app's user table primary key is.
 */
export const practiceLogs = sqliteTable("practice_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  classTitle: text("class_title"),
  style: text("style"),
  durationMinutes: integer("duration_minutes"),
  mood: text("mood"), // e.g. calm, energized, stressed, tired, anxious, joyful
  notes: text("notes"),
  source: text("source").notNull().default("manual"), // manual | ai
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
