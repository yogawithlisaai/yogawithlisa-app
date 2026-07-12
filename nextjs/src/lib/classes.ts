import classesData from "@/data/classes.json";

export type ClassVideo = {
  id: string;
  title: string;
  description: string;
  videoId: string;
  platform: "youtube" | "vimeo";
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
