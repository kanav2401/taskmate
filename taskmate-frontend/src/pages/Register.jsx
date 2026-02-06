import { useState } from "react";
import Navbar from "../components/Navbar";
import { registerUser } from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);
    alert(res.message);
  };

  return (
    <>
      <Navbar />
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <select name="role" onChange={handleChange}>
            <option value="client">Client</option>
            <option value="volunteer">Volunteer</option>
          </select>
          <button className="btn">Register</button>
        </form>
      </div>
    </>
  );
}
