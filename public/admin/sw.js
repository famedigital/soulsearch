/* Admin-scoped service worker for /admin/login PWA */
const CACHE_NAME = 'soulsearch-admin-v1';
const PRECACHE_URLS = [
  '/admin/login',
  '/api/admin/manifest',
  '/admin-pwa/icons/icon-192.png',
  '/admin-pwa/icons/icon-512.png',
  '/admin-pwa/icons/icon-512-maskable.png',
  '/admin-pwa/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin admin + PWA asset requests
  if (url.origin !== self.location.origin) return;
  if (
    !url.pathname.startsWith('/admin') &&
    !url.pathname.startsWith('/admin-pwa') &&
    !url.pathname.startsWith('/api/admin/manifest') &&
    !url.pathname.startsWith('/api/brand/icon')
  ) {
    return;
  }

  // Network-first for HTML / manifest so brand/logo updates apply quickly
  if (
    request.mode === 'navigate' ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname === '/api/admin/manifest' ||
    url.pathname.startsWith('/api/brand/icon')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
