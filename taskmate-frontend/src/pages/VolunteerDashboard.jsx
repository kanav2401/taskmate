import { useEffect, useState } from "react";
import { getVolunteerTasks } from "../api/api";

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getVolunteerTasks();
    setTasks(data);
  };

  return (
    <div className="dashboard">
      <h1>Volunteer Dashboard</h1>

      {tasks.length === 0 && <p>You have not accepted any tasks yet.</p>}

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

            <p>
              <strong>Status:</strong> {task.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
