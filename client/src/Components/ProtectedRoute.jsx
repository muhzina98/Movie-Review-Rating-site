import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role
  if (allowedRole && user.role !== allowedRole)
    return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
