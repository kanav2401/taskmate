import { useEffect, useState } from "react";
import { getClientTasks } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getClientTasks();
    setTasks(data);
  };

  return (
    <div className="dashboard">
      <h1>Client Dashboard</h1>

      <button className="btn" onClick={() => navigate("/post-task")}>
        + Post New Task
      </button>

      <div className="task-list">
        {tasks.length === 0 && <p>No tasks posted yet.</p>}

        {tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <h3>
  <a href={`/task/${task._id}`}>{task.title}</a>
</h3>

            <p>{task.description}</p>
            <p><strong>Budget:</strong> ₹{task.budget}</p>
            <p><strong>Status:</strong> {task.status}</p>

            {task.volunteer && (
              <p className="accepted">
                ✅ Accepted by {task.volunteer.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
