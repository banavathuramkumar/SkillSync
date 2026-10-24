import { Competition } from "../models/Competition.js";
import { User } from "../models/User.js";

/**
 * Get all competitions
 * GET /api/competitions
 */
export const getCompetitions = async (req, res, next) => {
  try {
    const { q, category, mode } = req.query;
    const query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { organizer: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }

    if (category && category !== "All Categories") {
      query.category = category;
    }

    if (mode && mode !== "All Modes") {
      query.mode = mode;
    }

    const competitions = await Competition.find(query).sort({ registrationDeadline: 1 });

    res.json({
      success: true,
      total: competitions.length,
      competitions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get competition by ID
 * GET /api/competitions/:id
 */
export const getCompetitionById = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ success: false, error: "Competition not found." });
    }

    res.json({
      success: true,
      competition,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Bookmark / Save competition
 * POST /api/competitions/:id/save
 */
export const toggleSaveCompetition = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const compId = req.params.id;

    const isSaved = user.savedCompetitions.some((id) => id.toString() === compId);

    if (isSaved) {
      user.savedCompetitions = user.savedCompetitions.filter(
        (id) => id.toString() !== compId
      );
    } else {
      user.savedCompetitions.push(compId);
    }

    await user.save();

    res.json({
      success: true,
      saved: !isSaved,
      savedCompetitions: user.savedCompetitions,
    });
  } catch (error) {
    next(error);
  }
};
