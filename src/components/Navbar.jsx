import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">TaskMate</h1>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tasks">Browse Tasks</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li>
          <Link to="/register" className="btn">Register</Link>
        </li>
      </ul>
    </nav>
  );
}
