import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isActiveMember } from "@/lib/membership";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ isMember: false });

  const isMember = await isActiveMember(supabase, user.id);
  return NextResponse.json({ isMember });
}
