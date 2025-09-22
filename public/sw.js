// Basic service worker for aggressive caching and periodic refresh
// Precache core shell and static assets
const BASE_PATH = "/foodcord-terminal";
const VERSION = "v2";
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

// optional API base, can be configured by client
let API_BASE = null;

const STATIC_ASSETS = [
  `${BASE_PATH}/assets/camera.png`,
  `${BASE_PATH}/assets/cta-button.png`,
  `${BASE_PATH}/receiving-method/in-a-bag.png`,
  `${BASE_PATH}/receiving-method/on-the-plate.png`,
  // known demo images shipped with the app
  `${BASE_PATH}/products/blini.png`,
  `${BASE_PATH}/products/cake.png`,
  `${BASE_PATH}/products/combo.png`,
  `${BASE_PATH}/products/fries.png`,
  `${BASE_PATH}/products/pizza2.png`,
  `${BASE_PATH}/products/pizzaa.png`,
  `${BASE_PATH}/products/salad.png`,
  `${BASE_PATH}/products/souse.png`,
  `${BASE_PATH}/products/sushi.png`,
  `${BASE_PATH}/categories/1g.png`,
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
  // enable navigation preload if supported to speed up navigations
  if (self.registration.navigationPreload) {
    self.registration.navigationPreload.enable().catch(() => {});
  }
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

  // Identify images and APIs (same-origin or remote)
  const isImageDest = request.destination === "image";
  const isLikelyImage =
    isImageDest || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(url.pathname);
  const fullUrl = `${url.origin}${url.pathname}`;
  const isApi =
    url.pathname.startsWith("/api/") ||
    fullUrl.includes("product-main") ||
    fullUrl.includes("groups") ||
    fullUrl.includes("advertisement") ||
    (API_BASE && fullUrl.startsWith(API_BASE));

  // HTML navigation: network-first with cache fallback to avoid stale HTML on reload
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const net = await fetch(request, { cache: "no-store" });
          const copy = net.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          return net;
        } catch {
          const cacheMatch = await caches.match(request);
          if (cacheMatch) return cacheMatch;
          const preload = await event.preloadResponse;
          if (preload) return preload;
          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
          });
        }
      })()
    );
    return;
  }

  // API: network-first so reloads get fresh data; cache as fallback
  if (isApi) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME);
        try {
          const res = await fetch(request, {
            cache: "no-store",
            credentials: "include",
          });
          if (res && res.status === 200) {
            cache.put(request, res.clone());
          }
          return res;
        } catch {
          const cached = await cache.match(request);
          if (cached) return cached;
          throw new Error("Network error and no cache available");
        }
      })()
    );
    return;
  }

  // Images: SWR
  if (isLikelyImage) {
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
    const defaultApi = [
      `${self.origin}/api/groups`,
      `${self.origin}/api/product-main`,
      `${self.origin}/api/advertisement`,
    ];
    const make = (path) =>
      API_BASE
        ? `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
        : null;
    const apiEndpoints = API_BASE
      ? [make("groups"), make("product-main"), make("advertisement")]
      : defaultApi;
    await Promise.all(
      apiEndpoints.filter(Boolean).map(async (url) => {
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
  const data = event.data;
  if (data === "force-refresh") {
    refreshCaches();
  } else if (data && data.type === "set-config") {
    if (typeof data.apiBase === "string") {
      API_BASE = data.apiBase;
    }
  }
});
