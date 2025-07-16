const STORAGE_KEY = 'fcm_notifications';

export function getNotifications() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveNotifications(notifications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function addNotification(notification) {
  const notifications = getNotifications();
  notifications.unshift({ ...notification, read: false });
  saveNotifications(notifications);
}

export function markAllAsRead() {
  const notifications = getNotifications().map(n => ({ ...n, read: true }));
  saveNotifications(notifications);
}

export function markAsRead(id) {
  const notifications = getNotifications().map(n =>
    n.id === id ? { ...n, read: true } : n
  );
  saveNotifications(notifications);
}

export function clearNotifications() {
  localStorage.removeItem(STORAGE_KEY);
}

// IndexedDB helpers for background notifications
const DB_NAME = 'fcm_notifications_db';
const STORE_NAME = 'notifications';

export async function getNotificationsFromIndexedDB() {
  return new Promise((resolve) => {
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getAllReq = store.getAll();
      getAllReq.onsuccess = function () {
        resolve(getAllReq.result || []);
        db.close();
      };
      getAllReq.onerror = function () {
        resolve([]);
        db.close();
      };
    };
    request.onerror = function () {
      resolve([]);
    };
  });
}

export async function syncNotificationsFromIndexedDB() {
  const indexedDBNotifs = await getNotificationsFromIndexedDB();
  const localNotifs = getNotifications();
  // Merge by id, keep unread/read status from localStorage if present
  const map = new Map();
  [...indexedDBNotifs, ...localNotifs].forEach((n) => {
    map.set(n.id, { ...n, read: n.read || false });
  });
  const merged = Array.from(map.values()).sort((a, b) => new Date(b.time) - new Date(a.time));
  saveNotifications(merged);
  return merged;
} 