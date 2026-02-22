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
    <div className="volunteer-dashboard-modern">

      {/* HEADER WITH RATING */}
      <div className="volunteer-header-card">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="role-text">Volunteer Account</p>
        </div>

        <div className="rating-summary-box">
          <div className="rating-stars-large">
            ⭐ {user?.averageRating?.toFixed(1) || "0.0"}
          </div>
          <div className="rating-count">
            {user?.totalRatings || 0} Reviews
          </div>
        </div>
      </div>

      {/* BLOCKED MESSAGE */}
      {user?.isBlocked && !user?.isPermanentlyBlocked && (
        <div className="blocked-box-modern">
          <h3>⚠ Account Temporarily Blocked</h3>
          <p>You missed a deadline. You can request admin to unblock you.</p>
          <button className="btn warning-btn" onClick={handleRequestUnblock}>
            Request Unblock
          </button>
        </div>
      )}

      {/* PERMANENT BAN */}
      {user?.isPermanentlyBlocked && (
        <div className="blocked-box-modern permanent">
          <h3>⛔ Permanently Banned</h3>
          <p>You have crossed the 3-strike limit. Please contact support.</p>
        </div>
      )}

      {tasks.length === 0 && (
        <p className="empty-text-modern">No accepted tasks yet.</p>
      )}

      <div className="task-grid-modern">
        {tasks.map((task) => (
          <div className="task-card-modern" key={task._id}>
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