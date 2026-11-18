// Service worker: HTML sentiasa diambil segar dari rangkaian (tanpa cache pelayar) supaya versi baharu
// terus dipaparkan; aset berhash (assets/*) dicache untuk kegunaan luar talian.
const CACHE = 'pandai-tajwid-v4';
const FONTS = 'pandai-tajwid-fonts-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./manifest.webmanifest', './icon.svg', './icon-192.png']))); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== FONTS).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Fon Google (Amiri / Plus Jakarta Sans) dicache supaya tulisan Arab kekal cantik ketika luar talian
  if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(req.url)) {
    e.respondWith(caches.open(FONTS).then((c) => c.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }))));
    return;
  }
  if (!req.url.startsWith(self.location.origin) || req.url.includes('/jualan/')) return; // halaman jualan tidak dicache sebagai aplikasi
  if (req.mode === 'navigate' || req.url.endsWith('/') || req.url.endsWith('.html')) {
    e.respondWith(fetch(req, { cache: 'no-store' }).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return r; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok && req.url.includes('/assets/')) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; })));
});
