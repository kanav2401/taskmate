import { useEffect, useState } from "react";
import { getTasks, acceptTask } from "../api/api";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "volunteer") {
      setError("Only volunteers can browse tasks.");
      return;
    }

    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getTasks();

    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setError(data.message || "Failed to load tasks");
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
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p><strong>Client:</strong> {task.client?.name}</p>
            <p><strong>Budget:</strong> ₹{task.budget}</p>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toDateString()}
            </p>

            <button
              className="btn"
              onClick={() => handleAccept(task._id)}
            >
              Accept Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
