import { useEffect, useState } from "react";
import { getOpenTasks, acceptTask } from "../api/api";
import { getUser } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "volunteer") {
      setError("Only volunteers can browse tasks.");
      return;
    }

    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getOpenTasks();

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setError(data.message || "Failed to load tasks");
      }
    } catch (err) {
      setError("Server error while fetching tasks.");
    }
  };

  const handleAccept = async (id) => {
    const res = await acceptTask(id);

    if (res.message) {
      alert(res.message);
      loadTasks();
    }
  };

  return (
    <div className="dashboard">
      <h1>Browse Available Tasks</h1>

      {error && <p className="error">{error}</p>}

      {tasks.length === 0 && !error && (
        <p>No open tasks available right now.</p>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task._id}>
            
            {/* ✅ CLICKABLE TITLE → TASK DETAIL PAGE */}
            <h3>
              <Link to={`/task/${task._id}`} className="task-link">
                {task.title}
              </Link>
            </h3>

            <p>{task.description}</p>
            <p><strong>Client:</strong> {task.client?.name}</p>
            <p><strong>Budget:</strong> ₹{task.budget}</p>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toDateString()}
            </p>

            <div className="task-actions">
              <button
                className="btn"
                onClick={() => handleAccept(task._id)}
              >
                Accept Task
              </button>

              {/* Optional View Button */}
              <button
                className="btn secondary"
                onClick={() => navigate(`/task/${task._id}`)}
              >
                View Details
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
