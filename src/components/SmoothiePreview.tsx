"use client";

import { mixHex, lighten } from "@/lib/color";
import { SMOOTHIE_FRUITS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

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
  const key = `${baseSwatch}|${fruits.join(",")}|${extras.join(",")}|${size}`;

  return (
    <svg key={key} viewBox="0 0 300 280" className="h-auto w-full" role="img" aria-label="Smoothie preview">
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
        <clipPath id="smLiquidClip">
          <path d={`M101 ${topY + 14} L199 ${topY + 14} L188 244 L112 244 Z`} />
        </clipPath>
      </defs>
      {/* backdrop blob */}
      <circle cx="150" cy="140" r="108" fill={lighten(liquid, 0.55)} opacity="0.6" />
      {/* straw */}
      <rect x="178" y="18" width="16" height="120" rx="8" fill="#c2410c" stroke="#2b1c15" strokeWidth="3.5" transform="rotate(8 186 78)" />
      <rect x="178" y="18" width="6" height="120" rx="3" fill="#ffffff" opacity="0.5" transform="rotate(8 186 78)" />
      {/* glass */}
      <path
        d={`M96 ${topY} L204 ${topY} L190 250 L110 250 Z`}
        fill="url(#smGlass)"
        opacity="0.9"
        stroke="#2b1c15"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* liquid */}
      <path
        d={`M101 ${topY + 14} L199 ${topY + 14} L188 244 L112 244 Z`}
        fill="url(#smLiquid)"
        stroke="#2b1c15"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Soft, uneven surface and fine fruit flecks give the blend some body. */}
      <ellipse cx="150" cy={topY + 15} rx="48" ry="7" fill={lighten(liquid, 0.16)} opacity="0.9" />
      <g clipPath="url(#smLiquidClip)" opacity="0.38">
        {Array.from({ length: 34 }).map((_, i) => (
          <circle
            key={`fibre-${i}`}
            cx={109 + ((i * 37) % 82)}
            cy={topY + 30 + ((i * 53) % 165)}
            r={i % 5 === 0 ? 2.3 : 1.2}
            fill={i % 3 === 0 ? "#fff4d7" : deep}
          />
        ))}
      </g>
      {/* shine */}
      <line x1="122" y1={topY + 40} x2="116" y2="226" stroke="url(#smSpec)" strokeWidth="13" strokeLinecap="round" />
      <line x1="181" y1={topY + 52} x2="177" y2="212" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      {/* A few soft fruit pieces suspended through the thick blend. */}
      {fruits.slice(0, 4).map((f, i) => (
        <g key={f} opacity="0.78" transform={`translate(${127 + i * 19} ${topY + 66 + ((i * 43) % 105)}) rotate(${(i * 31) % 40 - 20})`}>
          <ellipse cx="0" cy="0" rx="8" ry="5.5" fill={swatchFor(f)} opacity="0.75" />
          <path d="M-5 0 q5 -5 10 0" fill="none" stroke="#fff8e8" strokeWidth="1.3" opacity="0.55" />
        </g>
      ))}
      {extras.includes("Extra ice") && (
        <g stroke="#ffffff" strokeWidth="2" fill="#ffffff" fillOpacity="0.38">
          <path d={`M121 ${topY + 12} l12 -5 9 7 -3 11 -13 2 -7 -7 Z`} />
          <path d={`M153 ${topY + 9} l10 -4 8 8 -2 9 -12 2 -7 -7 Z`} />
          <path d={`M176 ${topY + 14} l9 -3 7 7 -3 8 -10 1 -5 -6 Z`} />
        </g>
      )}
      {/* extras garnish */}
      {extras.includes("Mint") && (
        <g transform={`translate(150 ${topY - 12})`}>
          <ellipse cx="-8" cy="0" rx="11" ry="6" fill="#1e7a46" stroke="#2b1c15" strokeWidth="2.5" transform="rotate(-24)" />
          <ellipse cx="8" cy="-4" rx="11" ry="6" fill="#2fa35f" stroke="#2b1c15" strokeWidth="2.5" transform="rotate(18)" />
        </g>
      )}
      {extras.includes("Chia seeds") &&
        Array.from({ length: 8 }).map((_, i) => (
          <circle key={`chia-${i}`} cx={120 + ((i * 37) % 62)} cy={topY + 30 + ((i * 53) % 130)} r={1.8} fill="#2b1c15" />
        ))}
      {/* fruit on rim */}
      {fruits[0] && (
        <g transform={`translate(204 ${topY + 6}) rotate(18)`}>
          <circle r="15" fill={swatchFor(fruits[0])} stroke="#2b1c15" strokeWidth="3" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 9} cy={Math.sin((a * Math.PI) / 180) * 9} r={2} fill="#2b1c15" opacity="0.55" />
          ))}
        </g>
      )}
      {/* condensation — a cold glass sweats */}
      <ellipse cx="150" cy="258" rx="50" ry="8" fill="#2b1c15" opacity="0.26" filter="url(#smSoft)" />
      <ellipse cx="150" cy="254" rx="52" ry="9" fill="#2b1c15" opacity="0.14" />
    </svg>
  );
}
