import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //  Only logout on 401 for AUTHENTICATED requests (not login/register)
    if (error.response && error.response.status === 401) {
      const isAuthRoute =
        error.config.url.includes("/api/auth/login") ||
        error.config.url.includes("/api/auth/register");

      // Don't auto-logout if it's a login/register failure
      if (!isAuthRoute) {
        console.warn("Session expired. Logging out...");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    // 2. Handle common errors globally
    if (error.response) {
      if (error.response.status === 500) {
        console.error("Server Error: Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
