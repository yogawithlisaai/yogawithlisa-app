import { createClient } from "@/lib/supabase/server";
import { isoDate, mapCheckin } from "@/lib/rows";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("checkins")
    .select()
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ checkins: (data ?? []).map(mapCheckin) });
}

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const date = body.date ?? isoDate(new Date());

  const { data: existing } = await supabase
    .from("checkins")
    .select()
    .eq("user_id", user.id)
    .eq("date", date)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("checkins")
      .update({
        mood: body.mood ?? existing.mood,
        energy: body.energy ?? existing.energy,
        sleep_rating: body.sleepRating ?? existing.sleep_rating,
        cycle_phase: body.cyclePhase ?? existing.cycle_phase,
        notes: body.notes ?? existing.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return Response.json({ message: error.message }, { status: 500 });
    return Response.json({ checkin: mapCheckin(data) });
  }

  const { data, error } = await supabase
    .from("checkins")
    .insert({
      user_id: user.id,
      date,
      mood: body.mood ?? null,
      energy: body.energy ?? null,
      sleep_rating: body.sleepRating ?? null,
      cycle_phase: body.cyclePhase ?? null,
      notes: body.notes ?? null,
    })
    .select()
    .single();
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ checkin: mapCheckin(data) }, { status: 201 });
}
