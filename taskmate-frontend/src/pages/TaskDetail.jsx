import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTaskById } from "../api/api";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    async function fetchTask() {
      const data = await getTaskById(id);
      setTask(data);
    }
    fetchTask();
  }, [id]);

  if (!task) return <p>Loading task details...</p>;

  return (
    <div className="page">
      <h2>{task.title}</h2>
      <p>{task.description}</p>

      <p><strong>Budget:</strong> ₹{task.budget}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Deadline:</strong> {new Date(task.deadline).toDateString()}</p>

      {task.status === "accepted" && (
        <div className="contact-box">
          <h3>📞 Contact Details</h3>

          <p>
            <strong>Client:</strong> {task.client.name} <br />
            📧 {task.client.email}
          </p>

          <p>
            <strong>Volunteer:</strong> {task.volunteer.name} <br />
            📧 {task.volunteer.email}
          </p>
        </div>
      )}
    </div>
  );
}
