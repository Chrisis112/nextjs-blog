importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Инициализация Firebase
firebase.initializeApp({
  apiKey: "AIzaSyB7CjTWr6SyyWTPR6tKept6jBFDw13Y9qE",
  authDomain: "naichai-b095d.firebaseapp.com",
  projectId: "naichai-b095d",
  storageBucket: "naichai-b095d.firebasestorage.app",
  messagingSenderId: "881895896795",
  appId: "1:881895896795:web:fa89446ae666534c59befe",
  measurementId: "G-H51N6EQPL0",
});

const messaging = firebase.messaging();

const seenNotifications = new Set();

// Обработка пуш-сообщений (background push)
self.addEventListener('push', (event) => {
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Если есть открыт клиент с видимым окном, не показывать нотификацию здесь
      const isClientVisible = clientList.some(client => client.visibilityState === 'visible');
      if (isClientVisible) {
        console.log('[firebase-messaging-sw.js] Клиент виден - уведомление не показываем в SW');
        return;
      }

      // Получаем payload уведомления
      const payload = event.data ? event.data.json() : {};

      // Избегаем повторных показов одного уведомления
      const notifId = payload.messageId || (payload.notification && payload.notification.tag);
      if (notifId && seenNotifications.has(notifId)) {
        console.log('[firebase-messaging-sw.js] Дубликат уведомления пропущен:', notifId);
        return;
      }
      if (notifId) {
        seenNotifications.add(notifId);
      }

      // Опции уведомления
      const notificationTitle = payload.notification?.title || 'Уведомление';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/firebase-logo.png',
        badge: payload.notification?.badge || '/firebase-badge.png',
        data: payload.data, // можно использовать для обработки клика по уведомлению
      };

      // Показываем системное уведомление
      return self.registration.showNotification(notificationTitle, notificationOptions);
    })
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
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
