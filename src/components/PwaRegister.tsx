"use client";

import { useEffect } from "react";

/** Registers the PWA service worker (only in production builds). */
export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is a bonus, never a blocker */
    });
  }, []);
  return null;
}
