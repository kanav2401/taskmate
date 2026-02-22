import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* =========================================
   GET USER PROFILE (FOR VOLUNTEER PAGE)
========================================= */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email role averageRating totalRatings");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GET USER ERROR:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/* =========================================
   REQUEST UNBLOCK
========================================= */
router.put("/request-unblock", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isBlocked) {
      return res.status(400).json({ message: "You are not blocked" });
    }

    if (user.isPermanentlyBlocked) {
      return res.status(403).json({
        message: "You are permanently banned.",
      });
    }

    user.unblockRequested = true;
    user.unblockMessage = req.body.message || "";

    await user.save();

    res.json({ message: "Unblock request sent to admin." });
  } catch (error) {
    console.error("REQUEST UNBLOCK ERROR:", error);
    res.status(500).json({ message: "Request failed" });
  }
});

export default router;