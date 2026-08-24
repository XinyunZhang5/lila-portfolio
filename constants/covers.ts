import coversJson from "@/public/covers/covers.json";

export type Cover = {
  id: string;
  title: string;
  title_en: string;
  date: string;
  issue: string;
  artist: string;
  accent: string;
  stack?: string[];
  link: string | null;
  note: string;
};

/**
 * The archive used to fetch this JSON at runtime, which put a whole network
 * round-trip in front of the covers: nothing could even start downloading
 * until the list came back. Importing it makes the list part of the bundle,
 * so the covers are the only thing left to wait for.
 */
export const COVERS = coversJson as Cover[];

/**
 * A cover renders 180–320 CSS px wide (see `coverW` in the archive), so one
 * 640px-wide WebP covers every device including 2x screens — roughly 9x
 * lighter than shipping the 1200x1500 JPEG masters.
 * Regenerate with `npm run covers` after adding or repainting an issue.
 */
export const coverSrc = (id: string) => `/covers/opt/${id}.webp`;
export const COVER_W = 640;
export const COVER_H = 800;
