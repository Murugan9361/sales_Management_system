import { useEffect, useLayoutEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard"; // ✅ Added
import SuperUserDashboard from "./pages/SuperUserDashboard"; // ✅ Added
import ProtectedRoute from "./components/ProtectedRoute";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

const App = () => {
  const [user, setUser] = useState(null);
  console.log("Current User:", user);
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Delay ensures content is rendered before scrolling
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        {/* 🔹 Login Page */}
        <Route path="/" element={<Login />} />

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
