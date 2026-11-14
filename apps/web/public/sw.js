// Service Worker base do Playbook do Time — fase 1: instalação PWA.
// Cache e leitura offline serão implementados na fase 2.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
