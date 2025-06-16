import { useEffect, useState } from "react";

const usePushNotification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);

  // Check if the browser supports Push Notifications and Service Workers
  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      // Request notification permission
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });

      // Register the Service Worker
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          // Subscribe to push notifications
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey:
                "BJsKrdZzG85-YV3_DUKQrpaQWfzj66UrGg4BFTO3rTvgsGvrPY5wZ2yEEnXD3QsGJAMtSbiQbX0k0xTm6F1ZiTk", // Replace with your VAPID public key
            })
            .then((subscription) => {
              console.log("Push subscription:", subscription);
              setSubscription(subscription);
              setIsSubscribed(true);
            })
            .catch((err) => {
              console.error("Error subscribing to push notifications", err);
            });
        })
        .catch((err) => {
          console.error("Error registering service worker:", err);
        });
    }
  }, []);

  // Function to trigger a push notification
  const triggerNotification = (title, body) => {
    if (isSubscribed) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: body,
          icon: "favicon3percent.png",
          badge: "favicon3percent.png",
          data: {
            url: "https://tax-advisor-fe.netlify.app",
          },
        });
      });
    }
  };

  return {
    isSubscribed,
    triggerNotification,
  };
};

export default usePushNotification;
