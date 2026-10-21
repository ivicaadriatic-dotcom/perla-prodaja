const CACHE = 'perla-prodaja-v1.3.1';
/* Pri svakoj novoj verziji promijeniti broj iznad — stara se predmemorija
   tada briše pri aktivaciji, pa se instalirana aplikacija ne zaglavi na staroj. */
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;              // Supabase nikad iz predmemorije
  e.respondWith(
    fetch(e.request, {cache: 'no-store'}).then(r => {
      const c = r.clone();
      caches.open(CACHE).then(ch => ch.put(e.request, c));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
