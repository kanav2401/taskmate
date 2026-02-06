import { useState } from "react";
import Navbar from "../components/Navbar";
import { protectedRequest } from "../api/api";

export default function PostTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await protectedRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(form),
    });

    alert(res.message || "Task created");
  };

  return (
    <>
      <Navbar />

      <div className="auth-box">
        <h2>Post a Task</h2>

        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Task Title" onChange={handleChange} />
          <textarea
            name="description"
            placeholder="Task Description"
            onChange={handleChange}
          />
          <input name="budget" type="number" placeholder="Budget" onChange={handleChange} />
          <input name="deadline" type="date" onChange={handleChange} />

          <button className="btn">Post Task</button>
        </form>
      </div>
    </>
  );
}
