import { create } from "zustand";
import { teamService } from "../services/api/teamService";

export const useTeamStore = create((set, get) => ({
  teams: [],
  currentTeam: null,
  comments: [],
  joinRequests: [],
  myRequests: [],
  savedTeamIds: [],
  savedTeams: [],
  myTeams: { created: [], joined: [], previous: [] },
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,

  /**
   * Fetch all teams with search, filters & pagination from MongoDB
   */
  fetchTeams: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await teamService.getTeams(params);
      set({
        teams: res.teams || [],
        total: res.total || 0,
        page: res.page || 1,
        pages: res.pages || 1,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  /**
   * Fetch a single team by ID including comments
   */
  fetchTeamById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await teamService.getTeamById(id);
      set({
        currentTeam: res.team,
        comments: res.comments || [],
        isLoading: false,
      });
      return res.team;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return null;
    }
  },

  /**
   * Fetch user's created, joined, and previous squads
   */
  fetchMyTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await teamService.getMyTeams();
      set({
        myTeams: {
          created: res.created || [],
          joined: res.joined || [],
          previous: res.previous || [],
        },
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  /**
   * Fetch saved teams
   */
  fetchSavedTeams: async () => {
    try {
      const res = await teamService.getSavedTeams();
      const teams = res.teams || [];
      const ids = teams.map((t) => t._id || t.id);
      set({ savedTeams: teams, savedTeamIds: ids });
    } catch (err) {
      console.error("[Teams] Failed to fetch saved teams:", err.message);
    }
  },

  /**
   * Create a new team
   */
  createTeam: async (teamData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await teamService.createTeam(teamData);
      set({ isLoading: false });
      return { success: true, team: res.team };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Update team info (Owner only)
   */
  updateTeam: async (teamId, updates) => {
    try {
      const res = await teamService.updateTeam(teamId, updates);
      set({ currentTeam: res.team });
      return { success: true, team: res.team };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Disband / Delete team
   */
  deleteTeam: async (teamId) => {
    try {
      await teamService.deleteTeam(teamId);
      const updatedTeams = get().teams.filter(
        (t) => (t._id || t.id) !== teamId
      );
      set({ teams: updatedTeams, currentTeam: null });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Toggle recruitment status
   */
  toggleRecruitmentStatus: async (teamId) => {
    try {
      const res = await teamService.toggleRecruitment(teamId);
      if (get().currentTeam) {
        set({
          currentTeam: { ...get().currentTeam, status: res.status },
        });
      }
      return { success: true, status: res.status };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Bookmark / Save team
   */
  toggleSaveTeam: async (teamId) => {
    try {
      const res = await teamService.toggleSaveTeam(teamId);
      const currentIds = get().savedTeamIds;
      const nextIds = res.saved
        ? [...currentIds, teamId]
        : currentIds.filter((id) => id !== teamId);
      set({ savedTeamIds: nextIds });
      return res;
    } catch (err) {
      console.error("[Teams] Failed to toggle save:", err.message);
    }
  },

  /**
   * Submit an application to join a squad
   */
  requestToJoin: async (teamId, role, message) => {
    try {
      const res = await teamService.requestToJoin(teamId, role, message);
      return { success: true, request: res.request };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Fetch applications for a specific team (Leader only)
   */
  fetchTeamRequests: async (teamId) => {
    try {
      const res = await teamService.getTeamRequests(teamId);
      set({ joinRequests: res.requests || [] });
      return res.requests;
    } catch (err) {
      console.error("[Teams] Failed to fetch team requests:", err.message);
      return [];
    }
  },

  /**
   * Fetch current user's applications
   */
  fetchMyRequests: async () => {
    try {
      const res = await teamService.getMyRequests();
      set({ myRequests: res.requests || [] });
      return res.requests;
    } catch (err) {
      console.error("[Teams] Failed to fetch my requests:", err.message);
      return [];
    }
  },

  /**
   * Respond to application (Accept or Reject)
   */
  respondToJoinRequest: async (requestId, decision) => {
    try {
      const res = await teamService.respondToJoinRequest(requestId, decision);
      // Update local join requests
      const updated = get().joinRequests.map((r) =>
        (r._id || r.id) === requestId ? { ...r, status: decision } : r
      );
      set({ joinRequests: updated });
      return { success: true, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Withdraw pending application
   */
  withdrawRequest: async (requestId) => {
    try {
      await teamService.withdrawRequest(requestId);
      const updated = get().myRequests.filter(
        (r) => (r._id || r.id) !== requestId
      );
      set({ myRequests: updated });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Add a public comment to the squad
   */
  addComment: async (teamId, text) => {
    try {
      const res = await teamService.addComment(teamId, text);
      const updatedComments = [res.comment, ...get().comments];
      set({ comments: updatedComments });
      return { success: true, comment: res.comment };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
}));
