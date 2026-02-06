import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-section">
        <h1>Get help. Give help. Get paid.</h1>
        <p>
          TaskMate connects people who need help with assignments
          to skilled volunteers — fairly and transparently.
        </p>

        <div className="hero-actions">
          <a href="/register" className="btn">Find a Volunteer</a>
          <a href="/register" className="btn secondary">Work as Volunteer</a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="info-section">
        <h2>How TaskMate Works</h2>

        <div className="info-cards">
          <div className="info-card">
            <h3>Post Your Task</h3>
            <p>
              Clients upload assignments or project requirements
              with deadlines and budget.
            </p>
          </div>

          <div className="info-card">
            <h3>Volunteer Accepts</h3>
            <p>
              Volunteers browse tasks and accept work
              based on skills and price.
            </p>
          </div>

          <div className="info-card">
            <h3>Submit On Time</h3>
            <p>
              Tasks must be submitted before deadline,
              otherwise volunteer may get blocked.
            </p>
          </div>
        </div>
      </section>

      {/* WHY TASKMATE */}
      <section className="info-section alt">
        <h2>Why TaskMate?</h2>

        <ul className="feature-list">
          <li>✔ Clear deadlines & accountability</li>
          <li>✔ Fair pricing system</li>
          <li>✔ Client & volunteer separation</li>
          <li>✔ Auto-blocking for missed deadlines</li>
          <li>✔ Transparent task history</li>
        </ul>
      </section>

      <Footer />
    </>
  );
}
