import axios from "axios";
import { config } from "@/config";
import cookieStorage from "@/utils/cookieStorage";

// public api
export const PUBLIC_API = axios.create({
  baseURL: `${config.BASE_URL}/api/`,
});

const accessToken = cookieStorage.getItem("accessToken");
// protected api
export const PROTECTED_API = axios.create({
  baseURL: `${config.BASE_URL}/api/`,
});

// an interceptor to attach the access token dynamically for every protected request
PROTECTED_API.interceptors.request.use(
  (config) => {
    // Retrieve the access token from local storage
    const accessToken = cookieStorage.getItem("accessToken");

    if (accessToken) {
      // Attach the token to the Authorization header
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle the error in request configuration
    return Promise.reject(error);
  }
);

// response interceptor for automatic token refresh handling
PROTECTED_API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 status code and handle token refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get the refresh token from cookies
      const refreshToken = cookieStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Request a new access token using the refresh token
          const response = await PUBLIC_API.post("/user/refresh-token", {
            token: refreshToken,
          });
          const newAccessToken = response.data.accessToken;

          // Save the new access token in a cookie
          cookieStorage.setItem("accessToken", newAccessToken);

          // Update the Authorization header and retry the original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return PROTECTED_API(originalRequest); // Retry with new token
        } catch (tokenRefreshError) {
          // (logout the user)
          localStorage.removeItem("isAuthenticated");
          cookieStorage.removeItem("accessToken");
          cookieStorage.removeItem("refreshToken");
          window.location.href = "/auth/login"; // Redirect to login
        }
      }
    }

    // Reject other errors
    return Promise.reject(error);
  }
);
