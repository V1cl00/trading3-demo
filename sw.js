const CACHE = "rebate-share-demo-v4";
const PRECACHE = ["./","index.html","trading3-demo.html","icons/icon-192.png","icons/icon-512.png","icons/logo.svg","og.webp","de/","en/"];
self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  var isStatic = /\/(icons|.*\.(css|js|webp|png|svg|webmanifest))$/.test(url.pathname);
  if (isStatic) {
    event.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      });
    }));
    return;
  }
  event.respondWith(fetch(req).catch(function () { return caches.match(req); }));
});
