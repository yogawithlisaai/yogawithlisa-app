import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("practice_logs")
    .delete()
    .eq("id", Number(params.id))
    .eq("user_id", user.id);
  if (error) return Response.json({ message: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
