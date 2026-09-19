import { NextResponse } from "next/server";
import { findClassById } from "@/lib/classes";
import { getUser } from "@/lib/supabase/server";
import { getPublicVideoUrl, getSignedVideoUrl } from "@/lib/r2";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const video = findClassById(params.id);
  if (!video) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  if (video.free) {
    const url = getPublicVideoUrl(video.videoKey);
    if (!url) {
      return NextResponse.json({ error: "Video not available yet" }, { status: 503 });
    }
    return NextResponse.json({ url });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const url = await getSignedVideoUrl(video.videoKey);
  return NextResponse.json({ url });
}
