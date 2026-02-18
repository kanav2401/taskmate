import { useState } from "react";

export default function ComplaintCenter() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a proper explanation.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch(
        "http://localhost:5000/api/users/request-unblock",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Request submitted successfully. Redirecting to login...");
      setMessage("");

      // 🔥 Auto logout after complaint submission
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect to login after short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Complaint Center</h1>

      <p>
        If you believe your account was blocked unfairly, submit your request
        below.
      </p>

      {success && (
        <div style={{ color: "green", marginBottom: "15px" }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Explain why you should be unblocked..."
          required
          style={{
            width: "100%",
            height: "120px",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        />

        <button className="btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
