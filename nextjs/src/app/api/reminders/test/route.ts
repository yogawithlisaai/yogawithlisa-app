import { createClient } from "@/lib/supabase/server";
import { sendReminderSms } from "@/lib/twilio";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { data: row } = await supabase
    .from("reminder_optins")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row?.phone || !row.opted_in) {
    return Response.json({ message: "No opted-in phone number on file" }, { status: 400 });
  }

  const result = await sendReminderSms(row.phone);
  return Response.json(result);
}
