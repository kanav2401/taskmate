import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";
import deadlineChecker from "./jobs/deadlineChecker.js";
import { sendEmail } from "./utils/emailService.js";

/* AI + CHAT */
import Message from "./models/Message.js";
import { detectToxicMessage } from "./services/aiService.js";

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

  /* ===============================
     REGISTER USER
  =============================== */

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  /* ===============================
     JOIN CHAT ROOM
  =============================== */

  socket.on("joinRoom", (taskId) => {
    socket.join(taskId);
  });

  /* ===============================
     SEND CHAT MESSAGE (AI MODERATION)
  =============================== */

  socket.on("sendMessage", async (data) => {

    try {

      /* AI SCAM / TOXIC DETECTION */

      const aiResult = await detectToxicMessage(data.text);

      let parsed;

      try {
        parsed = JSON.parse(aiResult);
      } catch {
        parsed = { flagged: false };
      }

      /* SAVE MESSAGE */

      const newMessage = new Message({
        task: data.taskId,
        sender: data.sender,
        text: data.text,
        fileUrl: data.fileUrl || null,
        delivered: true,

        flagged: parsed.flagged,
        flagReason: parsed.reason || "",
        aiChecked: true
      });

      await newMessage.save();

      /* SEND MESSAGE TO CHAT ROOM */

      io.to(data.taskId).emit("receiveMessage", newMessage);

    } catch (error) {

      console.error("CHAT MESSAGE ERROR:", error);

    }

  });

  /* ===============================
     DISCONNECT
  =============================== */

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