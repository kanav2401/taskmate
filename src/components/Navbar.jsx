import { Link } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        TaskMate
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tasks">Browse Tasks</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register" className="btn-primary">Register</Link></li>
      </ul>
    </nav>
  );
}
