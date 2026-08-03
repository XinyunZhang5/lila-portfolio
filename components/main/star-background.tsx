"use client";

import { useEffect, useRef } from "react";

import { useBook } from "@/components/main/book-context";
import { PAPER_GRADIENT, ParchmentTexture } from "@/components/main/parchment";

/**
 * The book's backdrop. Night = a hand-built Little Prince sky, slow and
 * twinkling. Day = warm parchment. Both are one fixed layer behind every page.
 */

// shared so a turning page can paint an opaque sky that matches the backdrop
export const SKY_GRADIENT =
  "radial-gradient(120% 68% at 50% 116%, rgba(232,196,124,0.16), transparent 56%)," +
  "radial-gradient(90% 70% at 84% 6%, rgba(126,176,196,0.12), transparent 55%)," +
  "linear-gradient(178deg, #101a34 0%, #152540 44%, #1b3350 74%, #24405a 100%)";

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  amp: number;
  speed: number;
  phase: number;
  depth: number;
  color: [number, number, number];
};

// warm cream, pale gold, gold, cool white, rare peach
const PALETTE: [number, number, number][] = [
  [253, 246, 227],
  [246, 231, 189],
  [242, 207, 122],
  [223, 234, 242],
  [247, 183, 163],
];

function makeStars(count: number, rand: () => number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const roll = rand();
    const color =
      roll > 0.97
        ? PALETTE[4]
        : roll > 0.82
          ? PALETTE[2]
          : roll > 0.62
            ? PALETTE[1]
            : roll > 0.3
              ? PALETTE[0]
              : PALETTE[3];
    const big = rand() > 0.9;
    stars.push({
      x: rand(),
      y: rand(),
      r: big ? 1.3 + rand() * 1.1 : 0.4 + rand() * 0.9,
      base: 0.35 + rand() * 0.5,
      amp: 0.25 + rand() * 0.45,
      speed: 0.25 + rand() * 0.9,
      phase: rand() * Math.PI * 2,
      depth: 0.3 + rand() * 0.7,
      color,
    });
  }
  return stars;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const StarsCanvas = () => {
  const { theme } = useBook();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // day: no stars, just paper. Keep the canvas clear.
    if (theme === "day") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = Math.round((w * h) / 6500);
      stars = makeStars(Math.max(120, Math.min(420, density)), mulberry32(7));
    };

    const draw = (tSec: number) => {
      ctx.clearRect(0, 0, w, h);
      const drift = (tSec * 5) % (h + 40);
      for (const s of stars) {
        const twinkle = reduce
          ? s.base
          : s.base + s.amp * Math.sin(tSec * s.speed + s.phase);
        const alpha = Math.max(0, Math.min(1, twinkle));
        const px = s.x * w;
        const py = reduce ? s.y * h : (s.y * h + drift * s.depth) % (h + 20);
        const [r, g, b] = s.color;

        if (s.r > 1.2) {
          const grad = ctx.createRadialGradient(px, py, 0, px, py, s.r * 4);
          grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.9})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    let start = 0;
    const loop = (now: number) => {
      if (!start) start = now;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  const isNight = theme === "night";

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{ background: isNight ? SKY_GRADIENT : PAPER_GRADIENT }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* parchment texture, day only */}
      {!isNight && <ParchmentTexture />}
    </div>
  );
};
