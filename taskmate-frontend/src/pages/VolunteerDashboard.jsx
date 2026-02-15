import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getVolunteerTasks,
  submitTask,
  requestUnblock,
} from "../api/api";

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadTasks();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const loadTasks = async () => {
    const data = await getVolunteerTasks();
    if (Array.isArray(data)) setTasks(data);
    else setTasks([]);
  };

  const handleSubmit = async (id) => {
    if (user?.isBlocked) {
      alert("You are currently blocked and cannot submit tasks.");
      return;
    }

    const note = prompt("Add submission note (optional):");
    await submitTask(id, note);
    loadTasks();
  };

  const handleRequestUnblock = async () => {
    const res = await requestUnblock();
    alert(res.message);
  };

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  return (
    <div className="dashboard">
      <h1>Volunteer Dashboard</h1>

      {/* BLOCKED MESSAGE */}
      {user?.isBlocked && !user?.isPermanentlyBlocked && (
        <div className="blocked-box">
          <h3>⚠ Account Temporarily Blocked</h3>
          <p>You missed a deadline. You can request admin to unblock you.</p>
          <button className="btn warning-btn" onClick={handleRequestUnblock}>
            Request Unblock
          </button>
        </div>
      )}

      {/* PERMANENT BAN */}
      {user?.isPermanentlyBlocked && (
        <div className="blocked-box permanent">
          <h3>⛔ Permanently Banned</h3>
          <p>You have crossed the 3-strike limit. Please contact support.</p>
        </div>
      )}

      {tasks.length === 0 && <p>No accepted tasks yet.</p>}

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

            {getStatusBadge(task.status)}

            {/* 🔥 NEW: VIEW DETAILS BUTTON */}
            <Link
              to={`/task/${task._id}`}
              className="btn"
              style={{ marginTop: "10px", display: "inline-block" }}
            >
              View Details
            </Link>

            {task.status === "accepted" && !user?.isBlocked && (
              <button
                className="btn submit-btn"
                onClick={() => handleSubmit(task._id)}
              >
                Submit Task
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
