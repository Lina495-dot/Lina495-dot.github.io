
const CACHE="me-living-guide-v6-1-brunnenstrasse";
const CORE=[
  "/nl/brunnenstrasse.html",
  "/en/brunnenstrasse.html",
  "/de/brunnenstrasse.html",
  "/assets/js/brunnenstrasse.js",
  "/assets/css/brunnenstrasse.css",
  "/assets/js/concierge-start.js",
  "/assets/css/concierge-start.css",
  "/assets/images/logo/ME_LIVING_logo_v5_transparent.png",
  "/assets/images/logo/ME_LIVING_logo_v4.png",
  "/", "/index.html", "/offline.html", "/manifest.webmanifest",
  "/de/villa-am-kurpark.html","/en/villa-am-kurpark.html","/nl/villa-am-kurpark.html",
  "/assets/css/guide.css","/assets/js/app.js","/assets/js/weather.js","/assets/js/events.js",
  "/assets/js/features.js","/assets/data/villa-am-kurpark.js",
  "/assets/images/logo/ME_LIVING_logo_final.png",
  "/assets/icons/icon-192.png","/assets/icons/icon-512.png"
];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin){
    event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached=>{
      const network=fetch(event.request).then(response=>{
        const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;
      }).catch(()=>cached||caches.match("/offline.html"));
      return cached||network;
    })
  );
});
