"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import {
  BACKEND_SKILL,
  FRONTEND_SKILL,
  FULLSTACK_SKILL,
  SKILL_DATA,
} from "@/constants";

const SKILL_GROUPS = [
  { label: "Languages", items: SKILL_DATA },
  { label: "Frontend", items: FRONTEND_SKILL },
  { label: "Backend & Data", items: BACKEND_SKILL },
  { label: "Infra & Tools", items: FULLSTACK_SKILL },
] as const;

export const Prologue = () => {
  const reduce = useReducedMotion();
  // a paged book shows one chapter at a time, so reveal on mount, not on scroll
  const rise = {
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section
      id="prologue"
      className="relative mx-auto flex min-h-full max-w-[1100px] flex-col justify-center px-6 pb-24 pt-32 md:px-10"
    >
      {/* intro on the left, headshot in the top-right */}
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12">
        <div className="md:min-w-0 md:flex-1">
          {/* chapter marker */}
          <motion.div {...rise} className="mb-8">
            <span
              className="text-[15px] tracking-[0.05em] text-[color:var(--accent)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Chapter I
            </span>
            <span className="ml-3 align-middle text-[color:var(--accent)] opacity-50">
              ✦
            </span>
          </motion.div>

          {/* opening line */}
          <motion.h1
            {...rise}
            className="max-w-[16ch] text-[44px] leading-[1.06] text-[color:var(--ink)] md:text-[68px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hi, I&apos;m Lila.
          </motion.h1>

          {/* the kicker, set in mono like the rest of the editorial captions */}
          <motion.p
            {...rise}
            transition={{ ...rise.transition, delay: 0.06 }}
            className="mt-5 text-[13px] tracking-[0.08em] text-[color:var(--muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Math + CS @ UIUC
            <span aria-hidden className="mx-2.5 opacity-40">
              |
            </span>
            Software Engineer &amp; Maker
          </motion.p>

          <motion.p
            {...rise}
            transition={{ ...rise.transition, delay: 0.1 }}
            className="mt-7 max-w-[58ch] text-[17px] leading-[1.85] text-[color:var(--ink-soft)] md:text-[19px]"
          >
            Most of what&apos;s here started with a small question: why
            doesn&apos;t this exist yet? A beat I kept missing in dance class, a
            tool I wished my laptop had, something that looked simple and turned
            out not to be. I love that moment, so I keep chasing it. Math and CS
            gave me the toolkit, building is how I keep learning, and the best
            part is when someone else picks the thing up and it just works for
            them.
          </motion.p>

          <motion.p
            {...rise}
            transition={{ ...rise.transition, delay: 0.14 }}
            className="mt-4 text-[15px] italic text-[color:var(--muted)]"
          >
            This site is a little storybook. Make yourself at home, and turn
            the pages.
          </motion.p>
        </div>

        {/* headshot — a photo torn out and laid onto the parchment */}
        <motion.figure
          {...rise}
          transition={{ ...rise.transition, delay: 0.12 }}
          className="w-[clamp(230px,30vw,320px)] shrink-0 self-center md:-mt-2 md:self-start"
        >
          <Image
            src="/more-me/headshot-torn.png"
            alt="Xinyun (Lila) Zhang"
            width={950}
            height={910}
            priority
            className="h-auto w-full -rotate-2"
          />
        </motion.figure>
      </div>

      {/* skills as a quiet constellation of tools */}
      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-9 sm:grid-cols-2">
        {SKILL_GROUPS.map((group, gi) => (
          <motion.div
            key={group.label}
            {...rise}
            transition={{ ...rise.transition, delay: 0.05 * gi }}
          >
            <h2 className="mb-4 text-[13px] tracking-[0.14em] text-[color:var(--muted)]">
              {group.label}
            </h2>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
              {group.items.map((s) => (
                <span
                  key={s.skill_name}
                  className="group flex items-center gap-2 text-[14px] text-[color:var(--ink-soft)]"
                >
                  <Image
                    src={`/skills/${s.image}`}
                    alt={s.skill_name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain opacity-85 transition-opacity group-hover:opacity-100"
                  />
                  {s.skill_name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
