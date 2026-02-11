import Task from "../models/Task.js";
import User from "../models/User.js";

/* ================= CLIENT ================= */

// CREATE TASK
export const createTask = async (req, res) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Only clients can post tasks" });
  }

  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      deadline: req.body.deadline,
      client: req.user.id,
      status: "open",
    });

    res.json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Task creation failed" });
  }
};

// CLIENT DASHBOARD TASKS
export const getClientTasks = async (req, res) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const tasks = await Task.find({ client: req.user.id })
      .populate("volunteer", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch client tasks" });
  }
};

/* ================= VOLUNTEER ================= */

// VIEW OPEN TASKS
export const getOpenTasks = async (req, res) => {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Only volunteers can view tasks" });
  }

  try {
    const tasks = await Task.find({ status: "open" })
      .populate("client", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// ACCEPT TASK
export const acceptTask = async (req, res) => {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Only volunteers can accept tasks" });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.status !== "open") {
      return res.status(400).json({ message: "Task not available" });
    }

    task.status = "accepted";
    task.volunteer = req.user.id;
    task.acceptedAt = new Date();

    await task.save();

    res.json({ message: "Task accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept task" });
  }
};

// VOLUNTEER DASHBOARD TASKS
export const getVolunteerTasks = async (req, res) => {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const tasks = await Task.find({ volunteer: req.user.id })
      .populate("client", "name email")
      .sort({ acceptedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch volunteer tasks" });
  }
};

/* ================= TASK DETAIL ================= */

// SINGLE TASK PAGE (CLIENT + VOLUNTEER ONLY)
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("client", "name email")
      .populate("volunteer", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isClient = task.client._id.toString() === req.user.id;
    const isVolunteer =
      task.volunteer && task.volunteer._id.toString() === req.user.id;

    if (!isClient && !isVolunteer) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

/* ================= SUBMISSION FLOW ================= */

// VOLUNTEER: SUBMIT TASK
export const submitTask = async (req, res) => {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Only volunteers can submit tasks" });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.status !== "accepted") {
      return res.status(400).json({ message: "Task not valid for submission" });
    }

    if (task.volunteer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    task.status = "submitted";
    task.submittedAt = new Date();
    task.submissionNote = req.body.note || "";

    await task.save();

    res.json({ message: "Task submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Submission failed" });
  }
};

// CLIENT: MARK TASK COMPLETED
export const completeTask = async (req, res) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Only clients can complete tasks" });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.status !== "submitted") {
      return res.status(400).json({ message: "Task not ready for completion" });
    }

    if (task.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    task.status = "completed";
    await task.save();

    // ✅ AUTO UNBLOCK VOLUNTEER
    if (task.volunteer) {
      await User.findByIdAndUpdate(task.volunteer, {
        isBlocked: false,
      });
    }

    res.json({ message: "Task marked as completed" });
  } catch (error) {
    res.status(500).json({ message: "Completion failed" });
  }
};

/* ================= ADMIN / MANUAL ================= */

// MANUAL UNBLOCK USER
export const unblockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isBlocked: false,
    });

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unblock failed" });
  }
};
/* VOLUNTEER REQUEST UNBLOCK */
export const requestUnblock = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.isBlocked) {
      return res.status(400).json({ message: "You are not blocked" });
    }

    if (user.isPermanentlyBlocked) {
      return res.status(403).json({
        message: "You are permanently banned. Contact support.",
      });
    }

    user.unblockRequested = true;
    await user.save();

    res.json({ message: "Unblock request sent to admin" });
  } catch (error) {
    res.status(500).json({ message: "Request failed" });
  }
};
/* ADMIN UNBLOCK USER */
export const adminUnblockUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isPermanentlyBlocked) {
      return res.status(403).json({
        message: "User permanently banned. Cannot unblock.",
      });
    }

    if (user.blockCount >= 3) {
      user.isPermanentlyBlocked = true;
      await user.save();

      return res.status(403).json({
        message: "User permanently banned (3 strikes)",
      });
    }

    user.isBlocked = false;
    user.unblockRequested = false;

    await user.save();

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unblock failed" });
  }
};
