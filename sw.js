const CACHE_NAME = 'transferpay-v4.3';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/auth.js',
    '/js/credit.js',
    '/js/myiphone.js',
    '/js/zdSMS.js',
    '/js/bancos/bpa.js',
    '/js/bancos/bandec.js',
    '/js/bancos/banmet.js',
    '/pages/home.html',
    '/pages/bpa.html',
    '/pages/bandec.html',
    '/pages/banmet.html',
    '/pages/myiphone.html',
    '/pages/credit.html',
    '/manifest.json',
    '/assets/icons/icono-app.png',
    '/assets/images/banner-bpa.png',
    '/assets/images/bandec-barra.png',
    '/assets/images/banmet-barra.png',
    '/assets/images/mimovil-baner.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => new Response('🔌 Sin conexión', { status: 503 }))
    );
});