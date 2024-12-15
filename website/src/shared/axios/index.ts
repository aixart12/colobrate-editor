import { getAccessToken } from "@/utils";
import axios from "axios";

// Base URL for API
const baseURL = process.env.NEXT_PUBLIC_API_URL // Fallback for development

console.log('base url ' , baseURL)

// Create Axios instance
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent duplicate logout actions
let isLoggingOut = false;

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["x-access-token"] = `${accessToken}`; // Attach token if available
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error); // Debugging request errors
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    console.error("Axios error:", error); // Log the full error for debugging

    if (error.response) {
      const { status, config } = error.response;
      console.error(`Response error (${status}):`, error.response);

      if (status === 401 && !isLoggingOut) {
        isLoggingOut = true; // Prevent duplicate logout actions
        console.warn(`Unauthorized access on endpoint: ${config.url}`);

        // Clear localStorage and notify the user
        localStorage.clear();
        alert("Unauthorized! Logging out...");

        // Redirect to login after a short delay
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
          isLoggingOut = false; // Reset flag after redirect
        }, 500);
      }
    } else if (error.request) {
      console.error("No response received:", error.request); // Debugging network issues
    } else {
      console.error("Error setting up the request:", error.message); // Debugging request setup
    }

    return Promise.reject(error); // Reject error for further handling
  }
);

export default axiosInstance;
