import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

// Define the type for the socket instance
let socket: Socket | null = null;

const SOCKET_URL = "http://192.168.147.149:3000"; // Replace with your backend URL

export const initializeSocket = async (): Promise<Socket | null> => {
  const token = await AsyncStorage.getItem("sessionToken");
  const userId = await AsyncStorage.getItem("userId");

  if (!token) {
    console.error("Session token not found.");
    return null;
  }

  if (!userId) {
    console.error("User ID not found, unable to connect to socket.");
    return null;
  }

  // Initialize socket with token-based authentication
  socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: { token },
  });

  if (!socket.connected) {
    socket.connect();
    socket.emit("registerUser", { userId });
  }

  socket.on("connect", () => {
    console.log("Connected to Socket.io server:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected from Socket.io server");
    console.warn("Socket disconnected:", reason);
  });

  return socket; // Return the socket instance
};

export const disconnectSocket = (): void => {
  if (socket && socket.connected) {
    socket.disconnect();
    console.log("Disconnected from Socket.io server");
  }
};

export const getSocket = (): Socket | null => {
  return socket; // Safely return the socket instance
};

export default socket;
