/* Huishoudfinanciën: de app zelf op dit apparaat bewaren, zodat hij ook zonder internet opent.
   Altijd eerst de nieuwste versie van internet; lukt dat niet, dan de bewaarde versie. Je gegevens gaan hier niet doorheen. */
const CACHE='hf-app-v1', FILES=['./','index.html','manifest.json','icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==self.location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return r; })
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
