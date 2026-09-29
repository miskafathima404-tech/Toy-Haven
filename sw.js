const CACHE_NAME = "toy-haven-v5";

const ASSETS = [
  "./",
  "./index.html",
  "./products.html",
  "./cart.html",
  "./checkout.html",
  "./wishlist.html",
  "./support.html",
  "./css/style.css",
  "./js/products-data.js",
  "./js/app.js",
  "./manifest.json",

  "./assets/favicon.svg",
  "./assets/icon-192.svg",
  "./assets/icon-512.svg",

  "./assets/forest-spirit.jpg",
  "./assets/cosmic cat.jpg",
  "./assets/magnetic-marble.jpg",
  "./assets/solar-robot.jpg",
  "./assets/orbit.jpg",
  "./assets/mystery-garden.jpg",
  "./assets/retro.jpg",
  "./assets/city scooteer.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});