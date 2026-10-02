/* Donuts & Cakes service worker — app-shell + image caching, network-first pages. */
const STATIC_CACHE = "dc-static-v2";
const IMAGE_CACHE = "dc-images-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(["/", "/manifest.webmanifest", "/offline.html"])).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== IMAGE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Food photos: stale-while-revalidate so builders stay fast & offline-friendly
  if (url.hostname === "images.pexels.com") {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => {
              if (res.ok) cache.put(request, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached ?? network;
        })
      )
    );
    return;
  }

  // Same-origin pages/assets: network-first, fall back to cache, then home
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          }
          return res;
        })
        .catch(() => (request.mode === 'navigate' ? caches.match('/offline.html') : caches.match(request).then((cached) => cached ?? caches.match('/')))
        )
    );
  }
});
