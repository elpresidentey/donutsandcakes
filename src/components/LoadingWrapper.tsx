"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import {
  ProductCardSkeleton,
  ProductGridSkeleton,
  HeroSkeleton,
  BuilderPreviewSkeleton,
  BuilderStepSkeleton,
  CartSkeleton,
  CheckoutFormSkeleton,
  PageSkeleton,
} from "./Skeleton";

interface LoadingWrapperProps {
  children: ReactNode;
  skeleton?: ReactNode;
  delay?: number; // Minimum time to show skeleton (ms)
}

export function LoadingWrapper({
  children,
  skeleton,
  delay = 300,
}: LoadingWrapperProps) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
      setShowContent(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Suspense fallback={showSkeleton ? skeleton : null}>
      {showContent && children}
    </Suspense>
  );
}

// Pre-configured loading wrappers for common pages
export function WithProductGridSkeleton({ children }: { children: ReactNode }) {
  return (
    <LoadingWrapper
      skeleton={<ProductGridSkeleton count={4} />}
      delay={400}
    >
      {children}
    </LoadingWrapper>
  );
}

export function WithHeroSkeleton({ children }: { children: ReactNode }) {
  return (
    <LoadingWrapper
      skeleton={<HeroSkeleton />}
      delay={300}
    >
      {children}
    </LoadingWrapper>
  );
}

export function WithBuilderSkeleton({ children }: { children: ReactNode }) {
  return (
    <LoadingWrapper
      skeleton={<>
        <BuilderPreviewSkeleton />
        <div className="mt-4 space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <BuilderStepSkeleton key={i} />
          ))}
        </div>
      </>}
      delay={500}
    >
      {children}
    </LoadingWrapper>
  );
}

export function WithCartSkeleton({ children }: { children: ReactNode }) {
  return (
    <LoadingWrapper
      skeleton={<CartSkeleton count={3} />}
      delay={300}
    >
      {children}
    </LoadingWrapper>
  );
}

export function WithCheckoutSkeleton({ children }: { children: ReactNode }) {
  return (
    <LoadingWrapper
      skeleton={<CheckoutFormSkeleton />}
      delay={400}
    >
      {children}
    </LoadingWrapper>
  );
}

export function WithPageSkeleton({ children }: { children: ReactNode }) {
  return (
    <LoadingWrapper
      skeleton={<PageSkeleton />}
      delay={500}
    >
      {children}
    </LoadingWrapper>
  );
}