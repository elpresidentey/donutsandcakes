"use client";

import { useEffect, useState } from "react";

const MOTION_KEY = "dc-reduced-motion";
const THEME_KEY = "dc-theme";

export default function SettingsPage() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [installMessage, setInstallMessage] = useState("");
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const motion = window.localStorage.getItem(MOTION_KEY) === "true";
    const dark = window.localStorage.getItem(THEME_KEY) === "dark";
    setReducedMotion(motion);
    setDarkMode(dark);
    document.documentElement.dataset.reducedMotion = String(motion);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    setInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  }, []);

  const updateMotion = (enabled: boolean) => {
    setReducedMotion(enabled);
    window.localStorage.setItem(MOTION_KEY, String(enabled));
    document.documentElement.dataset.reducedMotion = String(enabled);
  };

  const updateTheme = (enabled: boolean) => {
    setDarkMode(enabled);
    window.localStorage.setItem(THEME_KEY, enabled ? "dark" : "light");
    document.documentElement.dataset.theme = enabled ? "dark" : "light";
  };

  const requestInstall = () => {
    setInstallMessage("");
    window.dispatchEvent(
      new CustomEvent("dc:install-app", {
        detail: { report: (message: string) => setInstallMessage(message) },
      })
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
      <p className="text-label uppercase text-ember">Your experience</p>
      <h1 className="mt-2 font-display text-display">Settings</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-choco/70">
        Make the shop feel right on your device.
      </p>

      <section className="mt-9 divide-y divide-choco/10 overflow-hidden rounded-3xl border border-choco/10 bg-milk px-5 sm:px-7" aria-label="App settings">
        <div className="flex items-start justify-between gap-6 py-6">
          <div className="max-w-lg">
            <h2 id="theme-title" className="font-display text-subhead">Dark mode</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-choco/65">A softer, low-light look for late-night cake plans.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            aria-labelledby="theme-title"
            onClick={() => updateTheme(!darkMode)}
            className={`relative mt-1 inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors ${darkMode ? "bg-ember" : "bg-choco/25"}`}
          >
            <span className="absolute left-1 text-[10px] text-white" aria-hidden>☾</span>
            <span className={`relative h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${darkMode ? "translate-x-6" : "translate-x-0"}`} />
            <span className="sr-only">{darkMode ? "On" : "Off"}</span>
          </button>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <h2 className="font-display text-subhead">Install the app</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-choco/65">Keep your builders, orders and cart one tap away from your home screen.</p>
          </div>
          <button type="button" onClick={requestInstall} disabled={installed} className="min-h-11 shrink-0 rounded-full bg-ember px-5 text-sm font-bold text-white transition hover:bg-ember-deep active:scale-95 disabled:cursor-default disabled:bg-sand disabled:text-choco/65">
            {installed ? "App installed ✓" : "Install app ↓"}
          </button>
          {installMessage && <p className="w-full text-sm leading-relaxed text-choco/70" role="status">{installMessage}</p>}
        </div>

        <div className="flex items-start justify-between gap-6 py-6">
          <div className="max-w-lg">
            <h2 id="motion-title" className="font-display text-subhead">Reduce animation</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-choco/65">Keep page transitions and moving details to a minimum. Your device’s accessibility preference is always respected.</p>
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
      </section>

      <p className="mt-6 text-sm text-choco/60">Prices are shown in Nigerian naira (₦).</p>
    </div>
  );
}
