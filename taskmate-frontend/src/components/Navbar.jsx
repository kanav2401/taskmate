import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeToken, getUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    removeToken(); // ✅ correct function
    navigate("/");
    window.location.reload(); // optional but keeps UI fresh
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">TaskMate</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {isLoggedIn() && user?.role === "volunteer" && (
          <Link to="/browse">Browse Tasks</Link>
        )}

        {isLoggedIn() && user?.role === "client" && (
          <Link to="/client-dashboard">Dashboard</Link>
        )}

        {isLoggedIn() && user?.role === "volunteer" && (
          <Link to="/volunteer-dashboard">Dashboard</Link>
        )}

        {/* ✅ ADMIN ICON — visible only to admin */}
        {user?.role === "admin" && (
          <Link to="/admin" className="admin-link">
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
