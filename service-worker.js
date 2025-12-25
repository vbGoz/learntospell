// Word Club Service Worker
// Handles offline functionality and caching

const CACHE_NAME = 'word-club-v1';
const AUDIO_CACHE_NAME = 'word-club-audio-v1';

// Files to cache immediately (critical resources)
const CRITICAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
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
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle audio files separately (they're large)
  if (url.pathname.includes('/audio/')) {
    event.respondWith(handleAudioRequest(event.request));
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a success
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            // You could return a custom offline page here
            throw error;
          });
      })
  );
});

// Handle audio files with separate caching strategy
async function handleAudioRequest(request) {
  const cache = await caches.open(AUDIO_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log('[Service Worker] Audio from cache:', request.url);
    return cachedResponse;
  }

  try {
    console.log('[Service Worker] Fetching audio:', request.url);
    const response = await fetch(request);

    if (response && response.status === 200) {
      // Clone and cache the audio file
      const responseToCache = response.clone();
      cache.put(request, responseToCache);
    }

    return response;
  } catch (error) {
    console.error('[Service Worker] Audio fetch failed:', error);
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
      const response = await fetch(file);
      if (response && response.status === 200) {
        await cache.put(file, response);
        console.log('[Service Worker] Cached audio:', file);
      }
    } catch (error) {
      console.error('[Service Worker] Failed to cache audio:', file, error);
    }
  }
}
