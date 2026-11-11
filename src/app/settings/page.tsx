"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dc-reduced-motion";

export default function SettingsPage() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const enabled = saved === "true";
    setReducedMotion(enabled);
    document.documentElement.dataset.reducedMotion = String(enabled);
  }, []);

  const updateMotion = (enabled: boolean) => {
    setReducedMotion(enabled);
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
    document.documentElement.dataset.reducedMotion = String(enabled);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
      <p className="text-label uppercase text-ember">Your experience</p>
      <h1 className="mt-2 font-display text-display">Settings</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-choco/70">
        Choose how the shop moves and feels on your device.
      </p>

      <section className="mt-9 border-y border-choco/12 py-6" aria-labelledby="motion-title">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-lg">
            <h2 id="motion-title" className="font-display text-subhead">Reduce animation</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-choco/65">
              Keep page transitions and moving details to a minimum. Your device’s accessibility preference is always respected.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            aria-labelledby="motion-title"
            onClick={() => updateMotion(!reducedMotion)}
            className={`relative mt-1 inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors ${reducedMotion ? "bg-ember" : "bg-choco/25"}`}
          >
            <span className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${reducedMotion ? "translate-x-6" : "translate-x-0"}`} />
            <span className="sr-only">{reducedMotion ? "On" : "Off"}</span>
          </button>
        </div>
        <p className="mt-4 text-xs font-semibold text-choco/55" aria-live="polite">
          {reducedMotion ? "Reduced animation is on." : "Reduced animation is off."}
        </p>
      </section>

      <p className="mt-6 text-sm text-choco/60">Prices are shown in Nigerian naira (₦).</p>
    </div>
  );
}
