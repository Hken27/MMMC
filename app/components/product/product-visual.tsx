"use client";

/**
 * ProductVisual — ilustrasi grid skema produk sebagai dummy visual.
 * Inline SVG (bukan <img>), jadi aman dari CSP `img-src 'self' data: blob:`
 * dan tidak butuh library external. 3 varian visual: Shisha, BBQ, Quick.
 */

type VisualVariant = "shisha" | "bbq" | "quick";

type Palette = {
  bg: string;
  card: string;
  line: string;
  accent: string;
  gold: string;
  charcoal: string;
};

export function ProductVisual({
  variant,
  className,
}: {
  variant: VisualVariant;
  className?: string;
}) {
  const palette: Palette = {
    bg: "oklch(0.12 0.01 245)",
    card: "oklch(0.21 0.012 245)",
    line: "oklch(0.28 0.012 245)",
    accent: "oklch(0.706 0.166 162)",   // emerald
    gold: "oklch(0.77 0.14 88)",        // gold
    charcoal: "oklch(0.16 0.015 245)",
  };

  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="400" height="260" fill={palette.bg} />
      {/* Grid lines */}
      <rect x="20" y="20" width="360" height="220" rx="16" fill={palette.card} stroke={palette.line} strokeWidth="1" />
      {/* Accent corner */}
      <circle cx="40" cy="40" r="80" fill={palette.accent} opacity="0.08" />

      {variant === "shisha" && <ShishaArt p={palette} />}
      {variant === "bbq" && <BriquettesArt p={palette} />}
      {variant === "quick" && <QuickLightArt p={palette} />}
    </svg>
  );
}

/** Shisha — kubus hookah dengan bulatan. */
function ShishaArt({ p }: { p: Palette }) {
  return (
    <g>
      {/* Bowl hookah */}
      <path
        d="M200 150 c-30 0 -55 -30 -55 -70 c0 -8 8 -8 8 0 c0 30 20 52 47 52 s47 -22 47 -52 c0 -8 8 -8 8 0 c0 40 -25 70 -55 70 z"
        fill={p.charcoal}
        stroke={p.accent}
        strokeWidth="2"
      />
      {/* Stem */}
      <rect x="196" y="120" width="8" height="70" rx="3" fill={p.accent} />
      {/* Base */}
      <path d="M160 195 h80 v14 h-80 z" fill={p.gold} opacity="0.85" />
      <ellipse cx="200" cy="209" rx="42" ry="8" fill={p.accent} opacity="0.25" />
      {/* Ember glow */}
      <circle cx="200" cy="150" r="26" fill={p.gold} opacity="0.18" />
      <circle cx="200" cy="150" r="12" fill={p.gold} opacity="0.35" />
    </g>
  );
}

/** BBQ — tumpukan stick arang di atas bara. */
function BriquettesArt({ p }: { p: Palette }) {
  return (
    <g>
      {/* Firebox */}
      <path
        d="M120 180 h160 l16 24 h-192 z"
        fill={p.charcoal}
        stroke={p.line}
        strokeWidth="2"
      />
      {/* Glow embers */}
      <ellipse cx="200" cy="196" rx="72" ry="14" fill={p.gold} opacity="0.4" />
      <circle cx="180" cy="194" r="7" fill={p.gold} opacity="0.7" />
      <circle cx="215" cy="192" r="5" fill={p.accent} opacity="0.6" />
      <circle cx="200" cy="198" r="4" fill={p.gold} opacity="0.8" />
      {/* Briquette sticks */}
      {[145, 180, 215, 250].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={i % 2 === 0 ? 112 : 124}
          width="14"
          height="62"
          rx="7"
          fill={p.charcoal}
          stroke={p.accent}
          strokeWidth="1.5"
          opacity={0.85 + 0.05 * i}
        />
      ))}
      {/* Smoke wisps */}
      <path d="M160 100 c6 -12 -6 -20 0 -32" stroke={p.line} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M240 96 c6 -10 -6 -18 0 -28" stroke={p.line} strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Quick — arang kubus dengan lidah api. */
function QuickLightArt({ p }: { p: Palette }) {
  return (
    <g>
      {/* Charcoal cubes */}
      <rect x="140" y="168" width="52" height="40" rx="6" fill={p.charcoal} stroke={p.accent} strokeWidth="1.5" />
      <rect x="212" y="168" width="52" height="40" rx="6" fill={p.charcoal} stroke={p.accent} strokeWidth="1.5" />
      <rect x="176" y="132" width="52" height="40" rx="6" fill={p.charcoal} stroke={p.gold} strokeWidth="1.5" opacity="0.9" />
      {/* Flame */}
      <path
        d="M200 40 c-14 0 -26 18 -20 34 c5 12 -3 20 -8 16 c-6 -5 -8 -14 -4 -22 c-16 12 -22 32 -14 46 c6 12 18 18 30 14 c8 -3 12 -10 10 -18 c3 8 10 12 18 10 c14 -4 22 -20 16 -36 c-2 9 -10 14 -14 10 c-6 -7 0 -22 6 -36 c-7 4 -12 1 -12 -4 c-4 4 -8 6 -8 6 z"
        fill={p.gold}
        opacity="0.9"
      />
      {/* Inner flame */}
      <path
        d="M200 60 c-8 0 -14 10 -12 18 c2 7 -2 12 -6 10 c-3 -2 -4 -8 -2 -12 c-8 6 -10 16 -6 24 c3 6 9 9 15 6 c4 -2 6 -6 5 -9 c2 4 6 6 10 5 c7 -2 11 -10 8 -18 c-1 4 -5 7 -8 5 c-4 -3 0 -11 3 -18 c-4 2 -6 1 -6 -2 c-2 2 -5 3 -5 3 z"
        fill={p.accent}
      />
    </g>
  );
}