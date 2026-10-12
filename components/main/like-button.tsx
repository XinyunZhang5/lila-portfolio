"use client";

import { useEffect, useState } from "react";
import { RxHeart, RxHeartFilled } from "react-icons/rx";

const KEY = "book-liked";

type Likes = { configured: boolean; count?: number; liked?: boolean };

// One like per visitor, and it can't be taken back. The server counts and
// de-duplicates (see app/api/likes); localStorage only remembers the filled
// heart so it shows instantly on the next visit.
export const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setLiked(true);
    } catch {
      /* ignore private-mode storage errors */
    }
    fetch("/api/likes")
      .then((r) => r.json())
      .then((d: Likes) => {
        if (!d.configured) return;
        setCount(d.count ?? 0);
        if (d.liked) setLiked(true);
      })
      .catch(() => {
        /* no count is fine: the heart still works */
      });
  }, []);

  const like = () => {
    if (liked) return;
    setLiked(true);
    setCount((c) => (c === null ? c : c + 1));
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore private-mode storage errors */
    }
    fetch("/api/likes", { method: "POST" })
      .then((r) => r.json())
      .then((d: Likes) => {
        if (d.configured) setCount(d.count ?? 0);
      })
      .catch(() => {
        /* keep the optimistic count */
      });
  };

  const Icon = liked ? RxHeartFilled : RxHeart;

  return (
    <div className="group relative flex">
      <button
        onClick={like}
        aria-pressed={liked}
        aria-label={liked ? "Liked" : "Leave a like"}
        className={`transition-colors hover:text-[color:var(--accent)] ${
          liked
            ? "cursor-default text-[color:var(--accent)]"
            : "text-[color:var(--muted)]"
        }`}
      >
        <Icon className="h-[22px] w-[22px] transition-transform duration-200 group-hover:scale-110" />
      </button>

      {/* the note: a little card that lifts out on hover, focus, or tap */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-[-44px] mb-3 w-[188px] translate-y-1 -rotate-2 rounded-[2px] bg-[color:var(--card)] px-3.5 py-3 text-[12.5px] leading-[1.6] text-[color:var(--card-ink)] opacity-0 shadow-[0_14px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
      >
        {liked
          ? "Thank you! That genuinely made my day~"
          : "Leave a like to cheer on my job hunt. It’s been a long road~"}
        {count !== null && (
          <span
            className="ml-2 inline-flex items-center gap-1 whitespace-nowrap align-baseline font-semibold text-[color:var(--card-ink)]"
            aria-label={`${count} likes`}
          >
            <RxHeartFilled className="h-[11px] w-[11px]" aria-hidden />
            {count}
          </span>
        )}
      </div>
    </div>
  );
};
