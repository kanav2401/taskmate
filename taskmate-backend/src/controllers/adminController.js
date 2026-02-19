import User from "../models/User.js";
import Task from "../models/Task.js";
import { sendEmail } from "../utils/emailService.js"; // ✅ EMAIL IMPORT

/* =====================================
   BAN USER (TEMPORARY OR PERMANENT)
===================================== */
export const banUser = async (req, res) => {
  try {
    const { reason, days, permanent } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot ban another admin" });
    }

    if (permanent) {
      user.isBlocked = true;
      user.isPermanentlyBlocked = true;
      user.banReason = reason || "Permanent ban";

      user.banHistory.push({
        reason: user.banReason,
        permanent: true,
      });
    } else {
      const banUntil = new Date();
      banUntil.setDate(banUntil.getDate() + Number(days || 1));

      user.isBlocked = true;
      user.banUntil = banUntil;
      user.banReason = reason || "Temporary ban";

      user.banHistory.push({
        reason: user.banReason,
        bannedUntil: banUntil,
        permanent: false,
      });
    }

    await user.save();

    /* ✅ EMAIL TO USER */
    await sendEmail({
      to: user.email,
      subject: "Account Blocked — TaskMate",
      html: `
        <h3>Your TaskMate account has been blocked</h3>
        <p><b>Reason:</b> ${user.banReason}</p>
        ${
          permanent
            ? "<p>This is a permanent ban.</p>"
            : `<p>Blocked until: ${user.banUntil?.toDateString()}</p>`
        }
      `,
    });

    res.json({ message: "User banned successfully" });
  } catch (error) {
    console.error("Ban error:", error);
    res.status(500).json({ message: "Ban failed" });
  }
};

/* =====================================
   UNBLOCK USER
===================================== */
export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = false;
    user.isPermanentlyBlocked = false;
    user.banUntil = null;
    user.banReason = "";

    // 🔥 VERY IMPORTANT
    user.unblockRequested = false;
    user.unblockMessage = "";

    await user.save();

    /* ✅ EMAIL TO USER */
    await sendEmail({
      to: user.email,
      subject: "Account Unblocked — TaskMate",
      html: `
        <h3>Good news!</h3>
        <p>Your TaskMate account has been unblocked.</p>
        <p>You can now continue using the platform.</p>
      `,
    });

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Unblock error:", error);
    res.status(500).json({ message: "Unblock failed" });
  }
};

/* =====================================
   GET ALL USERS
===================================== */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/* =====================================
   GET ALL TASKS
===================================== */
export const getAllTasks = async (req, res) => {
  const tasks = await Task.find()
    .populate("client", "name email")
    .populate("volunteer", "name email")
    .sort({ createdAt: -1 });

  res.json(tasks);
};

/* =====================================
   ADVANCED ANALYTICS
===================================== */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const tasksByStatus = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const tasksPerDay = await Task.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalUsers,
      totalTasks,
      blockedUsers,
      usersByRole,
      tasksByStatus,
      tasksPerDay,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
