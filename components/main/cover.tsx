"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useBook } from "@/components/main/book-context";
import { ThemeToggle } from "@/components/main/theme-toggle";

const CONTENTS = [
  { page: 1, label: "Home", roman: "I", note: "who I am, and what I build" },
  { page: 2, label: "Projects", roman: "II", note: "a shelf of things I made" },
  { page: 3, label: "More Me", roman: "III", note: "off the clock" },
] as const;

export const Cover = () => {
  const { go } = useBook();
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-[560px]">
        {/* wordmark */}
        <motion.h1
          {...rise(0)}
          className="text-center text-[52px] leading-[0.92] text-[color:var(--ink)] sm:text-[64px] md:text-[76px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Lila
          <br />
          Zhang
        </motion.h1>

        <motion.p
          {...rise(0.1)}
          className="mt-5 text-center text-[15px] italic tracking-[0.02em] text-[color:var(--muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Software Engineer &amp; Maker
        </motion.p>

        {/* table of contents */}
        <nav className="mt-14 flex flex-col gap-1">
          {CONTENTS.map((row, i) => (
            <motion.button
              key={row.page}
              {...rise(0.22 + i * 0.08)}
              onClick={() => go(row.page)}
              className="group flex items-baseline gap-3 py-2 text-left"
            >
              <span
                className="text-[19px] uppercase tracking-[0.06em] text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--accent)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {row.label}
              </span>
              <span
                aria-hidden
                className="mb-[5px] flex-1 self-end border-b border-dotted border-[color:var(--muted)] opacity-60 transition-opacity group-hover:opacity-100"
              />
              <span
                className="text-[15px] tracking-[0.1em] text-[color:var(--muted)] transition-colors group-hover:text-[color:var(--accent)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {row.roman}
              </span>
            </motion.button>
          ))}
        </nav>

        {/* version + toggle, echoing the reference's colophon */}
        <motion.div
          {...rise(0.52)}
          className="mt-16 flex flex-col items-center gap-5"
        >
          <span
            className="text-[12px] tracking-[0.22em] text-[color:var(--muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            v.&nbsp;<span className="text-[color:var(--ink-soft)]">I</span>
            &nbsp;&middot;&nbsp;MMXXVI
          </span>
          <ThemeToggle variant="bare" />
          <span
            className="text-[11px] tracking-[0.1em] text-[color:var(--muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {reduce
              ? "Pick a chapter to begin."
              : "Turn the corner, or pick a chapter."}
          </span>
        </motion.div>
      </div>
    </div>
  );
};
