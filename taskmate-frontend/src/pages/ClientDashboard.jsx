import { useEffect, useState } from "react";
import {
  getClientTasks,
  completeTask,
  rateTask,
} from "../api/api";
import StarRating from "../components/StarRating";

export default function ClientDashboard() {
  const [tasks, setTasks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getClientTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  /* ================= COMPLETE TASK ================= */
  const handleComplete = async (taskId) => {
    if (!window.confirm("Mark this task as completed?")) return;

    try {
      const res = await completeTask(taskId);
      if (res?.message) {
        loadTasks();
      }
    } catch (err) {
      console.error("Complete failed");
    }
  };

  /* ================= SUBMIT RATING ================= */
  const handleRatingSubmit = async (taskId) => {
    const rating = ratings[taskId];
    const review = reviews[taskId] || "";

    if (!rating) {
      alert("Please select rating");
      return;
    }

    try {
      const res = await rateTask(taskId, rating, review);
      if (res?.message) {
        alert("Rating submitted successfully!");
        loadTasks();
      }
    } catch (err) {
      console.error("Rating failed");
    }
  };

  if (loading) return <p className="loading-text">Loading tasks...</p>;

  return (
    <div className="dashboard-container-modern">
      <h2 className="dashboard-title-modern">
        📋 Client Dashboard
      </h2>

      {tasks.length === 0 ? (
        <p className="empty-text-modern">No tasks yet</p>
      ) : (
        <div className="task-grid-modern">
          {tasks.map((task) => (
            <div key={task._id} className="task-card-premium">

              {/* HEADER */}
              <div className="task-header-modern">
                <h3>{task.title}</h3>
                <span className={`status-badge-modern status-${task.status}`}>
                  {task.status}
                </span>
              </div>

              <p className="task-desc-modern">
                {task.description}
              </p>

              {/* VOLUNTEER INFO */}
              {task.volunteer && (
                <div className="volunteer-info-box">
                  <div>
                    👤 <strong>{task.volunteer.name}</strong>
                  </div>

                  <div className="rating-badge">
                    ⭐ {task.volunteer.averageRating?.toFixed(1) || "0.0"} 
                    <span className="rating-count">
                      ({task.volunteer.totalRatings || 0})
                    </span>
                  </div>
                </div>
              )}

              {/* COMPLETE BUTTON */}
              {task.status === "submitted" && (
                <button
                  className="btn-primary modern-btn"
                  onClick={() => handleComplete(task._id)}
                >
                  ✅ Mark as Complete
                </button>
              )}

              {/* RATING UI */}
              {task.status === "completed" && !task.rating && (
                <div className="rating-box-modern">
                  <h4>⭐ Rate Volunteer</h4>

                  <StarRating
                    value={ratings[task._id] || 0}
                    onChange={(val) =>
                      setRatings((prev) => ({
                        ...prev,
                        [task._id]: val,
                      }))
                    }
                  />

                  <textarea
                    placeholder="Write review (optional)"
                    value={reviews[task._id] || ""}
                    onChange={(e) =>
                      setReviews((prev) => ({
                        ...prev,
                        [task._id]: e.target.value,
                      }))
                    }
                    className="review-textarea-modern"
                  />

                  <button
                    className="btn-primary modern-btn"
                    onClick={() => handleRatingSubmit(task._id)}
                  >
                    Submit Rating
                  </button>
                </div>
              )}

              {/* ALREADY RATED */}
              {task.rating && (
                <div className="already-rated-box-modern">
                  ⭐ You rated this volunteer {task.rating}/5
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}