import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  const storedUser = user || JSON.parse(localStorage.getItem("user") || "null");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(storedUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}