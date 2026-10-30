// SEMI PWA: no caching of account, messages or application data.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Keep requests network-driven to avoid showing stale or private information.
});
