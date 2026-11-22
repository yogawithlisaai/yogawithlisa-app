import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicClassCatalog } from "@/lib/classes";

/** Public: metadata only (title/description/thumbnail/etc.) — never includes video refs. */
export async function GET() {
  const supabase = createClient();
  const classes = await getPublicClassCatalog(supabase);
  return NextResponse.json({ classes });
}
