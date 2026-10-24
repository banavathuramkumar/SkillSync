import apiClient from "./apiClient";

export const statsService = {
  getPlatformStats: async () => {
    return await apiClient.get("/stats");
  },
  getActivityStats: async () => {
    return await apiClient.get("/stats/activity");
  },
};

export default statsService;
