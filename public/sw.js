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
  var request = event.request.url.lastIndexOf("?") > -1 ? event.request.url.substring(0, event.request.url.lastIndexOf("?")) : event.request
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          // cache exists
          console.log("fetched: ", request, " from existing cache:", response)
          return response
        } else {
          // cache doesnt
          return fetch(request).then(
            (response) => {
              // check if response is valid
              if (!response || response.status !== 200) {
                console.log("caches doesn't exist, fetching: ", request, response,"\nfailed fetch") 
                return response
              }
              else {
                console.log("caches doesn't exist, fetching: ", request, response,"\nsucceeded fetch") 
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
          ).catch((error) => {
            console.log("fetch error: ", error)
            return Response.error()
          })
        }
      }
    )
  )
});

self.addEventListener("activate", (event) => {
  console.log("sw activated")
});
