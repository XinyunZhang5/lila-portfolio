"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type Vignette = {
  img: string;
  title: string;
  body: string;
  rotate: number;
  offset: string;
  href?: string; // when set, the card links out (opens in a new tab)
};

// grounded, real interests. Add / edit these with your own once you like the shape.
const VIGNETTES: Vignette[] = [
  {
    img: "/more-me/piano.png",
    title: "Piano",
    body: "I play when I need to think in a different language. Mostly late, mostly for myself.",
    rotate: -3,
    offset: "md:mt-10",
    href: "https://drive.google.com/file/d/1U6a3EgCgX0MF9NLgLYkaxK1R0A9Uy14e/view?usp=sharing",
  },
  {
    img: "/more-me/dance.png",
    title: "Dance",
    body: "The reason Reframe exists. I wanted a coach for the beats I kept getting wrong.",
    rotate: 2.5,
    offset: "md:-mt-4",
    href: "https://drive.google.com/file/d/1MJ5vkRHWPYPwbz6Wkj5ANnRy-c-MrGqu/view",
  },
  {
    img: "/more-me/play-v2.png",
    title: "Always moving",
    body: "When my head gets loud, I move — skateboarding, pickup basketball, and whatever wall I can climb next.",
    rotate: -1.5,
    offset: "md:mt-16",
  },
];

export const MoreMe = () => {
  const reduce = useReducedMotion();

  return (
    <section
      id="more-me"
      className="relative mx-auto max-w-[1100px] px-6 pb-40 pt-28 md:px-10"
    >
      <div className="mb-4">
        <span
          className="text-[15px] tracking-[0.05em] text-[color:var(--accent)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Chapter III
        </span>
        <span className="ml-3 align-middle text-[color:var(--accent)] opacity-50">
          ✦
        </span>
      </div>

      <h2
        className="max-w-[18ch] text-[38px] leading-[1.08] text-[color:var(--ink)] md:text-[56px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Off the clock.
      </h2>
      <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.8] text-[color:var(--ink-soft)]">
        The professional part is above. This is the rest of me, the small things
        I keep coming back to.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {VIGNETTES.map((v, i) => {
          const body = (
            <>
              <div className="relative aspect-square w-full overflow-hidden bg-[color:var(--card-ink)]">
                <Image
                  src={v.img}
                  alt={v.title}
                  fill
                  sizes="(max-width: 640px) 90vw, 320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                {v.href && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                    <svg
                      width="8"
                      height="9"
                      viewBox="0 0 8 9"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M0 0l8 4.5L0 9z" />
                    </svg>
                    Watch
                  </span>
                )}
              </div>
              <figcaption className="px-1 pt-4">
                <h3
                  className="text-[22px] text-[color:var(--card-ink)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {v.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.65] text-[color:var(--card-muted)]">
                  {v.body}
                </p>
              </figcaption>
            </>
          );

          return (
            <motion.figure
              key={v.title}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ rotate: reduce ? 0 : v.rotate }}
              className={`group ${v.offset} rounded-[2px] bg-[color:var(--card)] p-3 pb-4 shadow-[0_22px_50px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:!rotate-0`}
            >
              {v.href ? (
                <a
                  href={v.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${v.title} — watch on Google Drive (opens in a new tab)`}
                  className="block cursor-pointer"
                >
                  {body}
                </a>
              ) : (
                body
              )}
            </motion.figure>
          );
        })}
      </div>
    </section>
  );
};
