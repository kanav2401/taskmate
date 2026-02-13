import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
