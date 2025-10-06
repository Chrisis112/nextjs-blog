importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB7CjTWr6SyyWTPR6tKept6jBFDw13Y9qE",
  authDomain: "naichai-b095d.firebaseapp.com",
  projectId: "naichai-b095d",
  storageBucket: "naichai-b095d.firebasestorage.app",
  messagingSenderId: "881895896795",
  appId: "1:881895896795:web:fa89446ae666534c59befe",
  measurementId: "G-H51N6EQPL0",
});

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

const seenNotifications = new Set();

// Обработка пуш-сообщений (event push)
self.addEventListener('push', (event) => {
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Если хоть один клиент видим и активен - не показываем нотификацию, пуш обработаем в foreground
      const isClientVisible = clientList.some(client => client.visibilityState === 'visible');
      if (isClientVisible) {
        console.log('[firebase-messaging-sw.js] Client visible - skip showing notification in SW');
        return;
      }

      // Парсим payload из push события
      const payload = event.data ? event.data.json() : {};

      const notifId = payload.messageId || (payload.notification && payload.notification.tag);
      if (notifId && seenNotifications.has(notifId)) {
        console.log('[firebase-messaging-sw.js] Duplicate notification ignored:', notifId);
        return;
      }
      if (notifId) {
        seenNotifications.add(notifId);
      }

      const notificationTitle = payload.notification?.title || 'Уведомление';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/firebase-logo.png',
        badge: payload.notification?.badge,
        data: payload.data,
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    })
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
