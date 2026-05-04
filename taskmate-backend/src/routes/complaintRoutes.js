import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Complaint from "../models/Complaint.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import { io, onlineUsers } from "../server.js";

import { analyzeComplaint } from "../services/aiService.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {

try {

const { taskId, message } = req.body;

const task = await Task.findById(taskId)
.populate("client volunteer");

if (!task)
return res.status(404).json({ message: "Task not found" });

let complainAgainstUser = null;

if (req.user.role === "client") {
complainAgainstUser = task.volunteer?._id;
}

if (req.user.role === "volunteer") {
complainAgainstUser = task.client?._id;
}

let aiData = {
category: "",
severity: "",
suggestedAction: ""
};

try {

const aiResult = await analyzeComplaint(message);

const parsed = JSON.parse(aiResult);

aiData = {
category: parsed.category || "",
severity: parsed.severity || "",
suggestedAction: parsed.suggestedAction || ""
};

} catch (err) {

console.log("AI ANALYSIS FAILED:", err);

}

const complaint = await Complaint.create({

task: taskId,

complainBy: req.user.id,

complainAgainst: complainAgainstUser,

message,

role: req.user.role,

aiCategory: aiData.category,
aiSeverity: aiData.severity,
aiSuggestedAction: aiData.suggestedAction,
aiAnalyzed: true

});

const usersToNotify = [];
if (task.client?._id) usersToNotify.push(task.client._id);
if (task.volunteer?._id) usersToNotify.push(task.volunteer._id);

for (const userId of usersToNotify) {
  await Notification.create({
    user: userId,
    title: "Complaint Registered",
    message: `A complaint has been registered regarding your task "${task.title}".`,
    type: "complaint",
  });

  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit("newNotification", {
      title: "Complaint Registered",
      message: `A complaint has been registered regarding your task "${task.title}".`,
      type: "complaint",
      isRead: false,
      createdAt: new Date(),
    });
  }
}

res.json({

message: "Complaint submitted",

complaint

});

} catch (error) {

console.log(error);

res.status(500).json({ message: "Complaint failed" });

}

});

router.get("/", authMiddleware, async (req, res) => {

try {

if (req.user.role !== "admin")
return res.status(403).json({ message: "Admin only" });

const complaints = await Complaint.find()

.populate("complainBy", "name email role")

.populate("complainAgainst", "name email role")

.populate({
path: "task",
select: "title client volunteer",
populate: [
{
path: "client",
select: "name email"
},
{
path: "volunteer",
select: "name email"
}
]
})

.sort({ createdAt: -1 });

res.json(complaints);

} catch (error) {

console.log(error);

res.status(500).json({ message: "Failed to load complaints" });

}

});

router.delete("/:id", authMiddleware, async (req, res) => {

try {

if (req.user.role !== "admin")
return res.status(403).json({ message: "Admin only" });

await Complaint.findByIdAndDelete(req.params.id);

res.json({
message: "Complaint deleted"
});

} catch (error) {

res.status(500).json({
message: "Delete failed"
});

}

});

export default router;
