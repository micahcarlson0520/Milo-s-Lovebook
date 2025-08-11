const CACHE = 'milo-lovebook-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request).then(resp => {
    const copy = resp.clone();
    caches.open(CACHE).then(cache => cache.put(e.request, copy)).catch(()=>{});
    return resp;
  }).catch(() => {
    if (e.request.mode === 'navigate') return caches.match('./index.html');
  })));
});
