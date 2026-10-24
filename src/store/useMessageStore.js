import { create } from "zustand";
import { messageService } from "../services/api/messageService";
import { getSocket } from "../services/socket/socketClient";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
  conversations: [],
  messages: {}, // conversationId -> Array of messages
  activeConversationId: null,
  activeMeetings: {},
  isLoading: false,
  error: null,
  socketInitialized: false,

  /**
   * Fetch all authorized conversations for current user
   */
  fetchConversations: async (targetConvId = null) => {
    set({ isLoading: true, error: null });
    try {
      const res = await messageService.getConversations();
      const conversations = res.conversations || [];
      const selectedId = targetConvId || get().activeConversationId || null;

      set({
        conversations,
        activeConversationId: selectedId,
        isLoading: false,
      });

      if (selectedId) {
        get().fetchMessages(selectedId);
      }

      get().initSocketListeners();
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  /**
   * Fetch messages for a specific conversation
   */
  fetchMessages: async (conversationId) => {
    if (!conversationId) return;
    try {
      const res = await messageService.getMessages(conversationId);
      const current = get().messages;
      set({
        messages: {
          ...current,
          [conversationId]: res.messages || [],
        },
      });

      // Join Socket.IO conversation room
      const socket = getSocket();
      if (socket) {
        socket.emit("conversation:join", conversationId);
      }
    } catch (err) {
      console.error("[Chat] Failed to fetch messages:", err.message);
    }
  },

  /**
   * Set active conversation & load its messages
   */
  setActiveConversation: (id) => {
    const oldId = get().activeConversationId;
    const socket = getSocket();

    if (socket && oldId && oldId !== id) {
      socket.emit("conversation:leave", oldId);
    }

    set({ activeConversationId: id || null });
    if (id) {
      get().fetchMessages(id);
    }
  },

  /**
   * Send a standard text message with 0ms Instant Optimistic UI Update
   */
  sendMessage: async (conversationId, text) => {
    if (!text || !text.trim() || !conversationId) return;
    const trimmedText = text.trim();

    // Current user context
    const currentUser = useAuthStore.getState().user;
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const optimisticMessage = {
      _id: tempId,
      id: tempId,
      conversation: conversationId,
      sender: currentUser?._id || currentUser?.id,
      senderName: currentUser?.name || "Me",
      senderAvatar: currentUser?.avatar || "",
      text: trimmedText,
      type: "text",
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // 1. INSTANT 0ms OPTIMISTIC UPDATE: Update UI immediately
    const currentMsgs = get().messages[conversationId] || [];
    set({
      messages: {
        ...get().messages,
        [conversationId]: [...currentMsgs, optimisticMessage],
      },
    });

    // 2. Immediately update sidebar / conversation list preview
    const updatedConvs = get().conversations.map((c) => {
      const cId = c._id || c.id;
      if (cId === conversationId) {
        return {
          ...c,
          lastMessage: {
            text: trimmedText,
            senderName: currentUser?.name || "Me",
            timestamp: new Date().toISOString(),
          },
        };
      }
      return c;
    });
    set({ conversations: updatedConvs });

    // 3. Perform network dispatch in the background
    try {
      const res = await messageService.sendMessage(conversationId, trimmedText, "text");
      const serverMsg = res.message;

      // Replace the optimistic placeholder with confirmed server document
      const currentList = get().messages[conversationId] || [];
      const updatedList = currentList.map((m) =>
        m._id === tempId ? serverMsg : m
      );

      set({
        messages: {
          ...get().messages,
          [conversationId]: updatedList,
        },
      });
    } catch (err) {
      console.error("[Chat] Failed to deliver message to server:", err.message);
      // On failure, rollback the optimistic message
      const rolledBack = (get().messages[conversationId] || []).filter(
        (m) => m._id !== tempId
      );
      set({
        messages: {
          ...get().messages,
          [conversationId]: rolledBack,
        },
      });
    }
  },

  /**
   * Send a rich meeting invitation card
   */
  sendMeetingInvitation: async (conversationId, meetingData) => {
    if (!conversationId) return;
    try {
      const title =
        meetingData.title ||
        (meetingData.callType === "group" ? "Squad Group Meeting" : "Direct Video Call");
      const text = `📹 ${meetingData.callType === "group" ? "Team Group Meeting" : "Video Call"} started`;

      const res = await messageService.sendMessage(conversationId, text, "meeting_invitation", {
        roomName: meetingData.roomName,
        meetingUrl: meetingData.meetingUrl,
        title,
        callType: meetingData.callType || "group",
        status: "available",
        startedAt: new Date().toISOString(),
      });

      const newMsg = res.message;
      const currentMsgs = get().messages[conversationId] || [];

      set({
        messages: {
          ...get().messages,
          [conversationId]: [...currentMsgs, newMsg],
        },
        activeMeetings: {
          ...get().activeMeetings,
          [conversationId]: meetingData,
        },
      });
    } catch (err) {
      console.error("[Chat] Failed to send meeting invitation:", err.message);
    }
  },

  /**
   * Initialize Socket.IO listeners for live chat events with smart deduplication
   */
  initSocketListeners: () => {
    if (get().socketInitialized) return;
    const socket = getSocket();
    if (!socket) return;

    socket.on("message:new", (newMsg) => {
      const convId = newMsg.conversation?.toString() || newMsg.conversation;
      if (!convId) return;

      const currentMsgs = get().messages[convId] || [];

      // Check if message is already present by server ID or matches an active optimistic message
      const existingIndex = currentMsgs.findIndex(
        (m) =>
          (m._id || m.id) === (newMsg._id || newMsg.id) ||
          (m.isOptimistic &&
            m.text === newMsg.text &&
            String(m.sender) === String(newMsg.sender))
      );

      if (existingIndex !== -1) {
        // If it was an optimistic message, replace with confirmed server message
        if (currentMsgs[existingIndex].isOptimistic) {
          const updated = [...currentMsgs];
          updated[existingIndex] = newMsg;
          set({
            messages: {
              ...get().messages,
              [convId]: updated,
            },
          });
        }
      } else {
        // New incoming message from another participant
        set({
          messages: {
            ...get().messages,
            [convId]: [...currentMsgs, newMsg],
          },
        });

        // Update conversation lastMessage
        const updatedConvs = get().conversations.map((c) => {
          const cId = c._id || c.id;
          if (cId === convId) {
            return {
              ...c,
              lastMessage: {
                text: newMsg.text,
                senderName: newMsg.senderName,
                timestamp: newMsg.createdAt || newMsg.timestamp,
              },
            };
          }
          return c;
        });

        set({ conversations: updatedConvs });
      }
    });

    set({ socketInitialized: true });
  },

  /**
   * End an active meeting
   */
  endMeeting: (conversationId) => {
    const next = { ...get().activeMeetings };
    delete next[conversationId];
    set({ activeMeetings: next });
  },
}));
