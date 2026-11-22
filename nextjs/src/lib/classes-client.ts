import type { mapPublicClass } from "@/lib/rows";

/** The shape /api/classes returns — never includes videoSource/videoRef. */
export type PublicClassVideo = ReturnType<typeof mapPublicClass>;

/** Poster images always live in the public R2 bucket — safe to build the URL on the client. */
export function posterUrl(thumbnailKey: string | null | undefined): string | undefined {
  if (!thumbnailKey) return undefined;
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${thumbnailKey}`;
}
