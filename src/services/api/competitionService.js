import apiClient from "./apiClient";

export const competitionService = {
  getCompetitions: async (params = {}) => {
    return await apiClient.get("/competitions", { params });
  },

  getCompetitionById: async (id) => {
    return await apiClient.get(`/competitions/${id}`);
  },

  toggleSaveCompetition: async (id) => {
    return await apiClient.post(`/competitions/${id}/save`);
  },
};

export default competitionService;
