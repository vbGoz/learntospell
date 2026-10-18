// Word Club Service Worker
// Handles offline functionality and caching

// Bump VERSION to force installed apps to drop their caches
const VERSION = 'v5';
const CACHE_NAME = `word-club-${VERSION}`;
const AUDIO_CACHE_NAME = `word-club-audio-${VERSION}`;

// Path suffixes of non-page files served network-first so they stay in step with index.html
const NETWORK_FIRST_FILES = ['/manifest.json', '/words.js'];

// Files to cache immediately (critical resources)
const CRITICAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './words.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.skypack.dev/react@18.2.0',
  'https://cdn.skypack.dev/react-dom@18.2.0'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching critical assets');
        // Bypass the browser HTTP cache so a new version never caches a stale page
        return cache.addAll(CRITICAL_ASSETS.map((url) => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        // Rethrow so a failed install keeps the current version (and its caches) in place
        console.error('[Service Worker] Installation failed:', error);
        throw error;
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - audio and libraries cache-first; pages, manifest and word list network-first
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle audio files separately (they're large)
  if (url.pathname.includes('/audio/')) {
    event.respondWith(handleCacheFirst(event.request, AUDIO_CACHE_NAME));
    return;
  }

  // Pages, the manifest and the word list: network-first so new versions show up right away,
  // falling back to the cache when offline
  if (event.request.mode === 'navigate' || NETWORK_FIRST_FILES.some((file) => url.pathname.endsWith(file))) {
    event.respondWith(handleNetworkFirst(event.request));
    return;
  }

  event.respondWith(handleCacheFirst(event.request, CACHE_NAME));
});

// Fetch from the network and store successful responses in the cache
async function fetchAndCache(cache, request, cacheKey = request, init) {
  const response = await fetch(request, init);
  // Only full 200 responses: partial (206) audio range responses can't be cached
  if (response.status === 200) {
    cache.put(cacheKey, response.clone())
      .catch((error) => console.error('[Service Worker] Cache write failed:', request, error));
  }
  return response;
}

// Serve from the cache, fetching and caching on a miss
async function handleCacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    return await fetchAndCache(cache, request);
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', request.url, error);
    throw error;
  }
}

// Fetch fresh from the network, updating the cache; use the cache when offline
async function handleNetworkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  // Cache by path so query strings don't create duplicate entries
  const url = new URL(request.url);
  const cacheKey = url.origin + url.pathname;
  try {
    // Navigation requests can't take fetch options, so fetch by path URL instead (this also drops any query string)
    const response = await fetchAndCache(cache, cacheKey, cacheKey, { cache: 'no-cache' });
    // A server error shouldn't replace a good cached copy
    if (response.status >= 500) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }
    return response;
  } catch (error) {
    console.log('[Service Worker] Offline, serving cached copy:', request.url);
    const cachedResponse = await cache.match(cacheKey) ||
      (request.mode === 'navigate' && await cache.match('./index.html'));
    if (cachedResponse) return cachedResponse;
    throw error;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_AUDIO') {
    // Pre-cache audio files when requested
    const audioFiles = event.data.files;
    cacheAudioFiles(audioFiles);
  }
});

// Helper function to cache multiple audio files
async function cacheAudioFiles(files) {
  const cache = await caches.open(AUDIO_CACHE_NAME);

  for (const file of files) {
    try {
      await fetchAndCache(cache, file);
    } catch (error) {
      console.error('[Service Worker] Failed to cache audio:', file, error);
    }
  }
}
