import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTask,
  getOpenTasks,
  acceptTask,
  getClientTasks,
  getVolunteerTasks,
  getTaskById,
} from "../controllers/taskController.js";

const router = express.Router();

/* ================= CLIENT ================= */
router.post("/", authMiddleware, createTask);
router.get("/client", authMiddleware, getClientTasks);

/* ================= VOLUNTEER ================= */
router.get("/", authMiddleware, getOpenTasks);
router.put("/:id/accept", authMiddleware, acceptTask);
router.get("/volunteer", authMiddleware, getVolunteerTasks);

/* ================= TASK DETAIL (KEEP LAST) ================= */
router.get("/:id", authMiddleware, getTaskById);

export default router;
