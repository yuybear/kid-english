/* Offline cache — cukup untuk PWA sederhana: network-first untuk HTML, cache-first untuk asset. */
const CACHE = 'kid-english-v1'

// base dari lokasi sw.js sendiri, biar tetap benar walau app ditaruh di subpath
// ('/' di root domain, '/kid-english/' kalau di GitHub Pages)
const BASE = self.location.pathname.replace(/sw\.js$/, '') || '/'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit
      return fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {})
          return res
        })
        .catch(() => caches.match(BASE))
    })
  )
})
