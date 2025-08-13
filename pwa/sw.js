const CACHE = 'boutique-v1';
const PRECACHE_URLS = ['/', '/index.html', '/pwa/manifest.json', '/pwa/icons/icon-192.png', '/pwa/icons/icon-512.png'];

// install
self.addEventListener('install', evt=>{
  evt.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

// activate
self.addEventListener('activate', evt=>{
  evt.waitUntil(self.clients.claim());
});

// fetch
self.addEventListener('fetch', evt=>{
  if (evt.request.method !== 'GET') return;
  evt.respondWith(caches.match(evt.request).then(cached=>{
    if (cached) return cached;
    return fetch(evt.request).then(resp=>{
      // cache GET requests to same-origin assets
      if(resp && resp.type === 'basic' && evt.request.url.startsWith(self.location.origin)){
        const respClone = resp.clone();
        caches.open(CACHE).then(c=>c.put(evt.request, respClone));
      }
      return resp;
    }).catch(() => caches.match('/'));
  }));
});
