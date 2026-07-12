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
    .eq("date", isoDate(new Date()))
    .maybeSingle();
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ checkin: data ? mapCheckin(data) : null });
}
