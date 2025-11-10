import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Info,
  Users,
  UserCheck,
  Briefcase,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Sidebar links (role-based)
  const links =
    user?.role === "ADMIN"
      ? [
          { name: "Home", icon: <Home />, path: "/admin/home" },
          { name: "User Details", icon: <Users />, path: "/admin/users" },
        ]
      : [
          { name: "Home", icon: <Home />, path: "/user/home" },
          { name: "About", icon: <Info />, path: "/user/about" },
          { name: "Roles & Responsibilities", icon: <Briefcase />, path: "/user/roles" },
        ];

  return (
    <>
      {/* Background overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.4 }}
        className="fixed left-0 top-0 z-50 h-full w-64 bg-blue-600 text-white shadow-lg lg:translate-x-0 lg:static"
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-blue-500">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full border border-white"
          />
          <h2 className="text-lg font-bold tracking-wide">IAT Technology</h2>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col space-y-1 px-3">
          {links.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                  isActive
                    ? "bg-white text-blue-600 font-semibold"
                    : "hover:bg-blue-500 hover:text-white"
                }`
              }
            >
              <span className="w-5 h-5">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-0 w-full px-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full rounded-md bg-white text-blue-600 py-2 font-semibold hover:bg-gray-100 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
