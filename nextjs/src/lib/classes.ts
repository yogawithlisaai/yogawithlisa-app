import classesData from "@/data/classes.json";

export type ClassVideo = {
  id: string;
  title: string;
  description: string;
  /** Object key of the source video inside the R2 bucket (private bucket, unless `free`). */
  videoKey: string;
  /** Object key of the poster/thumbnail image inside the public R2 bucket. */
  posterKey: string;
  durationMinutes: number;
  level: string;
  style: string;
  tags: string[];
  format: "vertical" | "horizontal";
  free: boolean;
  featured: boolean;
};

export type ClassCategory = { category: string; videos: ClassVideo[] };

export const classCategories = classesData as ClassCategory[];

/** Flat catalog — the one integration point MindShift needs for recommendations. */
export const classCatalog: ClassVideo[] = classCategories.flatMap((c) => c.videos);

export function findClassById(id: string): ClassVideo | undefined {
  return classCatalog.find((v) => v.id === id);
}

/** Poster images always live in the public bucket — safe to build the URL on the client. */
export function posterUrl(v: ClassVideo): string {
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${v.posterKey}`;
}
