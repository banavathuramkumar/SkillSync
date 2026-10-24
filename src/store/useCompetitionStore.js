import { create } from "zustand";
import { competitionService } from "../services/api/competitionService";

export const useCompetitionStore = create((set, get) => ({
  competitions: [],
  savedCompetitionIds: [],
  isLoading: false,
  error: null,

  /**
   * Fetch competitions from database
   */
  fetchCompetitions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await competitionService.getCompetitions(params);
      set({
        competitions: res.competitions || [],
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  /**
   * Toggle save/bookmark competition
   */
  toggleSaveCompetition: async (id) => {
    try {
      const res = await competitionService.toggleSaveCompetition(id);
      const current = get().savedCompetitionIds;
      const next = res.saved
        ? [...current, id]
        : current.filter((x) => x !== id);
      set({ savedCompetitionIds: next });
    } catch (err) {
      console.error("[Competition] Failed to toggle bookmark:", err.message);
    }
  },

  getCompetitionById: (id) => {
    return get().competitions.find((c) => (c._id || c.id) === id);
  },
}));
