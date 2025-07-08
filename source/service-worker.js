const KEY = "v1";

self.addEventListener("install", (event) =>
  event.waitUntil(self.skipWaiting().then(() =>
    caches.open(KEY).then((cache) =>
      cache.addAll([
        "./icon-adaptive.png",
        "./icon-alternate.png",
        "./icon.svg",
        "./index.html",
        "./index.css",
        "./index.js",
        "./manifest.json"
      ])
    )
  ))
);

self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim().then(() =>
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) =>
        key !== KEY && caches.delete(key)
      ))
    )
  ))
);

self.addEventListener("fetch", (event) =>
  event.respondWith(fetch(event.request).catch(() =>
    caches.match(event.request).then((resource) =>
      resource || caches.match("./index.html")
    )
  ))
);
