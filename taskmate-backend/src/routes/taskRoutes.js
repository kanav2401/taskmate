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
  requestUnblock,
  adminUnblockUser,
  rateTask,
} from "../controllers/taskController.js";

const router = express.Router();

/* ================= CLIENT ================= */
router.post("/", authMiddleware, createTask);
router.get("/client", authMiddleware, getClientTasks);

/* ================= VOLUNTEER ================= */
router.get("/", authMiddleware, getOpenTasks);
router.get("/volunteer", authMiddleware, getVolunteerTasks);
router.put("/:id/accept", authMiddleware, acceptTask);
router.put("/:id/submit", authMiddleware, submitTask);
router.put("/:id/complete", authMiddleware, completeTask);
router.put("/:id/rate", authMiddleware, rateTask);

/* ================= ADMIN ACTIONS ================= */
router.put("/request-unblock", authMiddleware, requestUnblock);
router.put("/admin/unblock/:id", authMiddleware, adminUnblockUser);
router.put("/unblock/:id", authMiddleware, unblockUser);

/* ================= TASK DETAIL (MUST BE LAST) ================= */
router.get("/:id", authMiddleware, getTaskById);

export default router;
