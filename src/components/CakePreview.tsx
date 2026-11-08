"use client";

import { lighten, mixHex } from "@/lib/color";
import { cn } from "@/lib/utils";

export interface CakePreviewProps {
  shape: string; // round | square | heart
  size?: string; // 6" | 8" | 10" | 12"
  sponge: string; // hex
  frosting: string; // hex
  frostingKind: string;
  filling?: string;
  toppings: string[];
  inscription: string;
  gold?: boolean;
}

const INK = "#2b1c15";
const SPRINKLE_COLORS = ["#b04a76", "#6c4fc4", "#1d6fb8", "#1e7a46", "#e9a100", "#ff8a4c"];

const SIZE_SCALE: Record<string, number> = {
  '6"': 0.8,
  '8"': 1,
  '10"': 1.11,
  '12"': 1.21,
};

const FILL_HEX: Record<string, string> = {
  None: "",
  "Chocolate ganache": "#4a2a1a",
  "Strawberry jam": "#d83a52",
  Caramel: "#c07a1e",
  "Cream cheese": "#fdf3e0",
  "Lemon curd": "#f0cf4a",
};

const CX = 160;
const CY = 160;
const R = 100;
const SIDE = 22; // how much of the cake wall is visible from above

/** Heart, drawn to fill roughly the same footprint as the R-radius circle. */
const HEART =
  "M160 242 C116 210, 62 178, 62 128 C62 96, 88 76, 116 76 C137 76, 154 88, 162 108 C170 88, 187 76, 208 76 C236 76, 262 96, 262 128 C262 178, 204 210, 160 242 Z";

type ShapeProps = Record<string, unknown>;

/** The same silhouette at any radius — used for the top, the wall, the clip and the piping. */
function face(shape: string, r: number, props: ShapeProps) {
  if (shape === "square") {
    return <rect x={CX - r} y={CY - r} width={r * 2} height={r * 2} rx={r * 0.2} {...props} />;
  }
  if (shape === "heart") {
    const k = (r / 100) * 1.12;
    return (
      <path d={HEART} transform={`translate(${CX} ${CY}) scale(${k}) translate(${-CX} ${-CY + 6})`} {...props} />
    );
  }
  return <circle cx={CX} cy={CY} r={r} {...props} />;
}

