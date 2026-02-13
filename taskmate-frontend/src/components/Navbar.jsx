import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeToken, getUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    removeToken(); // removes token + user
    navigate("/");
    window.location.reload(); // refresh UI state
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">TaskMate</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {/* Volunteer */}
        {isLoggedIn() && user?.role === "volunteer" && (
          <>
            <Link to="/browse">Browse Tasks</Link>
            <Link to="/volunteer-dashboard">Dashboard</Link>
          </>
        )}

        {/* Client */}
        {isLoggedIn() && user?.role === "client" && (
          <Link to="/client-dashboard">Dashboard</Link>
        )}

        {/* Admin */}
        {isLoggedIn() && user?.role === "admin" && (
          <Link to="/admin-dashboard" className="admin-link">
            🛠 Admin
          </Link>
        )}

        {/* Auth Buttons */}
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
