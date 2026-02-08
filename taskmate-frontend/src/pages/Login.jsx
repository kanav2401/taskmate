import { useState } from "react";
import { loginUser } from "../api/api";
import { setToken, setUser } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await loginUser(form);

    if (res.token) {
      setToken(res.token);
      setUser(res.user);

      if (res.user.role === "client") {
        window.location.href = "/client-dashboard";
      } else {
        window.location.href = "/volunteer-dashboard";
      }
    } else {
      alert(res.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
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
  );
}
