var staticCacheName = 'gatinhos-v1';
var savedCacheCats = 'saved-gatinhos-v1';

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
            }),
            cacheNames.filter(function (cacheName) {
               return cacheName.startsWith('saved-gatinhos-') &&
                      cacheName != savedCacheCats;
            }).map(function (cacheName) {
               return caches.delete(cacheName);
            })
         )
      })
   );
});
//
self.addEventListener('fetch', function(event) {
   var fetched;

   if(event.request.url.endsWith(".jpg")) {
      fetched = fetch(event.request).then(function (response) {
         caches.open(savedCacheCats).then(function (cache) {
            cache.add(event.request.url);
         });     
         
         return response;         
      }).catch(function () {
         return caches.match('http://localhost:8080/images/no-internet-cat.jpg');
      });
      
      event.respondWith(fetched);
      return;
   }
   else {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request)
        })
    );
   }
});

// 
self.addEventListener('message', function (event) {
   if (event.data.action == 'skipWaiting') {
      self.skipWaiting();
   }
});

function sendMessageToClient(client, msg){
    return new Promise(function(resolve, reject){
        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            }else{
                resolve(event.data);
            }
        };

        client.postMessage(msg, [msg_chan.port2]);
    });
}