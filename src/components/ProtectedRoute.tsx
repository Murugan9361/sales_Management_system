import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRole, children }) => {
  console.log("Protected Route:", user, allowedRole);

  // Get user role from localStorage
  const role = localStorage.getItem("userRole");

  // 🚫 Not logged in — go back to login
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // Normalize roles (to handle case differences)
  const userRole = role?.toLowerCase();
  const requiredRole = allowedRole?.toLowerCase();

  console.log("User Role:", userRole, "| Required:", requiredRole);

  // ✅ Check if allowed
  if (userRole === requiredRole) {
    return children; // Access granted
  }

  // 🚫 Role mismatch — redirect based on actual role
  switch (userRole) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "user":
      return <Navigate to="/user/dashboard" replace />;
    case "superadmin":
      return <Navigate to="/superadmin/dashboard" replace />;
    case "superuser":
      return <Navigate to="/superuser/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
