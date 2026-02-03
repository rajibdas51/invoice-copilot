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
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
    // 1. Handle Token Expiration (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");

      // Clear the local storage so the app doesn't try to use the bad token again
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/login";
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
