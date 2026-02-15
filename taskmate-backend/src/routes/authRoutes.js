import express from "express";
import { register, login, refresh, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// 🔥 ADD THIS ROUTE
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
