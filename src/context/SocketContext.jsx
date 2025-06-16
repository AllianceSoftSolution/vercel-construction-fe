import React, { createContext, useContext, useEffect } from "react";
import { socket, adminConnect, clientConnect } from "../socket";

const SocketContext = createContext();

// Custom hook to use the socket context
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider component
export const SocketProvider = ({ children, role, adminId, clientId }) => {
  useEffect(() => {
    // Connect to the socket server
    socket.connect();

    if (role === "CLIENT" && clientId) {
      clientConnect(clientId);
    } else if (role && adminId) {
      adminConnect(adminId);
    }

    // Handle cleanup when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [role, adminId, socket, clientId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