function Toppings({ toppings, r, hasText }: { toppings: string[]; r: number; hasText: boolean }) {
  const ring = r * (hasText ? 0.62 : 0.6);
  const at = (i: number, n: number, spread = 1) => {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2;
    const wobble = ((i * 37) % 9) - 4;
    return {
      x: CX + Math.cos(t) * ring * spread,
      y: CY + Math.sin(t) * ring * spread + wobble * 0.18,
    };
  };

  return (
    <g>
      {toppings.includes("Sprinkles") &&
        Array.from({ length: 20 }).map((_, i) => {
          const p = at(i, 20);
          const a = (i * 47) % 180;
          return (
            <line
              key={`sp-${i}`}
              x1={p.x - 5}
              y1={p.y - 1.6}
              x2={p.x + 5}
              y2={p.y + 1.6}
              stroke={SPRINKLE_COLORS[i % SPRINKLE_COLORS.length]}
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${a} ${p.x} ${p.y})`}
            />
          );
        })}

      {toppings.includes("Chocolate shavings") &&
        Array.from({ length: 10 }).map((_, i) => {
          const p = at(i, 10, 0.92);
          return (
            <rect
              key={`sh-${i}`}
              x={p.x - 8}
              y={p.y - 2.2}
              width="16"
              height="4.5"
              rx="2"
              fill="#4a2a1a"
              transform={`rotate(${(i * 43) % 90 - 45} ${p.x} ${p.y})`}
            />
          );
        })}

      {toppings.includes("Toasted coconut") &&
        Array.from({ length: 15 }).map((_, i) => {
          const p = at(i, 15, 0.95);
          return <circle key={`co-${i}`} cx={p.x} cy={p.y} r="3.1" fill="#fdf3e0" stroke="#d9b77c" strokeWidth="1.2" />;
        })}

      {toppings.includes("Gold dust") &&
        Array.from({ length: 16 }).map((_, i) => {
          const p = at(i, 16, 1.02);
          return (
            <g key={`go-${i}`}>
              <circle cx={p.x} cy={p.y} r="2.1" fill="#e9a100" />
              <path d={`M${p.x - 4.5} ${p.y} h9 M${p.x} ${p.y - 4.5} v9`} stroke="#e9a100" strokeWidth="1.4" strokeLinecap="round" />
            </g>
          );
        })}

      {toppings.includes("Oreo crunch") &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const p = at(i, 6, 0.85);
          return (
            <g key={`or-${i}`}>
              <circle cx={p.x} cy={p.y + 2.5} r="9" fill={INK} opacity="0.22" />
              <circle cx={p.x} cy={p.y} r="9" fill="#2b1a12" stroke={INK} strokeWidth="2.5" />
              <circle cx={p.x} cy={p.y} r="4" fill="#f3e8d5" />
            </g>
          );
        })}

      {toppings.includes("Fresh berries") &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const p = at(i, 6, 0.82);
          return (
            <g key={`be-${i}`}>
              <circle cx={p.x} cy={p.y + 3} r="11" fill={INK} opacity="0.22" />
              <circle cx={p.x} cy={p.y} r="11" fill={i % 2 ? "#6d2148" : "#5b2a86"} stroke={INK} strokeWidth="3" />
              <circle cx={p.x - 3.5} cy={p.y - 4} r="3.4" fill="#ffffff" opacity="0.8" />
            </g>
          );
        })}

      {toppings.includes("Cherries") &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const p = at(i, 6, 0.8);
          return (
            <g key={`ch-${i}`}>
              <path d={`M${p.x} ${p.y - 4} q7 -13 17 -14`} fill="none" stroke="#1e7a46" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx={p.x} cy={p.y - 2 + 3} r="9.5" fill={INK} opacity="0.22" />
              <circle cx={p.x} cy={p.y - 2} r="9.5" fill="#d21f3c" stroke={INK} strokeWidth="3" />
              <circle cx={p.x - 3} cy={p.y - 5} r="2.5" fill="#ffffff" opacity="0.6" />
            </g>
          );
        })}

      {toppings.includes("Fresh flowers") &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const p = at(i, 6, 0.8);
          const petals = i % 2 ? "#e8b9d2" : "#ffffff";
          return (
            <g key={`fl-${i}`} transform={`translate(${p.x} ${p.y}) rotate(${i * 31})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-9" rx="5" ry="8.5" fill={petals} stroke={INK} strokeWidth="1.8" transform={`rotate(${a})`} />
              ))}
              <circle r="4.5" fill="#e9a100" stroke={INK} strokeWidth="1.8" />
            </g>
          );
        })}
    </g>
  );
}

