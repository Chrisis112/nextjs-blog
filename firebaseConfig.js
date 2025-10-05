import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB7CjTWr6SyyWTPR6tKept6jBFDw13Y9qE",
  authDomain: "naichai-b095d.firebaseapp.com",
  projectId: "naichai-b095d",
  storageBucket: "naichai-b095d.firebasestorage.app",
  messagingSenderId: "881895896795",
  appId: "1:881895896795:web:fa89446ae666534c59befe",
  measurementId: "G-H51N6EQPL0",
};

const app = initializeApp(firebaseConfig);

let messaging = null;
if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn("Firebase Messaging is not supported in this environment.", err);
  }
}

export { messaging, getToken, onMessage };
