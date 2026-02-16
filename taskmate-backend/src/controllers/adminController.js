import User from "../models/User.js";
import Task from "../models/Task.js";

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

    res.json({ message: "User banned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Ban failed" });
  }
};

/* =====================================
   UNBLOCK USER
===================================== */
export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    user.isPermanentlyBlocked = false;
    user.banUntil = null;
    user.banReason = "";

    await user.save();

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
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