export default function CakePreview({
  shape,
  size = '8"',
  sponge,
  frosting,
  frostingKind,
  filling = "None",
  toppings,
  inscription,
  gold = false,
}: CakePreviewProps) {
  const naked = frostingKind === "Naked";
  const drip = frostingKind === "Chocolate drip";
  const top = naked ? sponge : frosting;
  const piped = !naked && frostingKind !== "Fondant";
  const fillHex = FILL_HEX[filling] ?? "";
  const r = R * (SIZE_SCALE[size] ?? 1);
  const text = inscription.trim();
  const pipeColour = lighten(top, 0.3);


  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full"
      role="img"
      aria-label={`Cake seen from above: ${size} ${shape} cake with ${frostingKind.toLowerCase()} frosting`}
    >
      <defs>
        <radialGradient id="ckTop" cx="0.36" cy="0.3" r="0.78">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#241611" stopOpacity="0.2" />
        </radialGradient>
        {/* Frosting is never flat: a light source upper-left, shadowed rim. */}
        <linearGradient id="ckFrost" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={lighten(top, 0.3)} />
          <stop offset="52%" stopColor={top} />
          <stop offset="100%" stopColor={mixHex([top, "#8a5a3c"])} />
        </linearGradient>
        <linearGradient id="ckWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={mixHex([top, "#6b4326"])} />
        </linearGradient>
        <linearGradient id="ckSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="ckSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="ckSoftSm" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <clipPath id="ckTopFace">{face(shape, r, {})}</clipPath>
        <clipPath id="ckSideFace">
          <g transform={`translate(0 ${SIDE})`}>{face(shape, r, {})}</g>
        </clipPath>
      </defs>

      {/* board */}
      <circle cx={CX} cy={CY + 9} r={146} fill={INK} opacity="0.11" filter="url(#ckSoft)" />
      <circle cx={CX} cy={CY} r={146} fill="#ffffff" stroke={INK} strokeWidth="4.5" />
      <circle cx={CX} cy={CY} r={134} fill="#f7f2e8" />
      {/* the cake sits on the board, so it needs a real contact shadow */}
      <ellipse
        cx={CX}
        cy={CY + r * 0.92 + SIDE}
        rx={r * 0.98}
        ry={r * 0.17}
        fill={INK}
        opacity="0.22"
        filter="url(#ckSoft)"
      />

      {/* the wall you glimpse from above */}
      <g transform={`translate(0 ${SIDE})`}>
        {face(shape, r, { fill: "url(#ckWall)", stroke: INK, strokeWidth: 4, strokeLinejoin: "round" })}
      </g>
      <g clipPath="url(#ckSideFace)">
        <rect x={CX - r} y={CY + r + 1} width={r * 2} height={SIDE} fill={INK} opacity="0.09" />
        {naked && <rect x={CX - r} y={CY + r + 3} width={r * 2} height="6" fill="#fff3e0" />}
        <rect x={CX - r} y={CY + r + 3} width={r * 2} height="6" fill={sponge} />
        {fillHex && <rect x={CX - r} y={CY + r + 12} width={r * 2} height="8" fill={fillHex} />}
      </g>

      {/* the top face */}
      {face(shape, r, { fill: "url(#ckFrost)", stroke: INK, strokeWidth: 4.5, strokeLinejoin: "round" })}
      <g clipPath="url(#ckTopFace)">
        <rect x={CX - r} y={CY - r} width={r * 2} height={r * 2} fill="url(#ckTop)" />
        {/* specular sweep across the icing */}
        <path
          d={`M${CX - r * 0.95} ${CY - r * 0.35} A${r * 0.95} ${r * 0.95} 0 0 1 ${CX + r * 0.2} ${CY - r * 0.92} L${CX + r * 0.62} ${CY - r * 0.72} A${r * 0.62} ${r * 0.62} 0 0 0 ${CX - r * 0.66} ${CY - r * 0.06} Z`}
          fill="url(#ckSheen)"
          filter="url(#ckSoftSm)"
        />
        {/* occlusion where the icing meets the wall */}
        {face(shape, r, { fill: "none", stroke: INK, strokeWidth: 16, opacity: 0.1, filter: "url(#ckSoftSm)" })}
        {naked &&
          Array.from({ length: 18 }).map((_, i) => {
            const t = (i / 18) * Math.PI * 2;
            const rr = r * 0.86;
            return (
              <circle
                key={`cr-${i}`}
                cx={CX + Math.cos(t) * rr}
                cy={CY + Math.sin(t) * rr}
                r={1.7}
                fill="#b98a4e"
                opacity="0.5"
              />
            );
          })}
      </g>

      {drip && (
        <g fill="none" strokeLinecap="round" strokeDasharray="5 17" strokeDashoffset="4">
          {face(shape, r - 1, { stroke: "#4a2a1a", strokeWidth: 13 })}
        </g>
      )}

      {piped && (
        <g fill="none" strokeLinecap="round" strokeDasharray="3 13" strokeDashoffset="4">
          {face(shape, r - 7, { stroke: INK, strokeWidth: 15 })}
          {face(shape, r - 7, { stroke: pipeColour, strokeWidth: 9 })}
        </g>
      )}

      <Toppings toppings={toppings} r={r} hasText={text.length > 0} />

      {text ? (
        <text
          x={CX}
          y={CY + 8}
          textAnchor="middle"
          /* Inline style, not a `fontFamily` presentation attribute: var()
             substitution in SVG presentation attributes is not reliably
             supported, and the family name is now next/font's hashed one. */
          style={{ fontFamily: "var(--font-display)" }}
          fontWeight={900}
          fontSize={text.length > 13 ? 20 : text.length > 9 ? 24 : 27}
          fill={gold ? "#b8860b" : "#4a2a1a"}
          stroke={gold ? "#fff3c4" : "#fffdfa"}
          strokeWidth="3"
          paintOrder="stroke"
        >
          {text.slice(0, 20)}
        </text>
      ) : (
        <g transform={`translate(${CX} ${CY})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 11} cy={Math.sin((a * Math.PI) / 180) * 11} r="10" fill={pipeColour} stroke={INK} strokeWidth="3" />
          ))}
          <circle r="7" fill={lighten(pipeColour, 0.3)} stroke={INK} strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}
