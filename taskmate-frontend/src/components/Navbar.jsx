import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUser, getUser } from "../utils/auth";
import { logoutUser } from "../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    await logoutUser();   // clears cookies from backend
    removeUser();         // clears localStorage user
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">TaskMate</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {isLoggedIn() && user?.role === "volunteer" && (
          <>
            <Link to="/browse">Browse Tasks</Link>
            <Link to="/volunteer-dashboard">Dashboard</Link>
          </>
        )}

        {isLoggedIn() && user?.role === "client" && (
          <Link to="/client-dashboard">Dashboard</Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin-dashboard" className="admin-link">
            🛠 Admin
          </Link>
        )}

        {!isLoggedIn() ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-nav">
              Get Started
            </Link>
          </>
        ) : (
          <button className="btn-nav" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
