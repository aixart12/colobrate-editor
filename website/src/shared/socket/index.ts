// socket.js

import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL  // Replace with your backend URL

// Create and export the socket instance
const socket = io(SOCKET_URL, {
  autoConnect: false, // Auto-connect disabled to control manually when needed
});

export default socket;
