import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "../utils/firebase";

const DEFAULT_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const usePushNotification = (vapidKey = DEFAULT_VAPID_KEY) => {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? window.Notification.permission
      : "unsupported"
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    // Defensive: Check for Notification and serviceWorker before any reference
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      setError("Push notifications are not supported in this environment.");
      return;
    }
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setError("Push notifications are not supported in this browser.");
      setPermission("unsupported");
      return;
    }
    if (!vapidKey) {
      setError("No VAPID key provided for push notifications.");
      return;
    }
    // Only reference Notification after checks
    window.Notification.requestPermission()
      .then((permission) => {
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
      })
      .catch((err) => {
        setError("Notification permission request failed.");
        console.error(err);
      });
  }, [vapidKey]);

  // Listen for foreground messages
  const onMessageListener = (callback) => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      return () => {};
    }
    return onMessage(messaging, callback);
  };

  return { token, onMessageListener, permission, error };
};

export default usePushNotification;
