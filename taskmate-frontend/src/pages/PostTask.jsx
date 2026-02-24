import { useState } from "react";
import { postTask } from "../api/api";
import "./PostTask.css";

export default function PostTask() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await postTask(form);

      setMessage(res.message || "Task posted successfully");

      setForm({
        title: "",
        description: "",
        budget: "",
        deadline: "",
      });

    } catch (error) {
      setMessage("Failed to post task");
    }
  };

  return (

    <div className="post-task-page">

      <div className="post-task-container">

        <h2 className="post-task-title">
          📌 Post a New Task
        </h2>

        {message && (
          <div className="post-message">
            {message}
          </div>
        )}

        <form
          className="post-task-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>Task Title</label>

            <input
              name="title"
              placeholder="Enter task title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Describe your task"
              value={form.description}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>Budget (₹)</label>

              <input
                name="budget"
                type="number"
                placeholder="Enter budget"
                value={form.budget}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>Deadline</label>

              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          <button
            type="submit"
            className="post-task-btn"
          >
            🚀 Post Task
          </button>

        </form>

      </div>

    </div>

  );
}