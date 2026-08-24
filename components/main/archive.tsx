"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { COVERS, COVER_H, COVER_W, coverSrc } from "@/constants/covers";

const Z_STEP = 72;
const ROT_X = -13;
const ROT_Y = -30;

export const Archive = () => {
  const covers = COVERS;
  const [hovered, setHovered] = useState(-1);
  const [selected, setSelected] = useState(-1);
  const [coverW, setCoverW] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);

  // keep the pile in proportion to whatever room the canvas actually has.
  // Measuring before paint (rather than in a plain effect) means the pile is
  // never briefly laid out at a guessed width and then snapped to the real one.
  useLayoutEffect(() => {
    const fit = () => {
      const w = canvasRef.current?.clientWidth ?? 900;
      const h = canvasRef.current?.clientHeight ?? 700;
      setCoverW(Math.max(180, Math.min(320, w * 0.28, h * 0.42)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const coverAt = useCallback((x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    const cov = el?.closest?.("[data-cover-index]") as HTMLElement | null;
    return cov ? Number(cov.dataset.coverIndex) : -1;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const shown = selected >= 0 ? covers[selected] : null;

  return (
    <section
      id="projects"
      className="relative flex min-h-full w-full flex-col lg:flex-row"
    >
      {/* ---------- left column ---------- */}
      <aside className="flex w-full flex-col border-b border-[color:var(--hair)] px-8 py-12 pt-24 lg:w-[clamp(300px,28%,420px)] lg:border-b-0 lg:border-r lg:px-12 lg:py-20">
        <div>
          <span
            className="text-[15px] tracking-[0.05em] text-[color:var(--accent)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Chapter II
          </span>
          <span className="ml-3 align-middle text-[color:var(--accent)] opacity-50">
            ✦
          </span>
        </div>

        <h2
          className="mt-4 text-[40px] leading-none text-[color:var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The Archive
        </h2>

        <p className="mt-6 max-w-[32ch] text-[17px] italic leading-relaxed text-[color:var(--ink-soft)]">
          A shelf of things I wished existed, then built. Every cover was
          painted for its own story.
        </p>

        <div className="my-10 h-px w-full bg-[color:var(--hair)]" />

        <p
          className="text-[12px] leading-relaxed text-[color:var(--muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {String(covers.length).padStart(2, "0")} ISSUES · 2024-2026
          <br />
          <span className="opacity-70">
            Hover to browse, click to open an issue.
          </span>
        </p>

        {selected >= 0 && (
          <button
            onClick={() => setSelected(-1)}
            className="mt-8 w-fit border border-[color:var(--accent)] px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[color:var(--accent-strong)] transition-colors hover:text-[color:var(--ink)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Close issue (Esc)
          </button>
        )}
      </aside>

      {/* ---------- right canvas ---------- */}
      <div
        ref={canvasRef}
        className="relative min-h-[70vh] flex-1 overflow-hidden lg:min-h-full"
        style={{ perspective: "2200px", perspectiveOrigin: "48% 42%" }}
        onMouseMove={(e) => {
          if (selected >= 0) return;
          const i = coverAt(e.clientX, e.clientY);
          if (i !== hovered) setHovered(i);
        }}
        onMouseLeave={() => setHovered(-1)}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-detail]")) return;
          const i = coverAt(e.clientX, e.clientY);
          setSelected((prev) => (i < 0 || prev === i ? -1 : i));
          setHovered(-1);
        }}
      >
        <div
          className="absolute left-[25%] top-[60%] h-0 w-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${ROT_X}deg) rotateY(${ROT_Y}deg)`,
          }}
        >
          {covers.map((c, i) => {
            const base = i * -Z_STEP;
            let y = 0;
            let z = base;

            if (selected >= 0) {
              // the chosen issue stays at its own depth and is simply lifted
              // out of the pile, never yanked to the front
              if (i === selected) {
                y = -200;
                z = base + 34;
              }
            } else if (hovered >= 0) {
              if (i === hovered) {
                y = -64;
                z = base + 40;
              } else if (i > hovered) {
                z = base - 70;
              }
            }

            const dimmed = selected >= 0 && i !== selected;

            return (
              <article
                key={c.id}
                data-cover-index={i}
                className="absolute cursor-pointer"
                style={{
                  width: coverW,
                  aspectRatio: "4 / 5",
                  left: -coverW / 2,
                  top: (-coverW * 1.25) / 2,
                  transformStyle: "preserve-3d",
                  transform: `translate3d(0,${y}px,${z}px)`,
                  // keep every issue in its true stacking order: a lifted cover
                  // is still behind the ones in front of it, so their faded
                  // ghosts keep veiling its lower-left corner
                  zIndex: covers.length - i,
                  boxShadow:
                    i === selected
                      ? "0 44px 90px rgba(0,0,0,.55)"
                      : "0 18px 44px rgba(0,0,0,.45)",
                  filter: dimmed ? "grayscale(1)" : "none",
                  opacity: dimmed ? 0.28 : 1,
                  transition:
                    "transform 520ms cubic-bezier(.22,.61,.36,1), opacity 400ms ease, filter 400ms ease",
                  willChange: "transform",
                }}
              >
                {/* black spine = the thickness of the book */}
                <span
                  aria-hidden
                  className="absolute bottom-0 top-0 right-full w-[12px] bg-[#111]"
                />
                {/* Eager, never lazy: these sit inside a `perspective` +
                    translate3d stack, where the browser's lazy-loading
                    viewport test is unreliable and can stall a cover until
                    something else on the page moves. The pre-built WebP is
                    ~30KB, and the book pre-warms all six before you get here,
                    so they are normally already in cache.
                    `unoptimized` keeps the URL exactly as written, which is
                    what makes that pre-warm hit. */}
                <Image
                  src={coverSrc(c.id)}
                  alt={`${c.title_en} — ${c.title}`}
                  width={COVER_W}
                  height={COVER_H}
                  sizes="320px"
                  loading="eager"
                  unoptimized
                  className="block h-full w-full object-cover"
                />
              </article>
            );
          })}
        </div>

        {/* ---------- detail panel ---------- */}
        <div
          data-detail
          className="pointer-events-none absolute bottom-[22%] right-[6%] max-w-[360px] border-r border-[color:var(--accent)] pr-6 text-right transition-all duration-500"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : "translateY(12px)",
            transitionDelay: shown ? "200ms" : "0ms",
            pointerEvents: shown ? "auto" : "none",
          }}
        >
          {shown && (
            <>
              <div
                className="text-[21px] tracking-[0.06em] text-[color:var(--ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {shown.date}
              </div>
              <div
                className="mt-2 text-[12px] text-[color:var(--muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {shown.issue} · Artist: {shown.artist}
              </div>
              <p
                className="mt-4 text-[13px] leading-[1.75] text-[color:var(--ink-soft)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {shown.note}
              </p>
              {shown.stack && (
                <div
                  className="mt-4 text-[11px] tracking-[0.04em] text-[color:var(--muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {shown.stack.join(" · ")}
                </div>
              )}
              {shown.link && (
                <Link
                  href={shown.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-block border-b border-[color:var(--accent)] pb-0.5 text-[12px] tracking-[0.04em] text-[color:var(--accent-strong)] hover:text-[color:var(--ink)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  VIEW PROJECT →
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
