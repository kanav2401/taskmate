import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTaskById } from "../api/api";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    const data = await getTaskById(id);

    if (data.message) {
      setError(data.message);
    } else {
      setTask(data);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!task) return <p>Loading task...</p>;

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
    </div>
  );
}
