import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("preferences")
    .select("email_opt_out")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ emailOptOut: data?.email_opt_out ?? false });
}

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { error } = await supabase
    .from("preferences")
    .upsert(
      { user_id: user.id, email_opt_out: Boolean(body.emailOptOut), updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ emailOptOut: Boolean(body.emailOptOut) });
}
