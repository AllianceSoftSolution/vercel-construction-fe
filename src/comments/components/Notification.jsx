import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const { socket } = useSocket();

  useEffect(() => {
    // Listen for incoming notifications from the server
    socket.on("receiveNotification", (message) => {
      console.log("Notification received:", message);
      setNotifications((prev) => [...prev, message]);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("receiveNotification");
    };
  }, [socket]);

  const handleSendNotification = () => {
    const roomId = "Admin-room01"; // Make sure this matches the room joined
    socket.emit("sendNotification", { roomId, message });
    setMessage("");
  };

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      {/* <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter notification message"
      />
      <button onClick={handleSendNotification}>Send Notification</button> */}
    </div>
  );
};

export default Notification;
