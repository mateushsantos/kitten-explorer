var staticCacheName = 'gatinhos-v1';
var staticCacheImageName = 'gatinhos-image-v1';
var savedCacheCats = 'saved-gatinhos';
var arrGatos = [];

self.addEventListener('install', function (event) {
   event.waitUntil(
      caches.open(staticCacheName).then(function (cache) {
         return cache.addAll(['/', 
                              '/stylesheets/style.css',
                              '/js/index.js',
                              '/images/no-internet-cat.jpg',
                              '/icon-144x144.png',
                              'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/js/materialize.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css',
                              'https://code.jquery.com/jquery-2.1.1.min.js']);
      })
   );
});

self.addEventListener('activate', function (event) {
   event.waitUntil(
      caches.keys().then(function (cacheNames) {
         return Promise.all(
            cacheNames.filter(function (cacheName) {
               return cacheName.startsWith('gatinhos-') &&
                      cacheName != staticCacheName;
            }).map(function (cacheName) {
               return caches.delete(cacheName);
            })
         )
      })
   );
});
///
self.addEventListener('fetch', function(event) {
   var fetched;
   
   if(event.request.url.endsWith('meda/novos/gatos')) {
        var imagemDoGato;
        caches.open(savedCacheCats).then(function (cache) {
            cache.add()
        })
   }

   if(event.request.url.endsWith(".jpg")) {
      fetched = fetch(event.request).then(function (response) {
         caches.open(staticCacheImageName).then(function (cache) {
            cache.add(event.request);
         });         
         self.postMessage({
                           action: 'addCats',
                           url: event.request.url   
                        });
         
         return response;
         
      }).catch(function () {
         return caches.match('http://localhost:8080/images/no-internet-cat.jpg');
      });
      
      event.respondWith(fetched);
      return;
   }
   
   event.respondWith(
      caches.match(event.request).then(function(response) {
         return response || fetch(event.request)
      })
   );
});

//
self.addEventListener('message', function (event) {
   if (event.data.action == 'skipWaiting') {
      self.skipWaiting();
   }
});