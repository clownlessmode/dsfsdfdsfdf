// Basic service worker for aggressive caching and periodic refresh
// Precache core shell and static assets
const BASE_PATH = "/foodcord-terminal";
const VERSION = "v1";
const PRECACHE = `precache-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;
const ROUTES_TO_PRECACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/init`,
  `${BASE_PATH}/catalogue`,
  `${BASE_PATH}/cart`,
  `${BASE_PATH}/order`,
  `${BASE_PATH}/loyal`,
];

const STATIC_ASSETS = [
  `${BASE_PATH}/assets/camera.png`,
  `${BASE_PATH}/assets/cta-button.png`,
  `${BASE_PATH}/receiving-method/in-a-bag.png`,
  `${BASE_PATH}/receiving-method/on-the-plate.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll([...ROUTES_TO_PRECACHE, ...STATIC_ASSETS]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== PRECACHE && key !== RUNTIME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Helper: SWR strategy for images and APIs
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || networkFetch;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin and known remote images
  const isSameOrigin = url.origin === self.location.origin;
  const isImage = request.destination === "image";
  const isApi =
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("product-main") ||
    url.pathname.includes("groups") ||
    url.pathname.includes("advertisement");

  // HTML navigation: use cache-first fallback to network
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  // Images and API: SWR
  if ((isSameOrigin && isImage) || isApi) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// Periodic background refresh every 30 minutes
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;
async function refreshCaches() {
  try {
    const targets = [...ROUTES_TO_PRECACHE, ...STATIC_ASSETS];
    const cache = await caches.open(RUNTIME);
    await Promise.all(
      targets.map(async (url) => {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) await cache.put(url, res.clone());
        } catch {}
      })
    );

    // Refresh API endpoints
    const apiEndpoints = [
      `${self.origin}/api/groups`,
      `${self.origin}/api/product-main`,
      `${self.origin}/api/advertisement`,
    ];
    await Promise.all(
      apiEndpoints.map(async (url) => {
        try {
          const res = await fetch(url, {
            cache: "no-store",
            credentials: "include",
          });
          if (res.ok) await cache.put(url, res.clone());
        } catch {}
      })
    );
  } catch (e) {
    // ignore
  }
}

setInterval(() => {
  refreshCaches();
}, REFRESH_INTERVAL_MS);

// Allow clients to trigger a manual refresh
self.addEventListener("message", (event) => {
  if (event.data === "force-refresh") {
    refreshCaches();
  }
});
