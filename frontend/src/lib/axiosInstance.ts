import axios from "axios";

const API_URL = "http://localhost:5001/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      return Promise.reject(new Error("No internet connection"));
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// Simple interceptor (no getSession here)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
