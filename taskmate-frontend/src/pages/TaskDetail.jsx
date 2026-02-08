import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTaskById } from "../api/api";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      const res = await getTaskById(id);
      if (res.message) {
        setError(res.message);
      } else {
        setTask(res);
      }
    };

    fetchTask();
  }, [id]);

  if (error) {
    return <p style={{ padding: "40px" }}>{error}</p>;
  }

  if (!task) {
    return <p style={{ padding: "40px" }}>Loading task details...</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>{task.title}</h2>
      <p>{task.description}</p>

      <p><strong>Budget:</strong> ₹{task.budget}</p>
      <p><strong>Deadline:</strong> {new Date(task.deadline).toDateString()}</p>
      <p><strong>Status:</strong> {task.status}</p>

      <hr />

      <h3>Client</h3>
      <p>{task.client.name}</p>
      <p>{task.client.email}</p>

      {task.volunteer && (
        <>
          <hr />
          <h3>Volunteer</h3>
          <p>{task.volunteer.name}</p>
          <p>{task.volunteer.email}</p>
        </>
      )}
    </div>
  );
}
