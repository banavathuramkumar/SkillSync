import { create } from "zustand";
import { toast } from "sonner";
import { notificationService } from "../services/api/notificationService";
import { getSocket } from "../services/socket/socketClient";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  socketInitialized: false,

  /**
   * Fetch persistent notifications from MongoDB
   */
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await notificationService.getNotifications();
      set({
        notifications: res.notifications || [],
        unreadCount: res.unreadCount || 0,
        isLoading: false,
      });
      get().initSocketListener();
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  /**
   * Listen for real-time notification events from Socket.IO
   */
  initSocketListener: () => {
    if (get().socketInitialized) return;
    const socket = getSocket();
    if (!socket) return;

    socket.on("notification:new", (newNotif) => {
      // 1. Play subtle audio ping or toast
      toast.info(newNotif.title, {
        description: newNotif.message,
        duration: 5000,
      });

      // 2. Prepend to notifications list & increment unread counter
      const current = get().notifications;
      set({
        notifications: [newNotif, ...current],
        unreadCount: get().unreadCount + 1,
      });
    });

    set({ socketInitialized: true });
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      const updated = get().notifications.map((n) =>
        n._id === id || n.id === id ? { ...n, read: true } : n
      );
      set({
        notifications: updated,
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    } catch (err) {
      console.error("[Notification] Failed to mark as read:", err.message);
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      const updated = get().notifications.map((n) => ({ ...n, read: true }));
      set({
        notifications: updated,
        unreadCount: 0,
      });
    } catch (err) {
      console.error("[Notification] Failed to mark all as read:", err.message);
    }
  },

  /**
   * Delete a notification
   */
  clearNotification: async (id) => {
    try {
      await notificationService.deleteNotification(id);
      const updated = get().notifications.filter(
        (n) => n._id !== id && n.id !== id
      );
      set({ notifications: updated });
    } catch (err) {
      console.error("[Notification] Failed to clear:", err.message);
    }
  },
}));
