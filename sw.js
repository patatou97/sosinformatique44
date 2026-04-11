/* Service Worker SOS Informatique 44 — v1
   Strategie : network-first pour le HTML (fraicheur), cache-first pour les assets statiques */

const CACHE_VERSION = 'sos44-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

/* Ressources a pre-cacher au install */
const PRECACHE_URLS = [
  '/',
  '/logo-sos.webp',
  '/favicon-192.png',
  '/manifest.json',
  '/js/purify.min.js'
];

/* Install : pre-cache des ressources critiques */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* Activate : nettoie les anciens caches */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

/* Fetch : strategie par type de ressource */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Ignorer les requetes non-GET et cross-origin (sauf CRM blog) */
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !url.hostname.endsWith('crm.sos-informatique44.fr')) return;

  /* Ignorer les requetes vers l'API CRM et GA (toujours network) */
  if (url.pathname.startsWith('/api/') || url.hostname.includes('google')) return;

  /* HTML : network-first (site toujours a jour) */
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/')))
    );
    return;
  }

  /* Assets statiques (images, CSS, JS, fonts) : cache-first */
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.status === 200) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
