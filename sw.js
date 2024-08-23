// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = [
  '/',
  '/index.html',
  '/guidnes.html',
  '/styles.css',
  '/scripts.js',
  '/images/icons-192.png',
  '/images/icons-512.png',
  '/images/favicon.ico',
  '/images/North-Arrow.png',
  '/images/edge-prologo.png',
  '/manifest.json',
  '/images/camera_icon.png',
  '/camera.html',
  '/fabric.min.js',
  '/signature_pad.min.js',
  'guidnesList.html'
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(precacheResources);
    })
  );
});

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
