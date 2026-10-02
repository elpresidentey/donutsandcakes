"use client";

import { useEffect, useRef } from "react";

/**
 * SprinkleBurst — a little celebration that rains pastry sprinkles whenever a
 * cart item is added (`dc:cart-add`) or an order finishes
 * (`dc:order-done`). Purely visual, pointer-events-free, and disabled under
 * prefers-reduced-motion.
 */

const COLORS = ["#c2410c", "#e9a100", "#ffe1a8", "#d5ebdc", "#1e7a46", "#2b1c15", "#ff8a4c"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  spin: number;
  color: string;
  life: number;
  round: boolean;
}

export default function SprinkleBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<Piece[]>([]);
  const rafRef = useRef(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onMq = () => (reducedRef.current = mq.matches);
    mq.addEventListener("change", onMq);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (count: number, origin: number) => {
      if (reducedRef.current) return;
      const w = window.innerWidth;
      const cx = Math.max(40, Math.min(w - 40, window.innerWidth * origin));
      const cy = window.innerHeight * 0.28;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 9;
        piecesRef.current.push({
          x: cx + (Math.random() - 0.5) * 24,
          y: cy + (Math.random() - 0.5) * 16,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (i === 0 ? 4 : 5),
          w: 6 + Math.random() * 8,
          h: 2.5 + Math.random() * 3,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.25,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          life: 1,
          round: Math.random() > 0.72,
        });
      }
      start();
    };

    const tick = () => {
      if (!ctx) {
        rafRef.current = 0;
        return;
      }
      const pieces = piecesRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!pieces.length) {
        rafRef.current = 0;
        return;
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.vy += 0.18; // gravity
        p.vx *= 0.985; // air drag
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;
        p.life -= 0.008;
        if (p.life <= 0 || p.y > window.innerHeight + 40) {
          pieces.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.h / 1.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const r = p.h / 2;
          ctx.beginPath();
          ctx.roundRect(-p.w / 2, -r, p.w, p.h, r);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();
      rafRef.current = pieces.length ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onAdd = () => spawn(48, 0.5);
    const onDone = () => {
      spawn(140, 0.5);
      setTimeout(() => spawn(90, 0.3), 220);
      setTimeout(() => spawn(90, 0.7), 420);
    };
    window.addEventListener("dc:cart-add", onAdd);
    window.addEventListener("dc:order-done", onDone);

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", resize);
      window.removeEventListener("dc:cart-add", onAdd);
      window.removeEventListener("dc:order-done", onDone);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
    />
  );
}
