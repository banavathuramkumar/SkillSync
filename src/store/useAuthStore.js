import { create } from "zustand";
import { authService } from "../services/api/authService";
import { connectSocket, disconnectSocket } from "../services/socket/socketClient";

const savedToken = localStorage.getItem("auth_token");
const savedUser = localStorage.getItem("current_user")
  ? JSON.parse(localStorage.getItem("current_user"))
  : null;

// Connect socket immediately if already authenticated
if (savedToken) {
  connectSocket(savedToken);
}

export const useAuthStore = create((set, get) => ({
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
  isLoading: false,
  error: null,

  /**
   * Log in with real email & password
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(email, password);
      const { token, user } = res;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("current_user", JSON.stringify(user));

      // Connect authenticated Socket.IO
      connectSocket(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Real user signup with mandatory profile completion gate
   */
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.signup(name, email, password);
      const { token, user } = res;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("current_user", JSON.stringify(user));

      connectSocket(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Google Single Sign-On
   */
  loginWithGoogle: async (googlePayload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.googleLogin(googlePayload);
      const { token, user } = res;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("current_user", JSON.stringify(user));

      connectSocket(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Fetch current authenticated user from backend
   */
  fetchCurrentUser: async () => {
    if (!localStorage.getItem("auth_token")) return;
    try {
      const res = await authService.getMe();
      if (res.user) {
        localStorage.setItem("current_user", JSON.stringify(res.user));
        set({ user: res.user, isAuthenticated: true });
      }
    } catch (err) {
      console.warn("[Auth] Failed to refresh user profile:", err.message);
    }
  },

  /**
   * Complete mandatory student profile
   */
  completeProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.completeProfile(profileData);
      const updatedUser = res.user;

      localStorage.setItem("current_user", JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });

      return { success: true, user: updatedUser };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Update profile fields
   */
  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.updateProfile(updates);
      const updatedUser = res.user;

      localStorage.setItem("current_user", JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });

      return { success: true, user: updatedUser };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Upload resume PDF
   */
  uploadResume: async (formData) => {
    try {
      const res = await authService.uploadResume(formData);
      if (res.success && get().user) {
        const updated = {
          ...get().user,
          resumeUrl: res.resumeUrl,
          resumeFilename: res.resumeFilename,
        };
        localStorage.setItem("current_user", JSON.stringify(updated));
        set({ user: updated });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Upload or change profile picture
   */
  uploadAvatar: async (formData) => {
    try {
      const res = await authService.uploadAvatar(formData);
      if (res.success && get().user) {
        const updated = {
          ...get().user,
          avatar: res.avatarUrl,
        };
        localStorage.setItem("current_user", JSON.stringify(updated));
        set({ user: updated });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Remove profile picture (revert to No Profile Pic)
   */
  removeAvatar: async () => {
    try {
      const res = await authService.removeAvatar();
      if (res.success && get().user) {
        const updated = {
          ...get().user,
          avatar: "",
        };
        localStorage.setItem("current_user", JSON.stringify(updated));
        set({ user: updated });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Log out cleanly
   */
  logout: () => {
    disconnectSocket();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));
