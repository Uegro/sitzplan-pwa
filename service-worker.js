const CACHE_NAME = "sitzplan-pwa-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./service-worker.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install: Dateien in Cache legen
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // neue Version sofort aktivieren wollen
});

// Activate: alte Caches entfernen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Kontrolle über offene Clients übernehmen
});

// Fetch: erst Cache, dann Netz (falls online)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        return new Response("Offline – Ressource nicht im Cache.", {
          status: 503,
          statusText: "Service Unavailable"
        });
      });
    })
  );
});
