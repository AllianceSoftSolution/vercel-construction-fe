import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "../utils/firebase";

const DEFAULT_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const usePushNotification = (vapidKey = DEFAULT_VAPID_KEY) => {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState(Notification.permission);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("VAPID Key used for FCM:", vapidKey); // Debug log
    if (!vapidKey) return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setError("Push notifications are not supported in this browser.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      setPermission(permission);
      if (permission === "granted") {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            getToken(messaging, {
              vapidKey,
              serviceWorkerRegistration: registration,
            })
              .then((currentToken) => {
                if (currentToken) {
                  setToken(currentToken);
                } else {
                  setError("No registration token available.");
                }
              })
              .catch((err) => {
                setError("An error occurred while retrieving token.");
                console.error(err);
              });
          })
          .catch((err) => {
            setError("Service worker registration failed.");
            console.error(err);
          });
      }
    });
  }, [vapidKey]);

  // Listen for foreground messages
  const onMessageListener = (callback) => {
    return onMessage(messaging, callback);
  };

  return { token, onMessageListener, permission, error };
};

export default usePushNotification;
