import { createClient } from "@/lib/supabase/server";
import { mapOptin } from "@/lib/rows";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("reminder_optins")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ optin: data ? mapOptin(data) : null });
}

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { data: existing } = await supabase
    .from("reminder_optins")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("reminder_optins")
      .update({
        phone: body.phone ?? existing.phone,
        opted_in: body.optedIn ?? existing.opted_in,
        preferred_time: body.preferredTime ?? existing.preferred_time,
        timezone: body.timezone ?? existing.timezone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return Response.json({ message: error.message }, { status: 500 });
    return Response.json({ optin: mapOptin(data) });
  }

  const { data, error } = await supabase
    .from("reminder_optins")
    .insert({
      user_id: user.id,
      phone: body.phone ?? null,
      opted_in: body.optedIn ?? false,
      preferred_time: body.preferredTime ?? "18:00",
      timezone: body.timezone ?? "America/New_York",
    })
    .select()
    .single();
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ optin: mapOptin(data) }, { status: 201 });
}
