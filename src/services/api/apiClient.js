import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT Bearer Token if logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Standardize errors & handle unauthorized / service unavailable
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    const data = error.response ? error.response.data : null;
    const message =
      (data && data.error) ||
      error.message ||
      "Unable to communicate with the server. Please check your connection.";

    if (status === 401) {
      // Token expired or invalid: clear token
      const currentToken = localStorage.getItem("auth_token");
      if (currentToken) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("current_user");
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/signup" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login?expired=true";
        }
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
