import { useEffect, useState } from "react";
import { getClientTasks, completeTask } from "../api/api";
import { useNavigate } from "react-router-dom";
import { rateTask } from "../api/api";


export default function ClientDashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getClientTasks();
    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setTasks([]);
    }
  };

  const handleComplete = async (id) => {
    await completeTask(id);
    loadTasks();
  };

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
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
            <p><strong>Budget:</strong> ₹{task.budget}</p>

            {getStatusBadge(task.status)}

            {task.status === "submitted" && (
              <button
                className="btn complete-btn"
                onClick={() => handleComplete(task._id)}
              >
                Mark as Completed
              </button>
            )}
  
            {task.volunteer && (
              <p className="accepted">
                Accepted by {task.volunteer.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
