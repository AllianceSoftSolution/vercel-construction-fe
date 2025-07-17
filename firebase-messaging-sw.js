/* eslint-disable no-undef */
// NOTE: These values should be replaced at build time or manually from your .env file
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
   apiKey: "AIzaSyDLt0N3B99-QllAW87wXVij2Vo0H7zUd5A",
  authDomain: "radc-a6ce0.firebaseapp.com",
  projectId: "radc-a6ce0",
  storageBucket: "radc-a6ce0.firebasestorage.app",
  messagingSenderId: "934510833161",
  appId: "1:934510833161:web:914a0793891e07e06e92d8",
  measurementId: "G-E2QL9V53D2"
});

const messaging = firebase.messaging();

// IndexedDB helpers for notifications
const DB_NAME = 'fcm_notifications_db';
const STORE_NAME = 'notifications';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveNotificationToDB(notification) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(notification);
    tx.oncomplete = () => db.close();
  } catch (e) {
    // Ignore errors
  }
}

function persistNotification(payload) {
  const { title, body } = payload.notification || {};
  const id = payload.messageId || Date.now();
  const time = new Date().toISOString();
  const notification = { id, title, body, time, read: false };
  saveNotificationToDB(notification);
}

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  persistNotification(payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 