import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function Home() {
  const navigate = useNavigate();
  const user = getUser();

  const handleFindVolunteer = () => {
    if (!user) {
      navigate("/register?role=client");
      return;
    }

    if (user.role === "client") {
      navigate("/post-task");
    } else {
      navigate("/browse");
    }
  };

  const handleWorkVolunteer = () => {
    if (!user) {
      navigate("/register?role=volunteer");
      return;
    }

    if (user.role === "volunteer") {
      navigate("/browse");
    } else {
      navigate("/client-dashboard");
    }
  };

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero-section">
        <h1>Get help. Give help. Get paid.</h1>

        <p>
          TaskMate connects clients and volunteers through a fair,
          deadline-based task system.
        </p>

        <div className="hero-actions">
          <button className="btn" onClick={handleFindVolunteer}>
            Find a Volunteer
          </button>

          <button className="btn secondary" onClick={handleWorkVolunteer}>
            Work as Volunteer
          </button>
        </div>
      </section>

      {/* WHY TASKMATE */}
      <section className="info-section">
        <h2>Why TaskMate?</h2>

        <ul>
          <li>✔ Transparent budgets</li>
          <li>✔ Deadline accountability</li>
          <li>✔ Secure role-based system</li>
          <li>✔ Professional dashboards</li>
        </ul>
      </section>

    </div>
  );
}
