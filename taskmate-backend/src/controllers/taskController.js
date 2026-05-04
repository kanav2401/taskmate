import Task from "../models/Task.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../utils/emailService.js";
import { onlineUsers, io } from "../server.js";
import { paginate } from "../utils/paginate.js";
import Transaction from "../models/Transaction.js";

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

export const getClientTasks = async (req, res) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const { page = 1, limit = 8 } = req.query;

    const result = await paginate(
      Task,
      { client: req.user.id },
      page,
      limit,
      "volunteer",
      { createdAt: -1 }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch client tasks" });
  }
};

export const getOpenTasks = async (req, res) => {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Only volunteers can view tasks" });
  }

  try {
    const { page = 1, limit = 8 } = req.query;

    const result = await paginate(
      Task,
      { status: "open" },
      page,
      limit,
      "client",
      { createdAt: -1 }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

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

    if (task.client?._id) {
      await Notification.create({
        user: task.client._id,
        title: "Task Accepted",
        message: `Your task "${task.title}" was accepted.`,
      });
    }

    const clientSocketId = onlineUsers.get(task.client?._id?.toString());

    if (clientSocketId) {
      io.to(clientSocketId).emit("newNotification", {
        title: "Task Accepted",
        message: `Your task "${task.title}" was accepted.`,
        isRead: false,
      });
    }

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

export const getVolunteerTasks = async (req, res) => {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const { page = 1, limit = 8 } = req.query;

    const result = await paginate(
      Task,
      { volunteer: req.user.id },
      page,
      limit,
      "client",
      { acceptedAt: -1 }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch volunteer tasks" });
  }
};

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
    console.error("GET TASK ERROR:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

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

    if (task.client?._id) {
      await Notification.create({
        user: task.client._id,
        title: "Task Submitted",
        message: `Task "${task.title}" has been submitted.`,
      });
    }

    const clientSocketId = onlineUsers.get(task.client?._id?.toString());

    if (clientSocketId) {
      io.to(clientSocketId).emit("newNotification", {
        title: "Task Submitted",
        message: `Task "${task.title}" has been submitted.`,
        isRead: false,
      });
    }

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

export const completeTask = async (req, res) => {
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
if (task.paymentStatus === "funded") {
  const volunteer = await User.findById(task.volunteer);

  volunteer.walletBalance += task.budget;
  await volunteer.save();

  task.paymentStatus = "released";
  await task.save();

  await Transaction.create({
    user: volunteer._id,
    task: task._id,
    type: "release",
    amount: task.budget,
  });
}

    const volunteerId = task.volunteer?._id || task.volunteer;
    if (volunteerId) {
      await Notification.create({
        user: volunteerId,
        title: "Task Completed",
        message: `Your task "${task.title}" has been marked as completed and payment has been processed.`,
        type: "task_completed",
      });

      const volunteerSocketId = onlineUsers.get(volunteerId.toString());
      if (volunteerSocketId) {
        io.to(volunteerSocketId).emit("newNotification", {
          title: "Task Completed",
          message: `Your task "${task.title}" has been marked as completed and payment has been processed.`,
          type: "task_completed",
          isRead: false,
          createdAt: new Date(),
        });
      }
    }

    res.json({ message: "Task marked as completed" });
  } catch (error) {
    res.status(500).json({ message: "Completion failed" });
  }
};

export const fundTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.client.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (task.paymentStatus === "funded")
      return res.status(400).json({ message: "Already funded" });

    task.paymentStatus = "funded";
    await task.save();

    await Transaction.create({
      user: req.user.id,
      task: task._id,
      type: "fund",
      amount: task.budget,
    });

    res.json({ message: "Task funded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Funding failed" });
  }
};
export const withdrawFunds = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.walletBalance <= 0)
      return res.status(400).json({ message: "No funds available" });

    const amount = user.walletBalance;

    user.walletBalance = 0;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: "withdraw",
      amount,
    });

    res.json({ message: "Withdrawal successful" });
  } catch (err) {
    res.status(500).json({ message: "Withdrawal failed" });
  }
};
export const getMyTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id })
    .populate("task", "title")
    .sort({ createdAt: -1 });

  res.json(transactions);
};

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

    await Notification.create({
      user: task.volunteer,
      title: "New Rating Received",
      message: `You have received a new rating from client.`,
      type: "rating",
    });

    const volunteerSocketId = onlineUsers.get(task.volunteer.toString());
    if (volunteerSocketId) {
      io.to(volunteerSocketId).emit("newNotification", {
        title: "New Rating Received",
        message: `You have received a new rating from client.`,
        type: "rating",
        isRead: false,
        createdAt: new Date(),
      });
    }

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Rating failed" });
  }
};
