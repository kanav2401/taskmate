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
        <Link to="/" className="nav-btn">Home</Link><hr></hr>
        <Link to="/browse" className="nav-btn">Browse Tasks</Link><hr></hr>

        {isLoggedIn() ? (
          <button onClick={logout} className="nav-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link><hr></hr>
            <Link to="/register" className="nav-btn">
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
