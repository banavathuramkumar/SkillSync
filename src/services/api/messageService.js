import apiClient from "./apiClient";

export const messageService = {
  getConversations: async () => {
    return await apiClient.get("/messages/conversations");
  },

  getTeamConversation: async (teamId) => {
    return await apiClient.get(`/messages/conversations/team/${teamId}`);
  },

  getMessages: async (conversationId) => {
    return await apiClient.get(`/messages/conversations/${conversationId}/messages`);
  },

  sendMessage: async (conversationId, text, type = "text", meeting = null) => {
    return await apiClient.post(`/messages/conversations/${conversationId}/messages`, {
      text,
      type,
      meeting,
    });
  },
};

export default messageService;
