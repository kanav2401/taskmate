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
  unblockUser,
} from "../controllers/taskController.js";
import { requestUnblock, adminUnblockUser } from "../controllers/taskController.js";

const router = express.Router();

/* CLIENT */
router.post("/", authMiddleware, createTask);
router.get("/client", authMiddleware, getClientTasks);
router.put("/:id/complete", authMiddleware, completeTask);

/* VOLUNTEER */
router.get("/", authMiddleware, getOpenTasks);
router.put("/:id/accept", authMiddleware, acceptTask);
router.put("/:id/submit", authMiddleware, submitTask);
router.get("/volunteer", authMiddleware, getVolunteerTasks);

/* TASK DETAIL */
router.get("/:id", authMiddleware, getTaskById);

/* ADMIN STYLE */
router.put("/unblock/:id", authMiddleware, unblockUser);

router.put("/request-unblock", authMiddleware, requestUnblock);
router.put("/admin/unblock/:id", authMiddleware, adminUnblockUser);

export default router;
