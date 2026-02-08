import { useState } from "react";
import { postTask } from "../api/api";

export default function PostTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await postTask(form);
    alert(res.message || "Task posted");
  };

  return (
    <div className="page">
      <h2>Post a Task</h2>

      <form className="card" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Task Title"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task Description"
          onChange={handleChange}
          required
        />

        <input
          name="budget"
          type="number"
          placeholder="Budget"
          onChange={handleChange}
          required
        />

        <input
          name="deadline"
          type="date"
          onChange={handleChange}
          required
        />

        <button type="submit">Post Task</button>
      </form>
    </div>
  );
}
