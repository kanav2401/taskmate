import { Link } from "react-router-dom";
import { isLoggedIn, removeToken } from "../utils/auth";

export default function Navbar() {
  const logout = () => {
    removeToken();
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <div className="nav-left">TaskMate</div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/browse">Browse Tasks</Link>

        {isLoggedIn() ? (
          <button onClick={logout} className="nav-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-btn">
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
