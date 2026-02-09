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
    setTasks(data || []);
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
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              <strong>Budget:</strong> ₹{task.budget}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${task.status}`}>
                {task.status.toUpperCase()}
              </span>
            </p>

            {task.volunteer ? (
              <>
                <p className="accepted">
                  ✅ Accepted by <strong>{task.volunteer.name}</strong>
                </p>
                <p>
                  📧 Contact: <strong>{task.volunteer.email}</strong>
                </p>

                <button
                  className="btn secondary"
                  onClick={() => navigate(`/task/${task._id}`)}
                >
                  View Task Details
                </button>
              </>
            ) : (
              <p className="pending">⏳ Waiting for volunteer</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
