"use client";

import Image from "next/image";
import { useState } from "react";
import { px } from "@/lib/images";
import { cn } from "@/lib/utils";

interface FoodImageProps {
  id: number;
  alt: string;
  width?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  eager?: boolean;
}

/**
 * Remote food photo with a guaranteed-graceful fallback:
 * if the image fails to load, a warm tile with the dish initial renders
 * instead of a broken image icon.
 */
export default function FoodImage({
  id,
  alt,
  width = 1200,
  className,
  sizes,
  priority = false,
  eager = false,
}: FoodImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-sand",
          className
        )}
      >
        <span
          aria-hidden
          className="font-display text-6xl font-black text-choco/25"
        >
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={px(id, width)}
      alt={alt}
      width={width}
      height={Math.round((width * 3) / 4)}
      sizes={sizes}
      priority={priority}
      loading={eager || priority ? undefined : "lazy"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
