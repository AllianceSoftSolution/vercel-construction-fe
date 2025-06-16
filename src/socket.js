import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

// Initialize the socket connection
export const socket = io(SOCKET_URL, {
  autoConnect: false, // Auto-connect when manually triggered
});

// Helper function to join a specific room
export const joinRoom = (role, roomId) => {
  socket.emit("joinRoom", { role, roomId });
};

export const adminConnect = (adminId) => {
  socket.emit("adminConnect", { adminId });
};

export const clientConnect = (clientId) => {
  socket.emit("clientConnect", { clientId });
};

// Helper function to send a notification
export const sendNotification = (roomId, message) => {
  socket.emit("sendNotification", { roomId, message });
};
