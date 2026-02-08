import Task from "../models/Task.js";

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

    // Only related users can view
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
