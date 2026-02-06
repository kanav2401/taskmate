import { useState } from "react";
import Navbar from "../components/Navbar";
import { loginUser } from "../api/api";
import { setToken } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      if (res.token) {
        // ✅ Store JWT in localStorage
        setToken(res.token);

        alert("Login successful");

        // Redirect to home (protected route)
        window.location.href = "/";
      } else {
        alert(res.message || "Login failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
