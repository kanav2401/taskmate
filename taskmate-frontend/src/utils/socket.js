import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const socket = io(BASE_URL, {
  withCredentials: true,
});

export default socket;
