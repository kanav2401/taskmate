import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/* ===============================
   🔥 FORCE LOAD .ENV (ESM SAFE)
=============================== */

// recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load .env from backend root
dotenv.config({ path: path.join(__dirname, "../.env") });

/* ===============================
   NORMAL IMPORTS
=============================== */

import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import app from "./app.js";
import deadlineChecker from "./jobs/deadlineChecker.js";

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
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔵 User connected:", socket.id);

  socket.on("joinRoom", (taskId) => {
    socket.join(taskId);
  });

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
