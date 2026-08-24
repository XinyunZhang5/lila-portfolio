"use client";

import { useEffect, useRef } from "react";

import { Archive } from "@/components/main/archive";
import { LAST_PAGE, useBook } from "@/components/main/book-context";
import { Cover } from "@/components/main/cover";
import { MoreMe } from "@/components/main/more-me";
import { ParchmentTexture } from "@/components/main/parchment";
import { Prologue } from "@/components/main/prologue";
import { COVERS, coverSrc } from "@/constants/covers";

// A symmetric ~45deg dog-ear: the corner rolls diagonally up-and-in, so the
// rolled tip sits clearly inside the page at (W - CX*vL, H - CY*vL). `vL` is how
// far the fold has climbed the side edge (equal to how far it walks the bottom).
const R = 1; // tan(45deg): the crease is a clean diagonal
const CX = 1; // tip x-offset per unit vL (reflection of a 45deg fold)
const CY = 1; // tip y-offset per unit vL
const HOVER = 128; // resting curl size on hover
const BULGE = 0.16; // how round the curl's outer edge reads (fraction of vL)
// the curl is always a CORNER ornament: never let it grow past this, so it can
// never sweep the page or throw a stray shadow into the far corners
const maxCurl = (w: number, h: number) => 0.6 * Math.min(w, h);

type Side = "r" | "l";
type Phase = "idle" | "hover" | "drag" | "anim";

function pageNode(i: number) {
  switch (i) {
    case 0:
      return <Cover />;
    case 1:
      return <Prologue />;
    case 2:
      return <Archive />;
    case 3:
      return <MoreMe />;
    default:
      return null;
  }
}

