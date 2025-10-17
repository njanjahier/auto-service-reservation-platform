import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) return <Navigate to="/" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />;
  return children;
}

export default ProtectedRoute;
