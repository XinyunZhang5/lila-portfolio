"use client";

import { useEffect, useState } from "react";
import { RxHeart, RxHeartFilled } from "react-icons/rx";

const KEY = "book-liked";

// a like that lives in this browser only (there is no counter behind it):
// the heart fills and stays filled on the next visit
export const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(KEY) === "1");
    } catch {
      /* ignore private-mode storage errors */
    }
  }, []);

  const toggle = () =>
    setLiked((cur) => {
      try {
        localStorage.setItem(KEY, cur ? "0" : "1");
      } catch {
        /* ignore private-mode storage errors */
      }
      return !cur;
    });

  const Icon = liked ? RxHeartFilled : RxHeart;

  return (
    <div className="group relative flex">
      <button
        onClick={toggle}
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Leave a like"}
        className={`transition-colors hover:text-[color:var(--accent)] ${
          liked ? "text-[color:var(--accent)]" : "text-[color:var(--muted)]"
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
      </div>
    </div>
  );
};
