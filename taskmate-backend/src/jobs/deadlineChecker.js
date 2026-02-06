import cron from "node-cron";
import Task from "../models/Task.js";
import User from "../models/User.js";

const deadlineChecker = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    const overdueTasks = await Task.find({
      status: "accepted",
      deadline: { $lt: now },
    });

    for (const task of overdueTasks) {
      task.status = "overdue";
      await task.save();

      if (task.volunteer) {
        await User.findByIdAndUpdate(task.volunteer, {
          isBlocked: true,
        });
      }
    }

    if (overdueTasks.length > 0) {
      console.log(`⛔ ${overdueTasks.length} overdue task(s) processed`);
    }
  });
};

export default deadlineChecker;
