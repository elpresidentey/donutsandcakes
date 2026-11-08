"use client";

import { cn } from "@/lib/utils";

/**
 * Skeleton loading components for better perceived performance.
 * These match the layout of actual components to prevent layout shift.
 */

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse bg-choco/10 rounded-lg",
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-choco/12 bg-milk">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <div className="mb-4 mt-3 flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-auto bg-cocoa px-4 pb-3.5 pt-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="mt-2.5 h-10 w-full min-[520px]:w-24 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-cocoa text-cream">
      <div className="absolute inset-0 bg-cocoa/70" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-[calc(5rem_+_env(safe-area-inset-bottom))] pt-6 sm:px-6 md:pb-12 lg:pb-14 lg:pt-10">
        <div className="my-auto max-w-2xl">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-12 w-full" />
          <Skeleton className="mt-2 h-10 w-5/6" />
          <Skeleton className="mt-6 h-6 w-3/4" />
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="mt-6 h-6 w-48" />
        </div>
        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-1">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex items-center px-1">
              <Skeleton className="h-2 w-14 rounded-full" />
              <Skeleton className="h-2 w-14 rounded-full" />
              <Skeleton className="h-2 w-14 rounded-full" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function BuilderPreviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] border-4 border-milk bg-sand shadow-[0_16px_48px_rgba(43,28,21,0.12)]">
      <Skeleton className="aspect-square w-full" />
    </div>
  );
}

export function BuilderStepSkeleton() {
  return (
    <section aria-label="Loading" className="rounded-3xl bg-milk p-5 ring-1 ring-choco/8 shadow-[0_2px_14px_rgba(43,28,21,0.05)]">
      <div className="mb-3 flex items-baseline gap-2">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="mb-3 h-4 w-48" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="min-h-[68px] rounded-2xl" />
        ))}
      </div>
    </section>
  );
}

export function CartItemSkeleton() {
  return (
    <li className="flex gap-4 rounded-3xl bg-milk p-4 shadow-[0_2px_16px_rgba(43,28,21,0.07)] animate-pulse">
      <Skeleton className="h-24 w-24 shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-1 h-5 w-3/4" />
        <Skeleton className="mt-1 h-4 w-1/2" />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="ml-auto h-6 w-24" />
        </div>
      </div>
    </li>
  );
}

export function CartSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-1 h-8 w-24" />
      <ul className="mt-6 flex flex-col gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
      </ul>
      <div className="mt-6 rounded-3xl bg-choco p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-2 h-6 w-full rounded-full" />
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Skeleton className="min-h-[52px] flex-1 rounded-full" />
          <Skeleton className="min-h-[52px] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutFormSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-1 h-8 w-32" />
      <Skeleton className="mt-2 h-5 w-3/4" />
      <div className="mt-6 grid items-start gap-5 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-4 rounded-3xl bg-milk p-5">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="min-h-[52px] w-full rounded-2xl" />
          ))}
        </div>
        <div className="rounded-3xl bg-choco p-5">
          <Skeleton className="h-6 w-32" />
          <div className="mt-3 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
          <Skeleton className="mt-4 h-6 w-1/2" />
          <Skeleton className="mt-4 h-10 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 h-16 border-b border-choco/10 bg-cream/90">
        <Skeleton className="mx-auto h-full max-w-6xl flex items-center justify-between px-4" />
      </header>
      <main>
        <HeroSkeleton />
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-1 h-8 w-64" />
          <ProductGridSkeleton count={3} />
        </section>
      </main>
      <footer className="mt-16 border-t-4 border-ember bg-cocoa">
        <Skeleton className="mx-auto max-w-6xl px-4 py-12" />
      </footer>
    </div>
  );
}