const CACHE_NAME = 'pal-grad-hub-v8';
const ASSETS = ['./', './index.html', './ngo.html', './manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const reqUrl = new URL(event.request.url);
  // Skip live weather / OpenAlex APIs from being permanently stale-cached by SW (handled in app localStorage)
  if (reqUrl.hostname.includes('open-meteo.com') || reqUrl.hostname.includes('openalex.org')) return;

  event.respondWith(
    fetch(event.request).then(resp => {
      if (resp && resp.status === 200 && (resp.type === 'basic' || resp.type === 'cors')) {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
      }
      return resp;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html', './ngo.html')))
  );
});
