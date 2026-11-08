"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Micro-interaction hooks and components for delightful UX
 */

// Confetti celebration effect
export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const trigger = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ["#c2410c", "#e9a100", "#1e7a46", "#ffe1a8", "#bfebce", "#f7f2e8"];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      particles.forEach((p, i) => {
        p.vy += 0.3; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Remove particles that are off screen
        if (p.y > height + 50) particles.splice(i, 1);
      });

      if (particles.length > 0 && frame < 300) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return { canvasRef, trigger, cleanup };
}

// Staggered entrance animation for lists
export function useStaggeredEntrance(itemCount: number, delay = 80) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const newVisible = new Set<number>();

    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        newVisible.add(i);
        setVisibleItems(new Set(newVisible));
      }, i * delay);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [itemCount, delay]);

  return visibleItems;
}

// Reduced motion checker
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reduced;
}

// Spring animation helper
export function useSpring(
  initialValue: number,
  config: { tension?: number; friction?: number; precision?: number } = {}
) {
  const { tension = 170, friction = 26, precision = 0.01 } = config;
  const [value, setValue] = useState(initialValue);
  const [velocity, setVelocity] = useState(0);
  const targetRef = useRef(initialValue);
  const frameRef = useRef<number | undefined>(undefined);

  const animate = useCallback(() => {
    const target = targetRef.current;
    const displacement = target - value;
    const springForce = displacement * tension;
    const dampingForce = velocity * friction;
    const acceleration = springForce - dampingForce;
    const newVelocity = velocity + acceleration * 0.016;
    const newValue = value + newVelocity * 0.016;

    if (Math.abs(newValue - target) < precision && Math.abs(newVelocity) < precision) {
      setValue(target);
      setVelocity(0);
      return;
    }

    setValue(newValue);
    setVelocity(newVelocity);
    frameRef.current = requestAnimationFrame(animate);
  }, [value, velocity, tension, friction, precision]);

  const setTarget = useCallback((newTarget: number) => {
    targetRef.current = newTarget;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    animate();
  }, [animate]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return [value, setTarget] as const;
}

// Hover/tap scale animation
export function usePressScale(scale = 0.98) {
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();

  const handlers = {
    onMouseDown: () => !reduced && setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => !reduced && setPressed(true),
    onTouchEnd: () => setPressed(false),
    onTouchCancel: () => setPressed(false),
  };

  return { pressed, scale: pressed ? scale : 1, handlers };
}

// Fade in/out animation
export function useFadeIn(delay = 0, duration = 300) {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, reduced]);

  return { visible, style: { opacity: visible ? 1 : 0, transition: `opacity ${duration}ms ease-out` } };
}

// Slide up animation
export function useSlideUp(delay = 0, distance = 20, duration = 500) {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, reduced]);

  return {
    visible,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
      transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    },
  };
}

// Counter animation
export function useCounter(end: number, duration = 1000, start = 0) {
  const [count, setCount] = useState(start);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [end, duration, start, reduced]);

  return count;
}

// Intersection observer for scroll-triggered animations
export function useScrollAnimation(threshold = 0.1, rootMargin = "0px") {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduced]);

  return { ref, isVisible };
}

// Page transition helper
export function usePageTransition() {
  const [isExiting, setIsExiting] = useState(false);
  const reduced = useReducedMotion();

  const startTransition = useCallback((callback: () => void) => {
    if (reduced) {
      callback();
      return;
    }

    setIsExiting(true);
    // Wait for exit animation
    setTimeout(() => {
      callback();
      setIsExiting(false);
    }, 200);
  }, [reduced]);

  return { isExiting, startTransition };
}

// Ripple effect for buttons
export function useRipple() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const reduced = useReducedMotion();

  const addRipple = useCallback(
    (e: React.MouseEvent | React.TouchEvent, id: number) => {
      if (reduced) return;

      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setRipples((prev) => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    },
    [reduced]
  );

  return { ripples, addRipple };
}

// Shimmer loading effect
export function Shimmer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-choco/10",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

// Add shimmer keyframes to globals
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;
  document.head.appendChild(style);
}
