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

/*
=====================================
   🔐 ALL ADMIN ROUTES PROTECTED
=====================================
   1. Must be logged in
   2. Must be admin
=====================================
*/
router.use(authMiddleware);
router.use(adminMiddleware);

/*
=====================================
   📊 ADMIN DASHBOARD DATA
=====================================
*/

// Get admin stats (users, tasks, blocked count)
router.get("/stats", getAdminStats);

// Get all users
router.get("/users", getAllUsers);

// Unblock user
router.put("/unblock/:id", unblockUser);

// Get all tasks (full system overview)
router.get("/tasks", getAllTasks);

export default router;
