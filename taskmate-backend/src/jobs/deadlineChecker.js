import Task from "../models/Task.js";
import User from "../models/User.js";

const deadlineChecker = async () => {
  setInterval(async () => {
    try {
      const now = new Date();

      const expiredTasks = await Task.find({
        status: "accepted",
        deadline: { $lt: now },
      });

      for (const task of expiredTasks) {
        // Mark task overdue
        task.status = "overdue";
        await task.save();

        // Get volunteer
        const volunteer = await User.findById(task.volunteer);

        if (!volunteer) continue;

        // Increase strike count
        volunteer.blockCount += 1;
        volunteer.isBlocked = true;

        // Permanent ban after 3 strikes
        if (volunteer.blockCount >= 3) {
          volunteer.isPermanentlyBlocked = true;
        }

        await volunteer.save();

        console.log(
          `Volunteer ${volunteer.email} blocked. Strike: ${volunteer.blockCount}`
        );
      }
    } catch (error) {
      console.log("Deadline checker error:", error.message);
    }
  }, 60000); // runs every 1 minute
};

export default deadlineChecker;
