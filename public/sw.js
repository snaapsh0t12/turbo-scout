var cacheName = "turbo-scout";

self.addEventListener("install", (event) => { 
  console.log("sw installed")
  event.waitUntil(
    // clear caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName)
        })
      )
    }).then(() => {
      console.log("caches cleared")
      // write caches
      fetch("./cacheMap.json")
        .then((result) => {
          return result.json()
        })
        .then((data) => {
          var {urls} = data

          caches.open(cacheName)
            .then((cache) => {
              console.log("opened cache")
            
              urls.forEach((url) => {
                cache.add(url)
                  .catch((error) => {
                    console.log("error at url " + url + ":", error)
                  })
              })  
            
            }) 
        })
    })
  )
});

self.addEventListener("fetch", (event) => {
  console.log("sw fetch")
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // cache exists
          return response
        } else {t
          // cache doesnt
          console.log("caches doesn't exist, fetching: ", event.request)
          return fetch(event.request).then(
            (response) => {
              // check if response is valid
              if (!response || response.status !== 200 || response.type !== "basic") {
                return response
              }
              else {
              // clone the response so we can both cache and have the browser consume it
              var responseCache = response.clone()
              caches.open(cacheName)
                .then((cache) => {
                  cache.put(event.request, responseCache)
                }
              )
              
              return response
              }
            }
          )
        }
      }
    )
  )
});

self.addEventListener("activate", (event) => {
  console.log("sw activated")
});
