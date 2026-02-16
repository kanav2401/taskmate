import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAdminStats,
  getAllUsers,
  getAllTasks,
  banUser,
  unblockUser,
} from "../controllers/adminController.js";

const router = express.Router();

/* =====================================
   PROTECTED ADMIN ROUTES
===================================== */
router.use(authMiddleware);
router.use(adminMiddleware);

/* =====================================
   ANALYTICS
===================================== */
router.get("/stats", getAdminStats);

/* =====================================
   USERS
===================================== */
router.get("/users", getAllUsers);
router.put("/ban/:id", banUser);
router.put("/unblock/:id", unblockUser);

/* =====================================
   TASKS
===================================== */
router.get("/tasks", getAllTasks);

export default router;
