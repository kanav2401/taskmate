import express from "express";
import {
  createTask,
  getAllTasks,
  acceptTask,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.put("/:id/accept", authMiddleware, acceptTask);

export default router;
