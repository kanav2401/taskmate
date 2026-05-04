import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";
import deadlineChecker from "./jobs/deadlineChecker.js";
import { sendEmail } from "./utils/emailService.js";

import Message from "./models/Message.js";
import { detectToxicMessage } from "./services/aiService.js";

console.log("EMAIL CHECK:", process.env.EMAIL_USER);
console.log("PASS CHECK:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

connectDB();

deadlineChecker();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {

  console.log("🔵 User connected:", socket.id);

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("joinRoom", (taskId) => {
    socket.join(taskId);
  });

  socket.on("sendMessage", async (data) => {

    try {

      const aiResult = await detectToxicMessage(data.text);

      let parsed;

      try {
        parsed = JSON.parse(aiResult);
      } catch {
        parsed = { flagged: false };
      }

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

      io.to(data.taskId).emit("receiveMessage", newMessage);

    } catch (error) {

      console.error("CHAT MESSAGE ERROR:", error);

    }

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

export { io, onlineUsers };

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
