import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { authMiddleware, requireAuth } from "./middleware/auth";
import { checkinsRoutes } from "./routes/checkins";
import { remindersRoutes } from "./routes/reminders";
import { cronRoutes } from "./routes/cron";
import { createMindShiftRoutes } from "./mindshift";
import type { ClassCatalogItem } from "./mindshift";
import classesData from "../web/data/classes.json";

// The only thing the host app feeds into MindShift: a flat class catalog for recommendations.
// This is the sole integration point between MindShift and the rest of this app — see
// ./mindshift/README.md for how to swap or omit it when extracting the feature.
const classCatalog: ClassCatalogItem[] = (classesData as any[]).flatMap((cat) => cat.videos);

const app = new Hono()
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true, exposeHeaders: ["set-auth-token"] }))
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath("api")
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .route("/mindshift", createMindShiftRoutes({ authMiddleware, requireAuth, deps: { classCatalog } }))
  .route("/checkins", checkinsRoutes)
  .route("/reminders", remindersRoutes)
  .route("/cron", cronRoutes);

export type AppType = typeof app;
export default app;
