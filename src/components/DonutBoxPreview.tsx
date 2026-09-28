"use client";

import { DONUT_FLAVOURS } from "@/lib/catalog";
import { mixHex } from "@/lib/color";

export interface DonutSlot {
  flavour: string;
}

const SPRINKLE_COLORS = ["#ffffff", "#6c4fc4", "#1d6fb8", "#1e7a46", "#e9a100", "#b04a76"];

function swatchFor(flavour: string): string {
  return DONUT_FLAVOURS.find((f) => f.value === flavour)?.swatch ?? "#ff8fb1";
}

const GLAZE_RING: Record<string, string> = {
  "Classic shine": "#ffffff",
  "Chocolate dip": "#4a2a1a",
  "Strawberry dip": "#ff6b8f",
  "Caramel drizzle": "#d99a4e",
  "Vanilla bean": "#f7e7c3",
};

function Donut({
  x,
  y,
  r,
  flavour,
  glaze,
  toppings,
  seed,
}: {
  x: number;
  y: number;
  r: number;
  flavour: string;
  glaze: string;
  toppings: string[];
  seed: number;
}) {
  const glazeFill = swatchFor(flavour);
  const ring = GLAZE_RING[glaze] ?? "#ffffff";
  const gid = `dg-${seed}`;
  return (
    <g>
      <defs>
        {/* Dough bakes unevenly: warm at the rim, paler where it catches light. */}
        <radialGradient id={`dough-${seed}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#f8d79b" />
          <stop offset="70%" stopColor="#f2c078" />
          <stop offset="100%" stopColor="#d99a4e" />
        </radialGradient>
        {/* Icing domes over the dough, so it needs its own light. */}
        <radialGradient id={gid} cx="0.34" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="42%" stopColor={glazeFill} />
          <stop offset="100%" stopColor={mixHex([glazeFill, "#7a3b28"])} />
        </radialGradient>
      </defs>
      {/* contact shadow so it sits in the box rather than floats */}
      <ellipse cx={x + 1} cy={y + r * 0.42} rx={r * 0.96} ry={r * 0.5} fill="#3e2a20" opacity="0.22" />
      <circle cx={x} cy={y} r={r} fill={`url(#dough-${seed})`} stroke="#3e2a20" strokeWidth="3.5" />
      {/* glaze blob */}
      <path
        d={`M${x - r * 0.92} ${y - r * 0.2}
            C${x - r * 0.9} ${y - r * 0.85} ${x - r * 0.3} ${y - r} ${x} ${y - r * 0.95}
            C${x + r * 0.5} ${y - r * 0.9} ${x + r * 0.95} ${y - r * 0.6} ${x + r * 0.9} ${y - r * 0.1}
            C${x + r * 0.85} ${y + r * 0.4} ${x + r * 0.4} ${y + r * 0.75} ${x} ${y + r * 0.7}
            C${x - r * 0.5} ${y + r * 0.65} ${x - r * 0.95} ${y + r * 0.3} ${x - r * 0.92} ${y - r * 0.2} Z`}
        fill={`url(#${gid})`}
        stroke="#3e2a20"
        strokeWidth="2.5"
      />
      {/* wet highlight — the single biggest "this looks edible" cue */}
      <ellipse
        cx={x - r * 0.34}
        cy={y - r * 0.5}
        rx={r * 0.3}
        ry={r * 0.16}
        fill="#ffffff"
        opacity="0.5"
        transform={`rotate(-24 ${x - r * 0.34} ${y - r * 0.5})`}
      />
      {/* box-level glaze drizzle */}
      <path
        d={`M${x - r * 0.6} ${y - r * 0.35} q${r * 0.6} ${-r * 0.35} ${r * 1.2} 0`}
        fill="none"
        stroke={ring}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* hole with an inner shadow so it looks punched, not painted */}
      <circle cx={x} cy={x === 0 ? 0 : y} r={r * 0.28} fill="#fff9f1" stroke="#3e2a20" strokeWidth="2.5" />
      <path
        d={`M${x - r * 0.26} ${y - r * 0.1} a${r * 0.28} ${r * 0.28} 0 0 1 ${r * 0.52} 0`}
        fill="none"
        stroke="#3e2a20"
        strokeWidth="3"
        opacity="0.28"
        strokeLinecap="round"
      />
      {/* toppings */}
      {toppings.includes("Sprinkles") &&
        Array.from({ length: 7 }).map((_, i) => {
          const a = ((seed * 137 + i * 51) % 360) * (Math.PI / 180);
          const rr = r * (0.45 + ((seed + i * 13) % 30) / 100);
          const sx = x + Math.cos(a) * rr;
          const sy = y + Math.sin(a) * rr;
          return (
            <line
              key={i}
              x1={sx}
              y1={sy}
              x2={sx + 6}
              y2={sy + 2}
              stroke={SPRINKLE_COLORS[(seed + i) % SPRINKLE_COLORS.length]}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      {toppings.includes("Chopped nuts") &&
        Array.from({ length: 5 }).map((_, i) => {
          const a = ((seed * 91 + i * 77) % 360) * (Math.PI / 180);
          return (
            <circle key={i} cx={x + Math.cos(a) * r * 0.55} cy={y + Math.sin(a) * r * 0.55} r={2.6} fill="#a06a35" />
          );
        })}
      {toppings.includes("Oreo crumbs") &&
        Array.from({ length: 4 }).map((_, i) => {
          const a = ((seed * 53 + i * 97) % 360) * (Math.PI / 180);
          return (
            <rect
              key={i}
              x={x + Math.cos(a) * r * 0.55}
              y={y + Math.sin(a) * r * 0.55}
              width={6}
              height={6}
              rx={1.5}
              fill="#2b1a12"
            />
          );
        })}
      {toppings.includes("Coconut flakes") &&
        Array.from({ length: 5 }).map((_, i) => {
          const a = ((seed * 71 + i * 61) % 360) * (Math.PI / 180);
          return (
            <circle key={i} cx={x + Math.cos(a) * r * 0.5} cy={y + Math.sin(a) * r * 0.5} r={2.2} fill="#ffffff" />
          );
        })}
      {toppings.includes("Choc chips") &&
        Array.from({ length: 4 }).map((_, i) => {
          const a = ((seed * 41 + i * 83) % 360) * (Math.PI / 180);
          return (
            <circle key={i} cx={x + Math.cos(a) * r * 0.6} cy={y + Math.sin(a) * r * 0.6} r={2.8} fill="#4a2a1a" />
          );
        })}
      {toppings.includes("Dried berries") &&
        [0, 1, 2].map((i) => {
          const a = ((seed * 29 + i * 120) % 360) * (Math.PI / 180);
          return (
            <circle key={i} cx={x + Math.cos(a) * r * 0.55} cy={y + Math.sin(a) * r * 0.55} r={3.4} fill="#6d2148" />
          );
        })}
    </g>
  );
}

const GRID: Record<number, { cols: number; r: number }> = {
  4: { cols: 2, r: 52 },
  6: { cols: 3, r: 40 },
  9: { cols: 3, r: 38 },
  12: { cols: 4, r: 30 },
};

export default function DonutBoxPreview({
  slots,
  glaze,
  toppings,
}: {
  slots: DonutSlot[];
  glaze: string;
  toppings: string[];
}) {
  const count = slots.length;
  const { cols, r } = GRID[count] ?? GRID[6];
  const rows = Math.ceil(count / cols);
  const W = 320;
  const pad = 26;
  const gapX = (W - pad * 2 - cols * r * 2) / Math.max(1, cols - 1);
  const H = pad * 2 + rows * r * 2 + (rows - 1) * 14;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Donut box preview with ${count} donuts`}>
      <defs>
        <linearGradient id="boxWall" x1="0.1" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#fdf3f7" />
          <stop offset="100%" stopColor="#efd2e0" />
        </linearGradient>
        <filter id="boxSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <rect x="4" y="16" width={W - 8} height={H - 8} rx={22} fill="#3e2a20" opacity="0.15" filter="url(#boxSoft)" />
      <rect x={4} y={4} width={W - 8} height={H - 8} rx={22} fill="url(#boxWall)" stroke="#3e2a20" strokeWidth="4" />
      <rect x={4} y={4} width={W - 8} height={30} rx={15} fill="#b04a76" opacity="0.32" />
      <text x={W / 2} y={25} textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight={700} fontSize={13} fill="#3e2a20" letterSpacing={2}>
        DONUTS & CAKES · {count}CT
      </text>
      {slots.map((s, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = pad + r + col * (r * 2 + gapX);
        const y = 44 + r + row * (r * 2 + 14);
        return (
          <Donut key={i} x={x} y={y} r={r} flavour={s.flavour} glaze={glaze} toppings={toppings} seed={i + 1} />
        );
      })}
    </svg>
  );
}
