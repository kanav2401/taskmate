import { Outlet, NavLink } from "react-router-dom";
import "../App.css";

export default function Layout() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 className="logo">TaskMate</h2>

        <nav>
          <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
            Home
          </NavLink>

          <NavLink to="/admin" className={({ isActive }) => isActive ? "active-link" : ""}>
            Admin
          </NavLink>

          <NavLink to="/client" className={({ isActive }) => isActive ? "active-link" : ""}>
            Client
          </NavLink>

          <NavLink to="/volunteer" className={({ isActive }) => isActive ? "active-link" : ""}>
            Volunteer
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => isActive ? "active-link" : ""}>
            Profile
          </NavLink>
        </nav>
      </aside>

      <div className="main-section">
        <header className="topbar">
          <h3>Welcome Back 👋</h3>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
