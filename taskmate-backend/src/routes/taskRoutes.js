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
  fundTask, 
  withdrawFunds,        
  getMyTransactions,           
} from "../controllers/taskController.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);

router.get("/client", authMiddleware, getClientTasks);

router.get("/", authMiddleware, getOpenTasks);

router.get("/volunteer", authMiddleware, getVolunteerTasks);

router.put("/:id/accept", authMiddleware, acceptTask);

router.put("/:id/submit", authMiddleware, submitTask);

router.put("/:id/complete", authMiddleware, completeTask);

router.put("/:id/rate", authMiddleware, rateTask);

router.get("/:id", authMiddleware, getTaskById);

router.put("/:id/fund", authMiddleware, fundTask);
router.put("/wallet/withdraw", authMiddleware, withdrawFunds);
router.get("/wallet/transactions", authMiddleware, getMyTransactions);

export default router;
