import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { protectedRequest } from "../api/api";

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await protectedRequest("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const acceptTask = async (id) => {
    const res = await protectedRequest(`/tasks/${id}/accept`, {
      method: "PUT",
    });

    alert(res.message);
    loadTasks();
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2>Browse Tasks</h2>

        <div className="task-list">
          {tasks.length === 0 && <p>No open tasks available</p>}

          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Budget: ₹{task.budget}</p>
              <p>Status: {task.status}</p>
              <p>
                Deadline: {new Date(task.deadline).toDateString()}
              </p>

              <button className="btn" onClick={() => acceptTask(task._id)}>
                Accept Task
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
