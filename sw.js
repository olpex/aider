// Service Worker для фонових сповіщень
const CACHE_NAME = 'claude-tracker-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/app.js',
  '/index.html'
];

// Встановлення SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Активація
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Push сповіщення
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Нові оновлення щодо безкоштовного Claude Code!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'claude-update',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Відкрити'
      },
      {
        action: 'close',
        title: 'Закрити'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Claude Tracker', options)
  );
});

// Клік по сповіщенню
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Фонова синхронізація (для автономного оновлення)
self.addEventListener('sync', event => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
});

async function checkForUpdates() {
  try {
    const response = await fetch('/api/check-updates');
    const data = await response.json();
    
    // Якщо є нові пропозиції - показуємо сповіщення
    if (data.data.foundOffers.some(offer => offer.isNew)) {
      self.registration.showNotification('Claude Tracker', {
        body: 'Знайдено новий спосіб отримати Claude Code безкоштовно!',
        icon: '/icon-192x192.png'
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
