"use client";

import { useEffect, useState } from "react";

/**
 * One-time install nudge. We only show the native prompt when the browser has
 * decided the app is installable, and we never re-nag after a dismissal (that
 * choice is persisted). Safari is handled separately — it has no
 * beforeinstallprompt, so we show the manual Share → Add to Home Screen hint.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const dismissedAt = localStorage.getItem("dc-install-dismissed");
    setDismissed(!!dismissedAt);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as NonNullable<typeof deferred>);
      if (!dismissedAt) setDismissed(false);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) || (ua.includes("mac") && "ontouchend" in document);
    const inStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isIOS && !inStandalone && !dismissedAt) {
      setShowIOS(true);
      setDismissed(false);
    }
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  useEffect(() => {
    const onInstallRequest = async (event: Event) => {
      const report = (event as CustomEvent<{ report?: (message: string) => void }>).detail?.report;
      if (deferred) {
        try {
          await deferred.prompt();
          const choice = await deferred.userChoice;
          if (choice.outcome === "accepted") {
            report?.("App installed. You can open it from your home screen.");
            setDismissed(true);
            localStorage.setItem("dc-install-dismissed", "1");
          } else {
            report?.("Install was cancelled. You can try again whenever you’re ready.");
          }
        } catch {
          report?.("Your browser couldn’t open the install prompt. Try its menu and choose Install app.");
        }
        return;
      }

      if (showIOS) {
        setDismissed(false);
        report?.("Use Share, then choose “Add to Home Screen” to install.");
        return;
      }

      report?.("Open your browser menu and choose “Install app” or “Add to Home Screen.”");
    };

    window.addEventListener("dc:install-app", onInstallRequest);
    return () => window.removeEventListener("dc:install-app", onInstallRequest);
  }, [deferred, showIOS]);

  const dismiss = () => {
    localStorage.setItem("dc-install-dismissed", "1");
    setDismissed(true);
    setDeferred(null);
    setShowIOS(false);
  };

  if (dismissed || (!deferred && !showIOS)) return null;

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md px-4 md:bottom-6">
      <div className="flex items-center gap-3 rounded-2xl bg-cocoa p-4 text-cream shadow-2xl ring-1 ring-cream/15">
        <span aria-hidden className="text-2xl">🥐</span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-black">Add Donuts & Cakes to your home screen</p>
          <p className="text-xs text-cream/75">
            {showIOS
              ? "Tap Share, then “Add to Home Screen” — no App Store needed."
              : "One tap — builds, orders and your cart at the speed of a contact."}
          </p>
        </div>
        {!showIOS && deferred && (
          <button
            onClick={async () => {
              const d = deferred;
              setDeferred(null);
              await d.prompt();
              try { await d.userChoice; } catch {}
              setDismissed(true);
              localStorage.setItem("dc-install-dismissed", "1");
            }}
            className="shrink-0 rounded-full bg-ember px-4 py-2 text-sm font-bold text-white hover:bg-ember-deep"
          >
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 text-cream/70 hover:text-cream"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
