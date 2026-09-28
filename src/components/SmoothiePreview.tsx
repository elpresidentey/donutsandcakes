"use client";

import { mixHex, lighten } from "@/lib/color";
import { SMOOTHIE_FRUITS } from "@/lib/catalog";

function swatchFor(fruit: string): string {
  return SMOOTHIE_FRUITS.find((f) => f.value === fruit)?.swatch ?? "#ff6b8f";
}

export default function SmoothiePreview({
  baseSwatch,
  fruits,
  extras,
  size,
}: {
  baseSwatch: string;
  fruits: string[];
  extras: string[];
  size: string;
}) {
  const liquid = fruits.length > 0 ? mixHex([...fruits.map(swatchFor), baseSwatch]) : baseSwatch;
  const deep = mixHex([liquid, "#6b2f1a"]);
  const tall = size.startsWith("Large");
  const topY = tall ? 52 : 76;

  return (
    <svg viewBox="0 0 300 280" className="h-auto w-full" role="img" aria-label="Smoothie preview">
      <defs>
        <linearGradient id="smLiquid" x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor={lighten(liquid, 0.22)} />
          <stop offset="45%" stopColor={liquid} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
        <linearGradient id="smGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="22%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="78%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="smSpec" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="smSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {/* backdrop blob */}
      <circle cx="150" cy="140" r="108" fill={lighten(liquid, 0.55)} opacity="0.6" />
      {/* straw */}
      <rect x="178" y="18" width="16" height="120" rx="8" fill="#b04a76" stroke="#3e2a20" strokeWidth="3.5" transform="rotate(8 186 78)" />
      <rect x="178" y="18" width="6" height="120" rx="3" fill="#ffffff" opacity="0.5" transform="rotate(8 186 78)" />
      {/* glass */}
      <path
        d={`M96 ${topY} L204 ${topY} L190 250 L110 250 Z`}
        fill="url(#smGlass)"
        opacity="0.9"
        stroke="#3e2a20"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* liquid */}
      <path
        d={`M101 ${topY + 14} L199 ${topY + 14} L188 244 L112 244 Z`}
        fill="url(#smLiquid)"
        stroke="#3e2a20"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* shine */}
      <line x1="122" y1={topY + 40} x2="116" y2="226" stroke="url(#smSpec)" strokeWidth="13" strokeLinecap="round" />
      <line x1="181" y1={topY + 52} x2="177" y2="212" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      {/* fruit chunks */}
      {fruits.slice(0, 4).map((f, i) => (
        <rect
          key={f}
          x={124 + i * 22}
          y={topY + 60 + ((i * 47) % 90)}
          width={17}
          height={17}
          rx={6}
          fill={swatchFor(f)}
          stroke="#3e2a20"
          strokeWidth="2.5"
          transform={`rotate(${(i * 31) % 40 - 20} ${132 + i * 22} ${topY + 68 + ((i * 47) % 90)})`}
        />
      ))}
      {/* extras garnish */}
      {extras.includes("Mint") && (
        <g transform={`translate(150 ${topY - 12})`}>
          <ellipse cx="-8" cy="0" rx="11" ry="6" fill="#1e7a46" stroke="#3e2a20" strokeWidth="2.5" transform="rotate(-24)" />
          <ellipse cx="8" cy="-4" rx="11" ry="6" fill="#2fa35f" stroke="#3e2a20" strokeWidth="2.5" transform="rotate(18)" />
        </g>
      )}
      {extras.includes("Chia seeds") &&
        Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={120 + ((i * 37) % 62)} cy={topY + 30 + ((i * 53) % 130)} r={1.8} fill="#3e2a20" />
        ))}
      {/* fruit on rim */}
      {fruits[0] && (
        <g transform={`translate(204 ${topY + 6}) rotate(18)`}>
          <circle r="15" fill={swatchFor(fruits[0])} stroke="#3e2a20" strokeWidth="3" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 9} cy={Math.sin((a * Math.PI) / 180) * 9} r={2} fill="#3e2a20" opacity="0.55" />
          ))}
        </g>
      )}
      {/* condensation — a cold glass sweats */}
      <ellipse cx="150" cy="258" rx="50" ry="8" fill="#3e2a20" opacity="0.26" filter="url(#smSoft)" />
      <ellipse cx="150" cy="254" rx="52" ry="9" fill="#3e2a20" opacity="0.14" />
    </svg>
  );
}
