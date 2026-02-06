import Task from "../models/Task.js";
import User from "../models/User.js";

// CREATE TASK (CLIENT)
export const createTask = async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;

    const task = await Task.create({
      title,
      description,
      budget,
      deadline,
      client: req.user.id,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Task creation failed" });
  }
};

// GET OPEN TASKS
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "open" }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// ACCEPT TASK (VOLUNTEER)
export const acceptTask = async (req, res) => {
  try {
    const volunteer = await User.findById(req.user.id);

    if (volunteer.isBlocked) {
      return res
        .status(403)
        .json({ message: "You are blocked due to missed deadlines" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "open") {
      return res.status(400).json({ message: "Task already accepted" });
    }

    task.status = "accepted";
    task.volunteer = req.user.id;
    task.acceptedAt = new Date();

    await task.save();

    res.json({ message: "Task accepted successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept task" });
  }
};
