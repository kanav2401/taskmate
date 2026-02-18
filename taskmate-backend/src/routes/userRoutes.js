import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* ===============================
   REQUEST UNBLOCK
=============================== */
router.put("/request-unblock", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.isBlocked) {
      return res.status(400).json({ message: "You are not blocked" });
    }

    user.unblockRequested = true;
    user.unblockMessage = req.body.message;

    await user.save();

    res.json({ message: "Unblock request sent to admin." });
  } catch (error) {
    res.status(500).json({ message: "Request failed" });
  }
});

export default router;
