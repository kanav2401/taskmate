import Navbar from "../components/Navbar";
import "../App.css";

export default function Landing() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>
            Get help. <span>Give help.</span> Get paid.
          </h1>

          <p>
            TaskMate connects people who need help with assignments and projects
            to skilled volunteers — ethically, transparently, and on time.
          </p>

          <div className="hero-buttons">
            <a href="/register" className="btn-primary">
              I Need Help
            </a>
            <a href="/register" className="btn-outline">
              I Want to Help
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
