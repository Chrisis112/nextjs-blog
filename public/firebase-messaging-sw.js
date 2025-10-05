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

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/naicahi.jpg'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
