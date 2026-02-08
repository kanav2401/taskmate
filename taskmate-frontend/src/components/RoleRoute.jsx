import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../utils/auth";

export default function RoleRoute({ children, role }) {
  if (!isLoggedIn()) return <Navigate to="/login" />;

  const user = getUser();
  if (!user || user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
