// Shared parchment surface. Used for the day-mode backdrop AND the back of a
// turning page, so the folded corner is literally the same paper, told apart
// only by shading and shadow.

// warm parchment base: light neutral cream with a soft page-light + edge vignette
export const PAPER_GRADIENT =
  "radial-gradient(120% 100% at 50% 46%, transparent 58%, rgba(120,108,84,0.07) 100%)," +
  "radial-gradient(120% 130% at 50% -8%, #edeae1 0%, #e7e3d8 58%, #e1dccf 100%)";

// fine paper tooth, desaturated so the noise is tonal, not coloured
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.32' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// short horizontal fibres, the thread of real parchment / cotton stock
const FIBERS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='v'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.016 0.5' numOctaves='2' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23v)'/%3E%3C/svg%3E\")";

// soft large-scale mottling, the cloudy tone variation of real parchment
const MOTTLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.014' numOctaves='3' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E\")";

// scattered darker fibre flecks, tinted a warm sepia so they read on cream
const FLECKS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='1' seed='9' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 0 0 0 0 0 1'/%3E%3C/feComponentTransfer%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.24 0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")";

const LAYERS = [
  { image: MOTTLE, size: "1000px 1000px", opacity: 0.16 },
  { image: FIBERS, size: "320px 320px", opacity: 0.14 },
  { image: GRAIN, size: "220px 220px", opacity: 0.2 },
  { image: FLECKS, size: "400px 400px", opacity: 0.28 },
] as const;

/** the four texture layers, transparent so they sit over any paper-coloured base */
export const ParchmentTexture = () => (
  <>
    {LAYERS.map((l, i) => (
      <div
        key={i}
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: l.image,
          backgroundSize: l.size,
          opacity: l.opacity,
        }}
      />
    ))}
  </>
);
