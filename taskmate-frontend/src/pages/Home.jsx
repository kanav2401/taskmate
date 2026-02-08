import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <h1>Get help. Give help. Get paid.</h1>
        <p>
          TaskMate connects people who need help with assignments
          to skilled volunteers — fairly and transparently.
        </p>

        <div className="hero-actions">
          <button
            className="btn"
            onClick={() => navigate("/register")}
          >
            Find a Volunteer
          </button>

          <button
            className="btn secondary"
            onClick={() => navigate("/register")}
          >
            Work as Volunteer
          </button>
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
              based on skills and pricing.
            </p>
          </div>

          <div className="info-card">
            <h3>Submit On Time</h3>
            <p>
              Tasks must be submitted before the deadline,
              otherwise the volunteer may get blocked.
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
          <li>✔ Separate dashboards for clients & volunteers</li>
          <li>✔ Auto-blocking for missed deadlines</li>
          <li>✔ Transparent task history</li>
          <li>✔ Secure login with JWT authentication</li>
        </ul>
      </section>
    </>
  );
}
