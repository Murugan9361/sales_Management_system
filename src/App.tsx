import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard"; // ✅ Added
import SuperUserDashboard from "./pages/SuperUserDashboard";   // ✅ Added
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [user, setUser] = useState(null);
  console.log("Current User:", user);

  return (
    <Router>
      <Routes>
        {/* 🔹 Login Page */}
        <Route path="/" element={<Login  />} />

        {/* 🔹 Super Admin Dashboard */}
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="Super Admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔹 Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔹 Super User Dashboard */}
        <Route
          path="/superuser/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="Super User">
              <SuperUserDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔹 User Dashboard */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="User">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
