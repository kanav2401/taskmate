import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-section">
          <h2 className="footer-logo">TaskMate</h2>
          <p className="footer-text">
            A platform connecting students and volunteers for
            ethical academic help.
          </p>
        </div>

        {/* PLATFORM LINKS */}
        <div className="footer-section">
          <h3>Platform</h3>
          <ul>
            <li><Link to="/browse">Browse Tasks</Link></li>
            <li><Link to="/post-task">Post Assignment</Link></li>
            <li><Link to="/register">Become Volunteer</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <ul>
  <li><Link to="/faq">FAQ</Link></li>
  <li><Link to="/contact">Contact Us</Link></li>
  <li><Link to="/privacy">Privacy Policy</Link></li>
  <li><Link to="/terms">Terms & Conditions</Link></li>
</ul>

          </ul>
        </div>

        {/* SOCIAL */}
        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-links">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" aria-label="Twitter">Twitter</a>
           
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} TaskMate. All rights reserved.
      </div>
    </footer>
  );
}
