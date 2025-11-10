import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import image from "../../public/Screenshot 2025-11-02 134502.png"; // your logo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Warning", "Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
        role,
      });

      const userData = res.data;
      const userRole = userData.user_info.role;
      localStorage.setItem("userRole", userRole);

      await Swal.fire({
        title: "Success!",
        text: "Login Successful",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      if (userRole === "Super Admin") {
        navigate("/superadmin/dashboard", { state: { user: userData } });
      } else if (userRole === "Admin") {
        navigate("/admin/dashboard", { state: { user: userData } });
      } else if (userRole === "Super User") {
        navigate("/superuser/dashboard", { state: { user: userData } });
      } else if (userRole === "User") {
        navigate("/user/dashboard", { state: { user: userData } });
      } else {
        Swal.fire("Error", "Invalid role detected", "error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire("Error", "Invalid credentials or server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001F3F] via-[#0A2E5C] to-[#F57F17] px-4 py-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] max-w-[450px]"
      >
        <Card className="shadow-2xl border border-gray-100 bg-white/95 backdrop-blur-lg rounded-2xl">
          <CardHeader className="text-center space-y-3">
            {/* 🖼️ Logo */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <img
                src={image}
                alt="Office Logo"
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-white shadow-xl"
              />
            </motion.div>

            {/* 🌈 Animated Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <CardTitle
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#001F3F] via-[#0A2E5C] to-[#F57F17] bg-clip-text text-transparent animate-pulse"
              >
                IAT Technologies
              </CardTitle>
            </motion.div>

            {/* ✨ Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              <CardDescription className="text-gray-600 text-sm sm:text-base">
                Sales Management System
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ✅ Role Select */}
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super User">Super User</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-10 text-sm md:text-base"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-10 text-sm md:text-base"
                  required
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-gradient-to-r from-[#001F3F] to-[#F57F17] hover:from-[#0A2E5C] hover:to-[#FF8F00] text-white rounded-xl transition-all duration-300 "
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
