import React from "react";
import { LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../../public/Screenshot 2025-11-02 134502.png"; // ✅ update path
import Swal from "sweetalert2";


const Navbar = ({ user, setUser, onToggleSidebar, }) => {
  const navigate = useNavigate();
  console.log(user)
  console.log(user)

const handleLogout = () => {
  localStorage.removeItem("userRole")
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(() => {
        navigate("/"); // ✅ Navigate after a short delay
      }, 1500);
    }
  });
};


  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 h-16 bg-gradient-to-r from-blue-600 to-orange-500 shadow-md border-b border-blue-300"
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* ✅ Left Section */}
        <div className="flex items-center gap-3">
          {/* Hamburger Button for Small Screens */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-blue-700/30 transition"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>

          {/* ✅ Logo */}
          <img
            src={logo}
            alt="IATT Logo"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
          />

          {/* ✅ App Title */}
          <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">
            IAT Technologies
          </h1>
        </div>

        {/* ✅ Right Section */}
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg text-white backdrop-blur-md">
            <span className="text-sm">
              {user?.username || "Guest"} ({user?.role || "User"})
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-blue-700 px-3 py-1.5 rounded-md font-medium hover:bg-gray-100 transition"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
