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

        task.status = "overdue";
        await task.save();

        const volunteer = await User.findById(task.volunteer);

        if (!volunteer) continue;

        volunteer.blockCount += 1;
        volunteer.isBlocked = true;

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
  }, 60000); 
};

export default deadlineChecker;
