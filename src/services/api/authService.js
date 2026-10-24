import apiClient from "./apiClient";

export const authService = {
  login: async (email, password) => {
    return await apiClient.post("/auth/login", { email, password });
  },

  signup: async (name, email, password) => {
    return await apiClient.post("/auth/register", { name, email, password });
  },

  googleLogin: async (googleData) => {
    return await apiClient.post("/auth/google", googleData);
  },

  getMe: async () => {
    return await apiClient.get("/auth/me");
  },

  completeProfile: async (profileData) => {
    return await apiClient.post("/auth/complete-profile", profileData);
  },

  updateProfile: async (updates) => {
    return await apiClient.put("/auth/profile", updates);
  },

  uploadResume: async (formData) => {
    return await apiClient.post("/auth/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadAvatar: async (formData) => {
    return await apiClient.post("/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  removeAvatar: async () => {
    return await apiClient.delete("/auth/avatar");
  },

  forgotPassword: async (email) => {
    return await apiClient.post("/auth/forgot-password", { email });
  },
};

export default authService;
