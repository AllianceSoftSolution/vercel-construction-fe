import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

// getMessaging() requires HTTPS + Service Worker support.
// Wrapping in try-catch prevents a crash on HTTP or unsupported browsers
// which would otherwise blank out the entire React app.
let messaging = null;
try {
  messaging = getMessaging(firebaseApp);
} catch (err) {
  console.warn('Firebase Messaging is not supported in this environment:', err.message);
}

export { messaging, getToken, onMessage }; 