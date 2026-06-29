const C = 'pu-v3';
const SHELL = [
  '/project-updates/index.html',
  '/project-updates/map.html',
  '/project-updates/chat.html',
  '/project-updates/manifest.webmanifest',
  '/project-updates/icon-192.png',
  '/project-updates/icon-512.png'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.pathname.startsWith('/api/')) return; // never cache data/auth
  // network-first: always try fresh, cache a copy, fall back to cache offline
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(C).then(cc => cc.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
