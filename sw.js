self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open('fashion-cache-v1').then(c => c.addAll(['/','/index.html','/assets/styles.css','/app.js','/manifest.json'])));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.url.includes('data/') ){
    e.respondWith(fetch(req).catch(()=>caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(res => res || fetch(req)));
});