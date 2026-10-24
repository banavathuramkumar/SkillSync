import { io } from "socket.io-client";

let socket = null;

const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5000");

/**
 * Initialize authenticated real-time Socket.IO connection
 */
export const connectSocket = (token) => {
  if (!token) return null;

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_SERVER_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("[Socket.IO Client] Connected to real-time notification engine. Socket ID:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.warn("[Socket.IO Client] Connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket.IO Client] Disconnected:", reason);
  });

  return socket;
};

/**
 * Get the active socket instance
 */
export const getSocket = () => socket;

/**
 * Disconnect socket cleanly on logout
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket.IO Client] Cleanly disconnected.");
  }
};
