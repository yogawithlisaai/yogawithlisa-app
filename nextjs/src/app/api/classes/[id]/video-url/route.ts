import { NextResponse } from "next/server";
import { findClassById } from "@/lib/classes";
import { createClient } from "@/lib/supabase/server";
import { isActiveMember } from "@/lib/membership";
import { getPublicVideoUrl, getSignedVideoUrl } from "@/lib/r2";
import { createMuxPlaybackToken } from "@/lib/mux";

/**
 * Only ever called after the player is pressed play on (see ClassPlayer) — never on page load.
 * Response shape is a discriminated union so the client never needs to know video_source ahead
 * of time: { kind: "direct", url } | { kind: "youtube", videoId } | { kind: "mux", playbackId, token }.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const video = await findClassById(supabase, params.id);
  if (!video) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }
  if (!video.available) {
    return NextResponse.json({ error: "Video not available yet" }, { status: 503 });
  }

  if (!video.isFree) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    const member = await isActiveMember(supabase, user.id);
    if (!member) {
      return NextResponse.json({ error: "Membership required" }, { status: 403 });
    }
  }

  switch (video.videoSource) {
    case "r2": {
      const url = video.isFree ? getPublicVideoUrl(video.videoRef) : await getSignedVideoUrl(video.videoRef);
      if (!url) return NextResponse.json({ error: "Video not available yet" }, { status: 503 });
      return NextResponse.json({ kind: "direct", url });
    }
    case "youtube":
      return NextResponse.json({ kind: "youtube", videoId: video.videoRef });
    case "mux": {
      const token = await createMuxPlaybackToken(video.videoRef);
      return NextResponse.json({ kind: "mux", playbackId: video.videoRef, token });
    }
    default:
      return NextResponse.json({ error: "Video not available yet" }, { status: 503 });
  }
}
