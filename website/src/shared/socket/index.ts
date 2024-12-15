// socket.js

import { io } from "socket.io-client";

const SOCKET_URL = process.env.API_URL || "http://localhost:5000"; // Replace with your backend URL

// Create and export the socket instance
const socket = io(SOCKET_URL, {
  autoConnect: false, // Auto-connect disabled to control manually when needed
});

export default socket;
