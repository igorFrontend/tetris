const CACHE_NAME = 'network-or-cache-v1' // имя хранилища (CacheStorage API)
const TIMEOUT = 3000

// Network or cache  

const fromNetwork = (request: any, timeout: number) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(reject, timeout)
        fetch(request).then((response) => {
            clearTimeout(timeoutId)
            resolve(response)
        }, reject);
    });
}

const fromCache = (request: any) => {
    // Открываем CacheStorage API. И ищем там запрошенный ресурс.
    // В случае отсутствия соответствия значения Promise выполнится успешно, но со значением `undefined`
    return caches.open(CACHE_NAME).then(cache => {
        return cache.match(request)
    });
}

self.addEventListener('install', (event: any) => {
    console.log('установка sw')
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll([
            '/main.js',
            '/index.html',
        ])
    ));
});

self.addEventListener('activate', (event: any) => {
    console.log('активация sw')
});

self.addEventListener('fetch', (event: any) => {
    console.log('Происходит запрос на сервер')
    event.respondWith(
        fromNetwork(event.request, TIMEOUT)
            .catch(err => {
                console.log(`Error: ${err}`)
                return fromCache(event.request)
            })
    )
})