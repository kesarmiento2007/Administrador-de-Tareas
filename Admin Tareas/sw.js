const nombreCache = "app-v1";
    const archivos = [      
    "./",
    "./index.html",
    "./css/normalize.css",
    "./css/estilo.css",
    "./js/sw-support.js",
    "./js/app.js"
];

// Cuando se instala el Service Worker
self.addEventListener("install", e => {  
    console.log("Instalado el Service Worker");

    e.waitUntil(
        caches.open(nombreCache)
            .then( cache => {
                console.log("Cacheando");
                cache.addAll(archivos);
            })
    );
});

// Evento fetch para descargar archivos estáticos
self.addEventListener("fetch", e => {
    e.respondWith(
        fetch(e.request)
            .catch( () => {
                return caches.match(e.request);
            })
    );
});

// Activar el Service Worker
self.addEventListener("activate", e => {
    console.log("Service Worker Activado");

    e.waitUntil(
        caches.keys()
            .then( keys => {
                return Promise.all(
                    keys.filter( key => key !== nombreCache )
                        .map( key => caches.delete(key) )
                )
            })
    );
});