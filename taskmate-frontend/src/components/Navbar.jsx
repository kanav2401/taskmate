import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUser, getUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    removeUser();
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

        {/* VOLUNTEER LINKS */}
        {isLoggedIn() && user?.role === "volunteer" && (
          <>
            <Link to="/browse">Browse Tasks</Link>
            <Link to="/volunteer-dashboard">Dashboard</Link>
          </>
        )}

        {/* CLIENT LINKS */}
        {isLoggedIn() && user?.role === "client" && (
          <Link to="/client-dashboard">Dashboard</Link>
        )}

        {/* ADMIN LINK */}
        {isLoggedIn() && user?.role === "admin" && (
          <Link to="/admin" className="admin-link">
            🛠 Admin
          </Link>
        )}

        {/* LOGIN / LOGOUT */}
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
