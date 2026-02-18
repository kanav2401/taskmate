import { Link } from "react-router-dom";

export default function BlockedBanner() {
  return (
    <div
      style={{
        background: "#fee2e2",
        color: "#991b1b",
        padding: "12px 20px",
        fontWeight: "500",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>
        ❌ Your account has been temporarily blocked due to a missed deadline.
        Please contact support if you think this is a mistake.
      </span>

      <Link
        to="/complaint"
        style={{
          background: "#dc2626",
          color: "white",
          padding: "6px 12px",
          borderRadius: "6px",
          textDecoration: "none",
          marginLeft: "15px",
        }}
      >
        Request Unblock
      </Link>
    </div>
  );
}
