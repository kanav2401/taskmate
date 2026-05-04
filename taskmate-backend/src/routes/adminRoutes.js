import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAdminStats,
  getAllUsers,
  getAllTasks,
  banUser,
  unblockUser,
  getFlaggedMessages
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getAdminStats);

router.get("/users", getAllUsers);
router.put("/ban/:id", banUser);
router.put("/unblock/:id", unblockUser);

router.get("/tasks", getAllTasks);

router.get("/flagged-messages", getFlaggedMessages);

export default router;
