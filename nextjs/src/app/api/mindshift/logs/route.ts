import { createClient } from "@/lib/supabase/server";
import { computeStreaks } from "@/lib/mindshift/streaks";
import { isoDate, mapPracticeLog } from "@/lib/rows";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("practice_logs")
    .select()
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return Response.json({ message: error.message }, { status: 500 });

  const logs = (data ?? []).map(mapPracticeLog);
  const streaks = computeStreaks(logs.map((l) => l.date));
  return Response.json({ logs, streaks });
}

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("practice_logs")
    .insert({
      user_id: user.id,
      date: body.date ?? isoDate(new Date()),
      class_title: body.classTitle ?? null,
      style: body.style ?? null,
      duration_minutes: body.durationMinutes ?? null,
      mood: body.mood ?? null,
      notes: body.notes ?? null,
      source: body.source ?? "manual",
    })
    .select()
    .single();
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ log: mapPracticeLog(data) }, { status: 201 });
}
