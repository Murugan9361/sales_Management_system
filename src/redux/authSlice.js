import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://127.0.0.1:8000/login";

// 🔹 Async Thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, role, navigate }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, { email, password, role });
      const data = response.data;

      console.log("Login API Response:", data);
      console.log(data.user_info.role)
      if (data) {
        // ✅ Save user data
        localStorage.setItem("authUser", JSON.stringify(data));

        // ✅ SweetAlert success popup
        Swal.fire({
          title: `Welcome ${data.name || ""}!`,
          text: `You are logged in as ${data.role}`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
       
console.log(role)
        // ✅ Navigate based on role
        if (role === "admin") {
            console.log("hi i am admin")
            console.log(data)
          navigate("/admin/dashboard");
        } else if (role === "user") {
            console.log("hi i am user ")
            
          navigate("/user/dashboard");
        } else {
          Swal.fire("Error", "Invalid role returned from server", "error");
        }

        return data;
      } else {
        Swal.fire("Error", "Invalid login response from server!", "error");
        return rejectWithValue("Invalid response from API");
      }
    } catch (error) {
      console.error("Login Error:", error);

      Swal.fire(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials or server error!",
        "error"
      );
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("authUser")) || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("authUser");
      Swal.fire("Logged Out", "You have been logged out.", "info");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
