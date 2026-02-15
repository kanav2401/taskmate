import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getTaskById } from "../api/api";
import Chat from "../components/Chat";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    loadTask();
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/me",
        { withCredentials: true }
      );
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const loadTask = async () => {
    try {
      const data = await getTaskById(id);
      if (data?.message) setError(data.message);
      else setTask(data);
    } catch {
      setError("Failed to load task");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!task || !user) return <p>Loading...</p>;

  const isClient = task.client?.id === user.id;
  const isVolunteer = task.volunteer?.id === user.id;
  const isAdmin = user.role === "admin";

  const isTaskActive = ["accepted", "submitted", "completed"].includes(
    task.status
  );

  const canChat =
    task.volunteer && isTaskActive && (isClient || isVolunteer || isAdmin);

  return (
    <div className="task-detail">
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p><strong>Budget:</strong> ₹{task.budget}</p>
      <p><strong>Status:</strong> {task.status}</p>

      <hr />

      <h3>Client Info</h3>
      <p><strong>Name:</strong> {task.client?.name}</p>
      <p><strong>Email:</strong> {task.client?.email}</p>

      {task.volunteer && (
        <>
          <hr />
          <h3>Volunteer Info</h3>
          <p><strong>Name:</strong> {task.volunteer?.name}</p>
          <p><strong>Email:</strong> {task.volunteer?.email}</p>
        </>
      )}

      {canChat && (
        <>
          <hr />

          {!showChat ? (
            <button
              className="btn"
              onClick={() => setShowChat(true)}
            >
              💬 Open Chat
            </button>
          ) : (
            <>
              <button
                className="btn"
                style={{ marginBottom: "15px", background: "#ef4444" }}
                onClick={() => setShowChat(false)}
              >
                Close Chat
              </button>

              <Chat taskId={task._id} user={user} />
            </>
          )}
        </>
      )}
    </div>
  );
}
