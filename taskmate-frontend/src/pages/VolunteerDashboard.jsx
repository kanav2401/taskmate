import { useEffect, useState } from "react";
import { getVolunteerTasks } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getVolunteerTasks();
    setTasks(data || []);
  };

  return (
    <div className="dashboard">
      <h1>Volunteer Dashboard</h1>

      {tasks.length === 0 && (
        <p>You have not accepted any tasks yet.</p>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              <strong>Client:</strong> {task.client?.name}
            </p>

            <p>
              <strong>Budget:</strong> ₹{task.budget}
            </p>

            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toDateString()}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${task.status}`}>
                {task.status.toUpperCase()}
              </span>
            </p>

            <p>
              📧 Contact Client: <strong>{task.client?.email}</strong>
            </p>

            <button
              className="btn secondary"
              onClick={() => navigate(`/task/${task._id}`)}
            >
              View Task Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
