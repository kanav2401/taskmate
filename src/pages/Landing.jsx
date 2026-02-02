import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <h1>
          Get help. <span>Give help.</span> Get paid.
        </h1>

        <p>
          TaskMate connects people who need help with assignments and projects
          to skilled volunteers — ethically, transparently, and on time.
        </p>

        <div className="hero-buttons">
          <a href="/register" className="btn">I Need Help</a>
          <a href="/register" className="btn-outline">I Want to Help</a>
        </div>

        <h2 className="section-title">How TaskMate Works</h2>

        <div className="steps">
          <div className="step">
            <h3>1. Post Your Task</h3>
            <p>Upload your assignment and set a deadline.</p>
          </div>

          <div className="step">
            <h3>2. Get Matched</h3>
            <p>Volunteers review your task and offer help.</p>
          </div>

          <div className="step">
            <h3>3. Learn & Complete</h3>
            <p>Receive ethical help and finish on time.</p>
          </div>
        </div>
      </section>
    </>
  );
}
