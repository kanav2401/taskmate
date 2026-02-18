import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createTask,
  getOpenTasks,
  acceptTask,
  getClientTasks,
  getVolunteerTasks,
  getTaskById,
  submitTask,
  completeTask,
  rateTask,
} from "../controllers/taskController.js";

const router = express.Router();

/* ================= CLIENT ================= */

// Create new task
router.post("/", authMiddleware, createTask);

// Client dashboard tasks
router.get("/client", authMiddleware, getClientTasks);

/* ================= VOLUNTEER ================= */

// View open tasks
router.get("/", authMiddleware, getOpenTasks);

// Volunteer dashboard tasks
router.get("/volunteer", authMiddleware, getVolunteerTasks);

// Accept task
router.put("/:id/accept", authMiddleware, acceptTask);

// Submit task
router.put("/:id/submit", authMiddleware, submitTask);

/* ================= CLIENT COMPLETION ================= */

// Mark completed
router.put("/:id/complete", authMiddleware, completeTask);

// Rate volunteer
router.put("/:id/rate", authMiddleware, rateTask);

/* ================= TASK DETAIL (KEEP LAST) ================= */

router.get("/:id", authMiddleware, getTaskById);

export default router;
