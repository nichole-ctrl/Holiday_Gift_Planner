/* PWA v5: only cache decorative assets. Account pages, scripts,
   Supabase requests, user data and Netlify functions are never cached. */
const CACHE = 'holiday-gift-planner-assets-v5';
const ASSETS = ['/assets/gift-icon.png','/assets/dashboard-icon.png','/assets/christmas-lights.png','/assets/account-icon.png','/assets/setup-icon.png','/assets/stars-icon.png','/assets/gift-log.png','/assets/pwa-icon-192.png','/assets/pwa-icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('holiday-gift-planner-assets-') && key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode === 'navigate') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith('/assets/')) return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
