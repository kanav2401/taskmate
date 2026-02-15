import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";
import deadlineChecker from "./jobs/deadlineChecker.js";

dotenv.config();

// Connect Database
connectDB();

// Run scheduled job
deadlineChecker();

const PORT = process.env.PORT || 5000;

/* ===============================
   CREATE HTTP SERVER
=============================== */

const server = http.createServer(app);

/* ===============================
   SOCKET.IO SETUP
=============================== */

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("🔵 User connected:", socket.id);

  // Join task room
  socket.on("joinRoom", (taskId) => {
    socket.join(taskId);
  });

  // Send message
  socket.on("sendMessage", (data) => {
    io.to(data.taskId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ===============================
   START SERVER
=============================== */

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
