"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "fade" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  /** Stagger, in ms. */
  delay?: number;
  className?: string;
  as?: ElementType;
  [key: string]: unknown;
}

/**
 * Fades/slides content in the first time it scrolls into view.
 *
 * Safety model: the element renders with NO data-state, i.e. fully visible. Only
 * after mount do we (a) check for reduced-motion, (b) check whether it is already
 * on screen, and (c) if neither, mark it hidden and start observing. So a failed
 * hydration, a missing IntersectionObserver or JS being disabled can never leave
 * content invisible.
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  as,
  ...rest
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setState("shown");
      return;
    }

    // Already at (or near) the top of the viewport on mount: don't animate,
    // otherwise above-the-fold content would visibly pop in.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setState("shown");
      return;
    }

    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("shown");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-variant={variant}
      data-state={state}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
