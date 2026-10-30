import apiClient from "./apiClient";

export const teamService = {
  getTeams: async (params = {}) => {
    return await apiClient.get("/teams", { params });
  },

  getTeamById: async (teamId) => {
    return await apiClient.get(`/teams/${teamId}`);
  },

  createTeam: async (teamData) => {
    return await apiClient.post("/teams", teamData);
  },

  updateTeam: async (teamId, updates) => {
    return await apiClient.put(`/teams/${teamId}`, updates);
  },

  deleteTeam: async (teamId) => {
    return await apiClient.delete(`/teams/${teamId}`);
  },

  toggleRecruitment: async (teamId) => {
    return await apiClient.post(`/teams/${teamId}/toggle-recruitment`);
  },

  toggleSaveTeam: async (teamId) => {
    return await apiClient.post(`/teams/${teamId}/save`);
  },

  getSavedTeams: async () => {
    return await apiClient.get("/teams/saved");
  },

  getMyTeams: async () => {
    return await apiClient.get("/teams/my");
  },

  addComment: async (teamId, text) => {
    return await apiClient.post(`/teams/${teamId}/comments`, { text });
  },

  leaveTeam: async (teamId) => {
    return await apiClient.post(`/teams/${teamId}/leave`);
  },

  removeMember: async (teamId, memberUserId) => {
    return await apiClient.delete(`/teams/${teamId}/members/${memberUserId}`);
  },

  // Join Requests
  requestToJoin: async (teamId, role, message) => {
    return await apiClient.post("/requests", { teamId, role, message });
  },

  getTeamRequests: async (teamId) => {
    return await apiClient.get(`/requests/team/${teamId}`);
  },

  getMyRequests: async () => {
    return await apiClient.get("/requests/my");
  },

  respondToJoinRequest: async (requestId, decision) => {
    return await apiClient.put(`/requests/${requestId}/decision`, { decision });
  },

  withdrawRequest: async (requestId) => {
    return await apiClient.delete(`/requests/${requestId}`);
  },
};

export default teamService;
