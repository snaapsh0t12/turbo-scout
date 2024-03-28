
var cacheName = "turbo-scout";

self.addEventListener("install", (event) => { 
  self.skipWaiting()
  console.log("sw installed")
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        var urls = ["/turbo-scout"];
        console.log("opened cache")
        return cache.addAll(urls)
      })
      .catch((error) => {
        console.log(error)
      })
  )
});
/*
self.addEventListener("fetch", (event) => {
  console.log("sw fetch")
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        } else {
          return fetch(event.request).then(
            (response) => {
              // check if response is valid
              if (!response || response.status !== 200 || response.type !== "basic") {
                return response
              }
              // clone the response so we can both cache and have the browser consume it
              var responseCache = response.clone()
              caches.open(cacheName)
                .then((cache) => {
                  cache.put(event.request, responseCache)
                }
              )
              
              return response
            }
          )
        }
      }
    )
  )
});
*/
self.addEventListener("activate", (event) => {
  clients.claim()
  console.log("sw activated")
  /*event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName)
        })
      )
    })
  )
  */
});
