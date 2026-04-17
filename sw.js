// sw.js — Service Worker for offline PWA

const CACHE = 'memory-pro-v3';
const ASSETS = [
  '.',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/tts.js',
  'js/db.js',
  'js/cards.js',
  'js/ui.js',
  'js/app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'https://unpkg.com/dexie@3/dist/dexie.js'
];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        // Cache new requests dynamically
        return caches.open(CACHE).then(cache => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(() => caches.match('index.html'))
  );
});
