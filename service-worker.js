const CACHE_NAME = "sitzplan-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./service-worker.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
  // + ggf. weitere JS/CSS-Dateien, falls du etwas auslagerst
];

// Beim Installieren: Dateien in Cache legen
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Alte Caches beim Aktivieren aufräumen
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
});

// Netzwerk-Anfragen beantworten: erst Cache, dann Netz
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          // Fallback: wenn offline und nix im Cache: nichts tun
          new Response("Offline und Ressource nicht im Cache.", {
            status: 503,
            statusText: "Service Unavailable"
          })
        )
      );
    })
  );
});
