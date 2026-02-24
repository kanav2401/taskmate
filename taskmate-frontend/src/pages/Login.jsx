import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";
import { setUser } from "../utils/auth";
import "./Auth.css";

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message,setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const res = await loginUser(form);

    if (res.user) {

      // ✅ Save user (cookie auth system)
      setUser(res.user);

      // Redirect based on role
      if (res.user.role === "admin") {
        navigate("/admin");
      } 
      else if (res.user.role === "client") {
        navigate("/client-dashboard");
      } 
      else {
        navigate("/volunteer-dashboard");
      }

      window.location.reload();

    } else {

      setMessage(res.message || "Login failed");

    }
  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <h2 className="auth-title">
          🔐 Login to TaskMate
        </h2>

        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="auth-btn"
          >
            Login
          </button>

        </form>

        <p className="auth-switch">

          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>

  );
}