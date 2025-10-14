const cacheName = 'inventaire-v1';
const contentToCache = [
    '/sw.js',
    '/pwa/loading.html',
    '/pwa/icons/logo-512.png',
    '/pwa/loader.css',
    '/img/logo.svg'
];

self.addEventListener("install", e => {
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        await cache.addAll(contentToCache);
    })());
});


self.addEventListener('fetch', (e) => {
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (!(
        e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return;
    }
    e.respondWith((async () => {
        let path = e.request.url.replace(location.origin, '');
        try {
            const response = await fetch(e.request);
            if (contentToCache.includes(path)) {
                const cache = await caches.open(cacheName);
                cache.put(e.request, response.clone());
            }
            return response;
        }
        catch (err) {
            const r = await caches.match(e.request);
            if (r) {
                return r;
            }

            return;
        }
    })());
});