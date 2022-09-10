const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/js/main.js',
  '/manifest.json',
  '/css/main.css',
  '/assets/icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(version)
    .then(cache => cache.addAll(STATIC_CACHE_URLS))  
  )
});


self.addEventListener('fetch', function(event) {
  	event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open(version).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});