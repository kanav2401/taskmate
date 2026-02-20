import Task from "../models/Task.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailService.js";
import { onlineUsers, io } from "../server.js";

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
    console.error("CREATE TASK ERROR:", error);
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
  if (req.user.isBlocked) {
    return res.status(403).json({
      message: "Your account is blocked. You cannot accept tasks.",
    });
  }

  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Only volunteers can accept tasks" });
  }

  try {
    const task = await Task.findById(req.params.id).populate("client");

    if (!task || task.status !== "open") {
      return res.status(400).json({ message: "Task not available" });
    }

    task.status = "accepted";
    task.volunteer = req.user.id;
    task.acceptedAt = new Date();

    await task.save();

    /* 🔔 REALTIME NOTIFICATION TO CLIENT */
    const clientSocketId = onlineUsers.get(
      task.client?._id?.toString()
    );

    if (clientSocketId) {
      io.to(clientSocketId).emit("newNotification", {
        title: "Task Accepted",
        message: `Your task "${task.title}" was accepted.`,
        isRead: false,
      });
    }

    /* 📧 EMAIL TO CLIENT */
    if (task.client?.email) {
      await sendEmail(
        task.client.email,
        "Task Accepted — TaskMate",
        `<p>Your task "<b>${task.title}</b>" has been accepted by a volunteer.</p>`
      );
    }

    res.json({ message: "Task accepted successfully" });
  } catch (error) {
    console.error("ACCEPT TASK ERROR:", error);
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

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("client", "name email")
      .populate("volunteer", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userId = req.user.id;
    const role = req.user.role;

    const isClient = task.client.id === userId;
    const isAssignedVolunteer =
      task.volunteer && task.volunteer.id === userId;
    const isAdmin = role === "admin";
    const isOpenTask = task.status === "open";

    if (
      !isClient &&
      !isAssignedVolunteer &&
      !isAdmin &&
      !(role === "volunteer" && isOpenTask)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

/* ================= SUBMISSION FLOW ================= */

// SUBMIT TASK
export const submitTask = async (req, res) => {
  if (req.user.isBlocked) {
    return res.status(403).json({
      message: "Your account is blocked. You cannot submit tasks.",
    });
  }

  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Only volunteers can submit tasks" });
  }

  try {
    const task = await Task.findById(req.params.id).populate("client");

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

    /* 🔔 REALTIME NOTIFICATION TO CLIENT */
    const clientSocketId = onlineUsers.get(
      task.client?._id?.toString()
    );

    if (clientSocketId) {
      io.to(clientSocketId).emit("newNotification", {
        title: "Task Submitted",
        message: `Task "${task.title}" has been submitted.`,
        isRead: false,
      });
    }

    /* 📧 EMAIL */
    if (task.client?.email) {
      await sendEmail(
        task.client.email,
        "Task Submitted — TaskMate",
        `<p>Your task "<b>${task.title}</b>" has been submitted.</p>`
      );
    }

    res.json({ message: "Task submitted successfully" });
  } catch (error) {
    console.error("SUBMIT TASK ERROR:", error);
    res.status(500).json({ message: "Submission failed" });
  }
};

// COMPLETE TASK
export const completeTask = async (req, res) => {
  if (req.user.isBlocked) {
    return res.status(403).json({
      message: "Your account is blocked. You cannot complete tasks.",
    });
  }

  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Only clients can complete tasks" });
  }

  try {
    const task = await Task.findById(req.params.id).populate("volunteer");

    if (!task || task.status !== "submitted") {
      return res.status(400).json({ message: "Task not ready for completion" });
    }

    if (task.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    task.status = "completed";
    await task.save();

    /* 🔔 REALTIME NOTIFICATION TO VOLUNTEER */
    const volunteerSocketId = onlineUsers.get(
      task.volunteer?._id?.toString()
    );

    if (volunteerSocketId) {
      io.to(volunteerSocketId).emit("newNotification", {
        title: "Task Completed",
        message: `Task "${task.title}" marked completed.`,
        isRead: false,
      });
    }

    /* 📧 EMAIL */
    if (task.volunteer?.email) {
      await sendEmail(
        task.volunteer.email,
        "Task Completed — TaskMate",
        `<p>Great news! Task "<b>${task.title}</b>" has been marked completed.</p>`
      );
    }

    res.json({ message: "Task marked as completed" });
  } catch (error) {
    console.error("COMPLETE TASK ERROR:", error);
    res.status(500).json({ message: "Completion failed" });
  }
};

/* ================= ADMIN / MANUAL ================= */

// UNBLOCK USER
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

// VOLUNTEER REQUEST UNBLOCK
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

    await sendEmail(
      process.env.ADMIN_EMAIL,
      "Unblock Request — TaskMate",
      `<p>User <b>${user.email}</b> requested to be unblocked.</p>`
    );

    res.json({ message: "Unblock request sent to admin" });
  } catch (error) {
    console.error("REQUEST UNBLOCK ERROR:", error);
    res.status(500).json({ message: "Request failed" });
  }
};

// RATE TASK
export const rateTask = async (req, res) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Only clients can rate" });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.status !== "completed") {
      return res.status(400).json({ message: "Task not completed yet" });
    }

    if (task.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    if (task.rating) {
      return res.status(400).json({ message: "Already rated" });
    }

    const { rating, review } = req.body;

    task.rating = rating;
    task.review = review || "";
    await task.save();

    const volunteer = await User.findById(task.volunteer);

    const totalScore =
      volunteer.averageRating * volunteer.totalRatings + rating;

    volunteer.totalRatings += 1;
    volunteer.averageRating =
      totalScore / volunteer.totalRatings;

    await volunteer.save();

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Rating failed" });
  }
};