export const Book = () => {
  const { page, theme, next, prev } = useBook();

  const stageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const foldRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  // everything visual is driven imperatively through refs, so the fold never
  // triggers a React re-render (and never disturbs the rest of the page)
  const sideRef = useRef<Side>("r");
  const phaseRef = useRef<Phase>("idle");
  const dims = useRef({ w: 0, h: 0 });
  const startPt = useRef({ x: 0, y: 0 });
  const committing = useRef(false);
  const turnedRef = useRef(false);
  const timer = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
  };
  const setSide = (s: Side) => {
    sideRef.current = s;
  };

  const canNext = page < LAST_PAGE;
  const canPrev = page > 0;

  const setTransition = (on: boolean, dur = 0.5) => {
    if (topRef.current)
      topRef.current.style.transition = on
        ? `clip-path ${dur}s cubic-bezier(.22,.61,.36,1), opacity ${(dur * 0.85).toFixed(2)}s ease`
        : "clip-path 0s, opacity 0s";
    if (foldRef.current)
      foldRef.current.style.transition = on
        ? `clip-path ${dur}s cubic-bezier(.22,.61,.36,1), opacity 0.26s ease`
        : "clip-path 0s, opacity 0.26s ease";
  };

  const measure = () => {
    const r = stageRef.current?.getBoundingClientRect();
    dims.current = { w: r?.width ?? 0, h: r?.height ?? 0 };
    return r;
  };

  // a rounded, gradient-shaded curl. The curl silhouette is the reflected
  // corner triangle P1-P2-C', but its two free edges bow OUT (beziers) so the
  // roll reads as a soft tube, and a corner-anchored radial gradient shades it
  // like a cylinder (valley shadow -> highlight crown -> curled-under lip).
  const paint = (side: Side, vLraw: number) => {
    const { w, h } = dims.current;
    const top = topRef.current;
    const fold = foldRef.current;
    const shade = shadeRef.current;
    if (!top || !fold) return;
    const vL = Math.max(0, Math.min(vLraw, maxCurl(w, h)));
    const hL = R * vL;
    const b = BULGE * vL;
    const f = (n: number) => n.toFixed(1);
    fold.style.opacity = "1";

    // crease foot (bottom edge), crease top (side edge), reflected tip
    const dir = side === "r" ? 1 : -1;
    const P1x = side === "r" ? w - hL : hL;
    const P2x = side === "r" ? w : 0;
    const Cx = side === "r" ? w - CX * vL : CX * vL;
    const P1y = h;
    const P2y = h - vL;
    const Cy = h - CY * vL;
    // outward normal (points from the crease toward the tip), scaled by bulge
    const L = Math.hypot(hL, vL) || 1;
    const nx = (-dir * vL) / L * b;
    const ny = (-hL / L) * b;
    const c1x = (P2x + Cx) / 2 + nx;
    const c1y = (P2y + Cy) / 2 + ny;
    const c2x = (Cx + P1x) / 2 + nx;
    const c2y = (Cy + P1y) / 2 + ny;

    fold.style.clipPath = `path("M ${f(P1x)} ${f(P1y)} L ${f(P2x)} ${f(P2y)} Q ${f(c1x)} ${f(c1y)} ${f(Cx)} ${f(Cy)} Q ${f(c2x)} ${f(c2y)} ${f(P1x)} ${f(P1y)} Z")`;

    // current page: the corner triangle is removed so the curl lifts off it.
    // What shows through the notch is the shared backdrop, never the next page.
    const ax = side === "r" ? Math.max(0, w - hL) : Math.min(w, hL);
    const by = Math.max(0, h - vL);
    top.style.clipPath =
      side === "r"
        ? `polygon(0px 0px, ${w}px 0px, ${w}px ${by}px, ${ax}px ${h}px, 0px ${h}px)`
        : `polygon(${w}px 0px, 0px 0px, 0px ${by}px, ${ax}px ${h}px, ${w}px ${h}px)`;

    // thick, soft, warm cast shadow follows the curved silhouette
    fold.style.filter =
      side === "r"
        ? "drop-shadow(-16px 11px 22px var(--fold-shadow)) drop-shadow(-3px 3px 3px rgba(0,0,0,0.24))"
        : "drop-shadow(16px 11px 22px var(--fold-shadow)) drop-shadow(3px 3px 3px rgba(0,0,0,0.24))";

    // cylinder shading, anchored at the page corner so it stays put on the roll.
    // Radius reaches out to the diagonal tip (~1.41*vL) so the highlight crown
    // lands on the middle of the roll and the curled-under tip stays in shadow.
    if (shade) {
      // restore full cover (the turn animation shrinks this to a strip)
      shade.style.left = "0px";
      shade.style.right = "0px";
      shade.style.width = "auto";
      const rad = f(1.55 * vL);
      const at = side === "r" ? "100% 100%" : "0% 100%";
      shade.style.backgroundImage =
        `radial-gradient(${rad}px ${rad}px at ${at},` +
        " rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.12) 24%," +
        " rgba(255,255,255,0.46) 54%, rgba(255,255,255,0.12) 78%," +
        " rgba(0,0,0,0.18) 100%)";
    }
  };

  const goIdle = (animated = true) => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    committing.current = false;
    setTransition(animated);
    if (topRef.current) topRef.current.style.transform = "none";
    if (foldRef.current) foldRef.current.style.transform = "none";
    paint(sideRef.current, 0);
    if (foldRef.current) foldRef.current.style.opacity = "0";
    if (topRef.current) topRef.current.style.opacity = "1";
    document.body.style.userSelect = "";
    setPhase("idle");
  };

  // resting curl: a clearly readable dog-ear, roughly the grab corner's height
  const hoverSize = () => Math.min(HOVER, (dims.current.h / 6) * 1.12);

  const hoverSide = (s: Side) => {
    if (phaseRef.current === "drag" || phaseRef.current === "anim") return;
    if ((s === "r" && !canNext) || (s === "l" && !canPrev)) return;
    measure();
    const fresh = phaseRef.current === "idle" || sideRef.current !== s;
    setSide(s);
    setPhase("hover");
    if (fresh) {
      setTransition(false);
      paint(s, 6);
      void foldRef.current?.offsetWidth; // reflow so it grows in
    }
    setTransition(true);
    paint(s, hoverSize());
  };

  const onMove = (e: PointerEvent) => {
    if (committing.current) return;
    const r = measure();
    if (!r) return;
    const s = sideRef.current;
    // the curl does NOT track the pointer — it stays a steady dog-ear. We only
    // watch for a decisive pull toward the spine, then play one fixed turn.
    const dragX =
      s === "r" ? startPt.current.x - e.clientX : e.clientX - startPt.current.x;
    if (dragX >= r.width * 0.18) commit(s);
  };

  const TURN_DUR = 0.72; // one fixed, unhurried turn every time

  // --- the turn: a horizontal page-flip, driven frame by frame ---------------
  // A slightly slanted crease is lifted from the corner and carried ALL the way
  // to the far edge; the flap (the page's back) rides just behind it and fades
  // to nothing. Behind the crease is only the backdrop, so the next chapter is
  // never seen until the flip is over. Nothing here reads the pointer.
  const TILT = 0.12; // the bottom leads, so it feels grabbed at the corner
  const clamp = (n: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, n));

  const paintTurn = (side: Side, prog: number) => {
    const { w, h } = dims.current;
    const top = topRef.current;
    const fold = foldRef.current;
    const shade = shadeRef.current;
    if (!top || !fold) return;
    const tilt = TILT * w;
    fold.style.opacity = String(clamp(1 - prog * 1.12, 0, 1));

    if (side === "r") {
      // crease travels right -> left; flat page stays on the left of it
      const XcT = clamp(w * (1 - prog), 0, w); // crease x at the top
      const XcB = clamp(XcT - tilt, 0, w); // ...and at the bottom (leads left)
      const LsT = clamp(2 * XcT - w, 0, w); // flat page's right edge (top)
      const LsB = clamp(2 * XcB - w, 0, w); // ...and bottom
      top.style.clipPath = `polygon(0px 0px, ${LsT}px 0px, ${LsB}px ${h}px, 0px ${h}px)`;
      fold.style.clipPath = `polygon(${LsT}px 0px, ${XcT}px 0px, ${XcB}px ${h}px, ${LsB}px ${h}px)`;
      fold.style.filter = "drop-shadow(-10px 0 14px var(--fold-shadow))";
      if (shade) {
        const l = Math.min(LsT, LsB);
        shade.style.left = `${l}px`;
        shade.style.right = "auto";
        shade.style.width = `${Math.max(1, Math.max(XcT, XcB) - l)}px`;
        shade.style.backgroundImage =
          "linear-gradient(90deg, rgba(0,0,0,0.17) 0%, rgba(0,0,0,0.04) 55%, rgba(255,255,255,0.4) 100%)";
      }
    } else {
      // mirror image: crease travels left -> right, flat page on the right
      const XcT = clamp(w * prog, 0, w);
      const XcB = clamp(XcT + tilt, 0, w);
      const RsT = clamp(2 * XcT, 0, w);
      const RsB = clamp(2 * XcB, 0, w);
      top.style.clipPath = `polygon(${RsT}px 0px, ${w}px 0px, ${w}px ${h}px, ${RsB}px ${h}px)`;
      fold.style.clipPath = `polygon(${XcT}px 0px, ${RsT}px 0px, ${RsB}px ${h}px, ${XcB}px ${h}px)`;
      fold.style.filter = "drop-shadow(10px 0 14px var(--fold-shadow))";
      if (shade) {
        const l = Math.min(XcT, XcB);
        shade.style.left = `${l}px`;
        shade.style.right = "auto";
        shade.style.width = `${Math.max(1, Math.max(RsT, RsB) - l)}px`;
        shade.style.backgroundImage =
          "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0.17) 100%)";
      }
    }
  };

  const commit = (side: Side) => {
    if (committing.current) return;
    committing.current = true;
    window.removeEventListener("pointermove", onMove);
    document.body.style.userSelect = "";
    setPhase("anim");
    const top = topRef.current;
    const fold = foldRef.current;
    // hand control to the frame loop: no CSS transitions, no leftover transform
    if (top) {
      top.style.transition = "none";
      top.style.transform = "none";
      top.style.opacity = "1";
    }
    if (fold) {
      fold.style.transition = "none";
      fold.style.transform = "none";
    }
    if (raf.current) cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const dur = TURN_DUR * 1000;
    const step = (now: number) => {
      const t = clamp((now - t0) / dur, 0, 1);
      const prog = Math.pow(t, 1.5); // ease-in: the tail whips across fast
      paintTurn(side, prog);
      if (t < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        raf.current = null;
        turnedRef.current = true;
        if (side === "r") next();
        else prev();
      }
    };
    raf.current = requestAnimationFrame(step);
  };

  const onUp = (e: PointerEvent) => {
    window.removeEventListener("pointermove", onMove);
    if (committing.current) return;
    document.body.style.userSelect = "";
    const s = sideRef.current;
    const moved = Math.hypot(
      e.clientX - startPt.current.x,
      e.clientY - startPt.current.y
    );
    if (moved < 8) commit(s); // a tap on the corner turns too
    else goIdle(true);
  };

  const onGrabDown = (side: Side, e: React.PointerEvent) => {
    if ((side === "r" && !canNext) || (side === "l" && !canPrev)) return;
    e.preventDefault(); // never start a text selection
    document.body.style.userSelect = "none";
    measure();
    setSide(side);
    startPt.current = { x: e.clientX, y: e.clientY };
    committing.current = false;
    setPhase("drag");
    // a small, fixed "press" enlarge for tactile feedback — independent of where
    // the pointer is, so the corner never jitters with the mouse
    setTransition(true, 0.16);
    paint(side, hoverSize() * 1.22);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  };

  // settle to hidden whenever the page changes, and keep dims fresh on resize
  useEffect(() => {
    measure();
    if (turnedRef.current) {
      // a turn just finished: the new page is mounted but was hidden by the
      // commit timer. Reset the curl and fade the fresh page in — this is the
      // first moment the next chapter is allowed to be seen.
      turnedRef.current = false;
      committing.current = false;
      const top = topRef.current;
      const fold = foldRef.current;
      // clear the lift transforms and collapse the curl instantly...
      [top, fold].forEach((el) => {
        if (!el) return;
        el.style.transition = "none";
        el.style.transform = "none";
      });
      paint(sideRef.current, 0);
      if (fold) fold.style.opacity = "0";
      // ...then fade the fresh page in — the first moment it may be seen
      if (top) {
        top.style.opacity = "0";
        top.style.clipPath = "none";
        void top.offsetWidth; // reflow so the fade actually runs
        top.style.transition = "opacity 0.34s ease";
        top.style.opacity = "1";
      }
      document.body.style.userSelect = "";
      setPhase("idle");
    } else {
      goIdle(false);
    }
    const onResize = () => {
      measure();
      if (phaseRef.current === "idle") goIdle(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (timer.current) window.clearTimeout(timer.current);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only the current page is mounted, so chapter II's covers would otherwise
  // not start downloading until the moment you turn to them. Pull them into
  // cache once the first page has settled — ~200KB total, fetched while the
  // reader is still reading, so the archive paints in one piece.
  useEffect(() => {
    const warm = () =>
      COVERS.forEach((c) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = coverSrc(c.id);
      });

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(warm, 1200);
    return () => window.clearTimeout(id);
  }, []);

  // ?peek=r|l pops the fold open on load (handy for previews)
  useEffect(() => {
    const peek = new URLSearchParams(window.location.search).get("peek");
    if (peek === "r" || peek === "l") {
      const t = window.setTimeout(() => hoverSide(peek), 500);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cornerStyle = { width: `${100 / 7}%`, height: `${100 / 6}%` };

  return (
    <main ref={stageRef} className="fixed inset-0 overflow-hidden">
      {/* current page — always transparent, so pressing the corner changes
          nothing but the corner itself. The next chapter is never mounted here
          until a turn completes, so it can't peek through the lifted corner. */}
      <div
        ref={topRef}
        className="scrollbar-hidden absolute inset-0 overflow-y-auto"
        style={{ willChange: "clip-path" }}
      >
        {pageNode(page)}
      </div>

      {/* the folded corner: the same parchment as the page, read as a fold only
          through its shading + cast shadow. Purely visual (no pointer events). */}
      <div
        ref={foldRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40 opacity-0"
        style={{
          backgroundColor: "var(--fold-back)",
          isolation: "isolate",
          willChange: "clip-path",
        }}
      >
        {theme === "day" && <ParchmentTexture />}
        <div ref={shadeRef} className="absolute inset-0" />
      </div>

      {/* grab corners: hovering reveals the fold, pressing + dragging turns it */}
      {canNext && (
        <div
          className="absolute bottom-0 right-0 z-40 cursor-grab touch-none select-none active:cursor-grabbing"
          style={cornerStyle}
          onPointerEnter={() => hoverSide("r")}
          onPointerMove={() => {
            if (phaseRef.current === "idle") hoverSide("r");
          }}
          onPointerLeave={() => {
            if (phaseRef.current === "hover") goIdle(true);
          }}
          onPointerDown={(e) => onGrabDown("r", e)}
        />
      )}
      {canPrev && (
        <div
          className="absolute bottom-0 left-0 z-40 cursor-grab touch-none select-none active:cursor-grabbing"
          style={cornerStyle}
          onPointerEnter={() => hoverSide("l")}
          onPointerMove={() => {
            if (phaseRef.current === "idle") hoverSide("l");
          }}
          onPointerLeave={() => {
            if (phaseRef.current === "hover") goIdle(true);
          }}
          onPointerDown={(e) => onGrabDown("l", e)}
        />
      )}
    </main>
  );
};
