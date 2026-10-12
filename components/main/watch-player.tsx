"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { LAST_PAGE, useBook } from "@/components/main/book-context";

type WatchPlayerProps = {
  title: string;
  caption: string;
  src: string;
  poster: string;
  width: number;
  height: number;
};

export const WatchPlayer = ({
  title,
  caption,
  src,
  poster,
  width,
  height,
}: WatchPlayerProps) => {
  const { go } = useBook();
  const videoRef = useRef<HTMLVideoElement>(null);
  // the player stays invisible until it can show the clip's first frame —
  // either the poster (that same frame as a small image) or the frame itself
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ((videoRef.current?.readyState ?? 0) >= 2) return setReady(true);
    const img = new window.Image();
    img.onload = () => setReady(true);
    img.src = poster;
    if (img.complete) setReady(true);
    return () => {
      img.onload = null;
    };
  }, [poster]);

  return (
    // same frame as the book: right of the side rail (a drawer on phones)
    <main className="fixed inset-0 flex flex-col overflow-y-auto px-8 py-8 md:left-[240px] md:px-10 md:py-10">
      <Link
        href="/"
        onClick={() => go(LAST_PAGE)}
        className="self-start text-[14px] text-[color:var(--ink-soft)] transition-colors hover:text-[color:var(--accent)]"
      >
        ← Back to More Me
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 py-6">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          width={width}
          height={height}
          controls
          playsInline
          preload="auto"
          onLoadedData={() => setReady(true)}
          className={`h-auto max-h-[calc(100dvh-280px)] w-auto max-w-full rounded-[2px] shadow-[0_22px_50px_rgba(0,0,0,0.35)] transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="max-w-[52ch] text-center">
          <h1
            className="text-[28px] text-[color:var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          <p className="mt-1.5 text-[14px] leading-[1.65] text-[color:var(--ink-soft)]">
            {caption}
          </p>
        </div>
      </div>
    </main>
  );
};
