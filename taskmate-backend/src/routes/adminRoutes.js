import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  unblockUser,
  getAllTasks,
  getAdminStats,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsers);
router.put("/unblock/:id", unblockUser);
router.get("/tasks", getAllTasks);
router.get("/stats", getAdminStats);

export default router;

