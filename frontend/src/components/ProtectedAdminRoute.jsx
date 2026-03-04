import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("access");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}