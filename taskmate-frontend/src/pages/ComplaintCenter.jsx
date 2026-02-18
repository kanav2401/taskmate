import { useState } from "react";

export default function ComplaintCenter() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    setSuccess(data.message);
    setMessage("");
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

        <button className="btn">Submit Request</button>
      </form>
    </div>
  );
}
