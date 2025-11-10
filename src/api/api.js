// src/api/api.js

import axios from "axios";

// 🌐 Base URL for your backend
export const API_BASE = "http://127.0.0.1:8000";

// 🧩 Create an Axios instance for reusable API calls
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add an interceptor if you want to attach tokens later (optional)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
