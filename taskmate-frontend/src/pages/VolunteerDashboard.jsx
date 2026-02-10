import { useEffect, useState } from "react";
import { getVolunteerTasks } from "../api/api";
import { getUser } from "../utils/auth";

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const user = getUser();

  useEffect(() => {
    if (user?.role !== "volunteer") {
      setError("Access denied. You are not a volunteer.");
      return;
    }
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getVolunteerTasks();

    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setError(data.message || "Failed to load tasks");
    }
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="dashboard">
      <h1>Volunteer Dashboard</h1>

      {tasks.length === 0 && (
        <p>You have not accepted any tasks yet.</p>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <h3>
              <a href={`/task/${task._id}`}>{task.title}</a>
            </h3>

            <p>{task.description}</p>

            <p><strong>Client:</strong> {task.client?.name}</p>
            <p><strong>Budget:</strong> ₹{task.budget}</p>

            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toDateString()}
            </p>

            <p><strong>Status:</strong> {task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
