import User from "../models/User.js";
import Task from "../models/Task.js";

/* =========================
   GET ALL USERS
========================= */

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/* =========================
   UNBLOCK USER
========================= */

export const unblockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.blockCount >= 3) {
    return res
      .status(400)
      .json({ message: "Cannot unblock permanently banned user" });
  }

  user.isBlocked = false;
  await user.save();

  res.json({ message: "User unblocked successfully" });
};

/* =========================
   GET ALL TASKS
========================= */

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find()
    .populate("client", "name email")
    .populate("volunteer", "name email")
    .sort({ createdAt: -1 });

  res.json(tasks);
};

/* =========================
   DASHBOARD STATS
========================= */

export const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalTasks = await Task.countDocuments();
  const blockedUsers = await User.countDocuments({ isBlocked: true });

  res.json({
    totalUsers,
    totalTasks,
    blockedUsers,
  });
};
