import { useState } from "react";
import { registerUser } from "../api/api";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const [message,setMessage] = useState("");

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  const handleSubmit = async (e) => {

    e.preventDefault();

    const res = await registerUser(form);

    if(res.message){
      setMessage(res.message);
    }else{
      setMessage("Registration failed");
    }

  };

  return (

      <div className="auth-page">

        <div className="auth-card">

          <h2 className="auth-title">
            📝 Create TaskMate Account
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

            <label>Name</label>

            <input
              name="name"
              placeholder="Enter Full Name"
              onChange={handleChange}
              required
            />

            <label>Email</label>

            <input
              name="email"
              type="email"
              placeholder="Enter Email"
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <input
              name="password"
              type="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />

            <label>Account Type</label>

            <select
              name="role"
              onChange={handleChange}
            >
              <option value="client">
                Client
              </option>

              <option value="volunteer">
                Volunteer
              </option>
            </select>

            <button className="auth-btn">
              Register
            </button>

          </form>

          <p className="auth-switch">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </div>

  );
}