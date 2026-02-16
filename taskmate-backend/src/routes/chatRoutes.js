import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import Message from "../models/Message.js";
import Task from "../models/Task.js";

const router = express.Router();

/* =========================
   GET MESSAGES FOR TASK
========================= */
router.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userId = req.user.id;

    const isClient = task.client.toString() === userId;
    const isVolunteer =
      task.volunteer && task.volunteer.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isClient && !isVolunteer && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Message.updateMany(
      {
        task: req.params.taskId,
        sender: { $ne: userId },
        seen: false,
      },
      { seen: true, delivered: true }
    );

    const messages = await Message.find({
      task: req.params.taskId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

/* =========================
   SEND TEXT MESSAGE
========================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { taskId, text, fileUrl } = req.body;

    const message = await Message.create({
      task: taskId,
      sender: req.user.id,
      text: text || "",
      fileUrl: fileUrl || null,
      delivered: true,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Message send failed" });
  }
});

/* =========================
   FILE UPLOAD
========================= */
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  (req, res) => {
    res.json({
      fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
    });
  }
);

export default router;
