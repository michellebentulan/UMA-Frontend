import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

// Define the type for the socket instance
let socket: Socket | null = null;

const SOCKET_URL = "http://192.168.29.149:3000"; // Replace with your backend URL

export const initializeSocket = async (): Promise<Socket | null> => {
  // If socket is already initialized, return it.
  if (socket) {
    return socket;
  }

  try {
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
      timeout: 40000,
    });

    socket.connect(); // Connect the socket

    // Listen for successful connection
    socket.on("connect", () => {
      console.log("Connected to Socket.io server:", socket?.id);

      // Emit registerUser event after the socket is connected
      socket?.emit("registerUser", { userId });
    });

    // Handle disconnection events
    socket.on("disconnect", (reason) => {
      console.log("Disconnected from Socket.io server");
      // console.warn("Socket disconnected:", reason);
    });

    // Handle connection errors
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return socket; // Return the socket instance
  } catch (error) {
    console.error("Error initializing socket:", error);
    return null;
  }
};

export const disconnectSocket = (): void => {
  if (socket && socket.connected) {
    socket.disconnect();
    console.log("Disconnected from Socket.io server");
  }
  socket = null; // Set socket to null to allow reinitialization
};

export const getSocket = (): Socket | null => {
  return socket; // Safely return the socket instance
};

export default socket;
