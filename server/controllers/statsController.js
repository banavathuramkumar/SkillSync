import { User } from "../models/User.js";
import { Team } from "../models/Team.js";
import { Competition } from "../models/Competition.js";
import { JoinRequest } from "../models/JoinRequest.js";

/**
 * Get Platform Statistics derived directly from real database records
 * GET /api/stats
 */
export const getPlatformStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTeams, recruitingTeams, competitionsListed] =
      await Promise.all([
        User.countDocuments(),
        Team.countDocuments(),
        Team.find({ status: "Recruiting" }).select("maxMembers members"),
        Competition.countDocuments(),
      ]);

    // Calculate actual open positions across all active recruiting teams
    const openPositions = recruitingTeams.reduce((acc, team) => {
      const open = Math.max(0, team.maxMembers - (team.members?.length || 0));
      return acc + open;
    }, 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        teamsCreated: totalTeams,
        openPositions,
        competitionsListed,
        isLiveDatabase: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Live Activity Statistics for past 7 days based strictly on actual database events
 * GET /api/stats/activity
 */
export const getActivityStats = async (req, res, next) => {
  try {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const result = [];

    // Query 7 days (6 days ago through today)
    for (let i = 6; i >= 0; i--) {
      const startOfDay = new Date(now);
      startOfDay.setDate(now.getDate() - i);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(now);
      endOfDay.setDate(now.getDate() - i);
      endOfDay.setHours(23, 59, 59, 999);

      const dayName = dayNames[startOfDay.getDay()];

      const [requestsCount, newUsersCount] = await Promise.all([
        JoinRequest.countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        }),
        User.countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        }),
      ]);

      result.push({
        day: dayName,
        date: startOfDay.toISOString().split("T")[0],
        requests: requestsCount,
        activeUsers: newUsersCount,
      });
    }

    const totalPeriodRequests = result.reduce((s, r) => s + r.requests, 0);
    const totalPeriodUsers = result.reduce((s, r) => s + r.activeUsers, 0);

    res.json({
      success: true,
      activity: result,
      summary: {
        totalPeriodRequests,
        totalPeriodUsers,
        isLiveDatabase: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
