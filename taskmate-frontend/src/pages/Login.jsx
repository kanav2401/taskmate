import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { setUser } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
      // ✅ Save only user (NO TOKEN)
      setUser(res.user);

      // Redirect based on role
      if (res.user.role === "admin") {
        navigate("/admin");
      } else if (res.user.role === "client") {
        navigate("/client-dashboard");
      } else {
        navigate("/volunteer-dashboard");
      }

      window.location.reload();
    } else {
      alert(res.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="auth-form">
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
  );
}
