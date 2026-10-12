import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WatchPlayer } from "@/components/main/watch-player";

// self-hosted clips for the More Me cards (files live in /public/videos).
// Each poster is the clip's exact first frame, so nothing jumps when it starts.
const CLIPS = {
  piano: {
    title: "Mia & Sebastian\u2019s Theme",
    caption:
      "The piano theme from La La Land. Enjoy~ there\u2019s a surprise at the end.",
    src: "/videos/piano.mp4",
    poster: "/videos/piano-poster.jpg",
    width: 704,
    height: 1280,
  },
  dance: {
    title: "Bag Bad Back Cover",
    caption: "A dance cover. I edited this video myself~",
    src: "/videos/dance.mp4",
    poster: "/videos/dance-poster.jpg",
    width: 1920,
    height: 1080,
  },
} as const;

type Slug = keyof typeof CLIPS;
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CLIPS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const clip = CLIPS[(await params).slug as Slug];
  return clip ? { title: `${clip.title} | Lila Zhang` } : {};
}

export default async function WatchPage({ params }: Props) {
  const clip = CLIPS[(await params).slug as Slug];
  if (!clip) notFound();

  return <WatchPlayer {...clip} />;
}
