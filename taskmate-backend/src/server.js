import dotenv from "dotenv";
dotenv.config(); // ✅ SIMPLE AND RELIABLE

import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";
import deadlineChecker from "./jobs/deadlineChecker.js";
import { sendEmail } from "./utils/emailService.js";

/* ===============================
   DEBUG ENV (REMOVE LATER)
=============================== */

console.log("EMAIL CHECK:", process.env.EMAIL_USER);
console.log("PASS CHECK:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

/* ===============================
   CONNECT DATABASE
=============================== */

connectDB();

/* ===============================
   RUN CRON JOB
=============================== */

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

/* ===============================
   STORE ONLINE USERS
=============================== */

const onlineUsers = new Map();

io.on("connection", (socket) => {

  console.log("🔵 User connected:", socket.id);

  /* REGISTER USER FOR NOTIFICATIONS */

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  /* JOIN CHAT ROOM */

  socket.on("joinRoom", (taskId) => {
    socket.join(taskId);
  });

  /* SEND CHAT MESSAGE */

  socket.on("sendMessage", (data) => {
    io.to(data.taskId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {

    console.log("🔴 User disconnected:", socket.id);

    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });

});

/* ===============================
   EMAIL TEST
=============================== */

sendEmail(
  "sharmakanav53@gmail.com",
  "TaskMate Email Test",
  "<h2>Email system is working ✅</h2>"
);

/* ===============================
   EXPORT SOCKET
=============================== */

export { io, onlineUsers };

/* ===============================
   START SERVER
=============================== */

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});