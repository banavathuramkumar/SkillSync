import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { Conversation } from "../models/Conversation.js";
import { Comment } from "../models/Comment.js";
import { Notification } from "../models/Notification.js";
import { getIO } from "../sockets/socketHandler.js";

/**
 * Create a new team
 * POST /api/teams
 */
export const createTeam = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      competitionName,
      problemStatement,
      projectTitle,
      requiredSkills,
      openRoles,
      techStack,
      state,
      city,
      format,
      maxMembers,
      deadline,
    } = req.body;

    if (!name || !description || !category || !competitionName) {
      return res.status(400).json({
        success: false,
        error: "Team name, description, category, and competition are required.",
      });
    }

    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one required skill must be specified.",
      });
    }

    const team = await Team.create({
      name: name.trim(),
      description: description.trim(),
      category,
      competitionName: competitionName.trim(),
      problemStatement: problemStatement ? problemStatement.trim() : "",
      projectTitle: projectTitle ? projectTitle.trim() : "",
      requiredSkills,
      openRoles: Array.isArray(openRoles) ? openRoles : [],
      techStack: Array.isArray(techStack) ? techStack : [],
      state: state || req.user.state || "",
      city: city || req.user.city || "",
      format: format || "Online / Virtual",
      maxMembers: parseInt(maxMembers, 10) || 4,
      deadline: deadline ? new Date(deadline) : undefined,
      owner: req.user._id,
      status: "Recruiting",
      members: [
        {
          user: req.user._id,
          role: "Team Lead",
          joinedAt: new Date(),
          isOwner: true,
        },
      ],
    });

    // Automatically create a private team conversation channel
    await Conversation.create({
      team: team._id,
      name: team.name,
      type: "team",
      participants: [req.user._id],
      lastMessage: {
        text: `Team "${team.name}" created. Team chat initialized.`,
        senderName: "System",
        timestamp: new Date(),
        type: "system",
      },
    });

    const populatedTeam = await Team.findById(team._id)
      .populate("owner", "name email college avatar")
      .populate("members.user", "name email college avatar skills");

    res.status(201).json({
      success: true,
      message: "Team successfully created!",
      team: populatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List & search teams
 * GET /api/teams
 */
export const getTeams = async (req, res, next) => {
  try {
    const {
      q,
      category,
      skill,
      state,
      format,
      status,
      sort = "newest",
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { competitionName: { $regex: q, $options: "i" } },
        { projectTitle: { $regex: q, $options: "i" } },
        { problemStatement: { $regex: q, $options: "i" } },
        { requiredSkills: { $regex: q, $options: "i" } },
      ];
    }

    if (category && category !== "All Categories") {
      query.category = category;
    }

    if (skill) {
      query.requiredSkills = { $in: [new RegExp(skill, "i")] };
    }

    if (state) {
      query.state = state;
    }

    if (format && format !== "All Formats") {
      query.format = format;
    }

    if (status) {
      query.status = status;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "deadline") sortOptions = { deadline: 1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [teams, total] = await Promise.all([
      Team.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate("owner", "name email college avatar")
        .populate("members.user", "name email college avatar skills"),
      Team.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      teams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get team by ID
 * GET /api/teams/:id
 */
export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("owner", "name email college avatar bio skills githubUrl linkedinUrl")
      .populate("members.user", "name email college avatar bio skills githubUrl linkedinUrl");

    if (!team) {
      return res.status(404).json({
        success: false,
        error: "Team not found.",
      });
    }

    const comments = await Comment.find({ team: team._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      team,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update team details (Owner only)
 * PUT /api/teams/:id
 */
export const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only the squad leader can modify team details.",
      });
    }

    const allowed = [
      "name",
      "description",
      "category",
      "competitionName",
      "problemStatement",
      "projectTitle",
      "requiredSkills",
      "state",
      "city",
      "format",
      "maxMembers",
      "status",
      "deadline",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        team[field] = req.body[field];
      }
    });

    await team.save();

    const updated = await Team.findById(team._id)
      .populate("owner", "name email college avatar")
      .populate("members.user", "name email college avatar skills");

    res.json({
      success: true,
      message: "Team details updated successfully.",
      team: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete / Disband team (Owner only)
 * DELETE /api/teams/:id
 */
export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only the team owner can disband this squad.",
      });
    }

    await Team.findByIdAndDelete(team._id);
    await Conversation.findOneAndDelete({ team: team._id });
    await Comment.deleteMany({ team: team._id });

    res.json({
      success: true,
      message: "Team has been permanently disbanded.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle recruitment status (Owner only)
 * POST /api/teams/:id/toggle-recruitment
 */
export const toggleRecruitment = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only the team leader can toggle recruitment status.",
      });
    }

    team.status = team.status === "Recruiting" ? "Closed" : "Recruiting";
    await team.save();

    res.json({
      success: true,
      message: `Recruitment ${team.status === "Recruiting" ? "reopened" : "closed"}.`,
      status: team.status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save or Unsave a team
 * POST /api/teams/:id/save
 */
export const toggleSaveTeam = async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const user = await User.findById(req.user._id);

    const isSaved = user.savedTeams.some((id) => id.toString() === teamId);

    if (isSaved) {
      user.savedTeams = user.savedTeams.filter((id) => id.toString() !== teamId);
    } else {
      user.savedTeams.push(teamId);
    }

    await user.save();

    res.json({
      success: true,
      saved: !isSaved,
      savedTeams: user.savedTeams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get teams saved by current user
 * GET /api/teams/saved
 */
export const getSavedTeams = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedTeams",
      populate: [
        { path: "owner", select: "name email college avatar" },
        { path: "members.user", select: "name email college avatar skills" },
      ],
    });

    res.json({
      success: true,
      teams: user.savedTeams || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's teams (Created, Joined, and Previous)
 * GET /api/teams/my
 */
export const getMyTeams = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [created, joined, previous] = await Promise.all([
      Team.find({ owner: userId, status: { $ne: "Archived" } })
        .populate("owner", "name email college avatar")
        .populate("members.user", "name email college avatar skills"),
      Team.find({
        owner: { $ne: userId },
        "members.user": userId,
        status: { $ne: "Archived" },
      })
        .populate("owner", "name email college avatar")
        .populate("members.user", "name email college avatar skills"),
      Team.find({
        $or: [{ owner: userId }, { "members.user": userId }],
        status: { $in: ["Closed", "Archived"] },
      })
        .populate("owner", "name email college avatar")
        .populate("members.user", "name email college avatar skills"),
    ]);

    res.json({
      success: true,
      created,
      joined,
      previous,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a public comment / Q&A to a team
 * POST /api/teams/:id/comments
 */
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: "Comment text cannot be empty." });
    }

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    const comment = await Comment.create({
      team: team._id,
      author: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar,
      authorCollege: req.user.college,
      text: text.trim(),
    });

    // Notify team owner if comment is from another student
    if (team.owner.toString() !== req.user._id.toString()) {
      const notif = await Notification.create({
        recipient: team.owner,
        sender: req.user._id,
        title: "New Team Question / Comment",
        message: `${req.user.name} asked a question on "${team.name}".`,
        type: "comment",
        link: `/teams/${team._id}`,
        metadata: { teamId: team._id, commentId: comment._id },
      });

      const io = getIO();
      if (io) {
        io.to(`user:${team.owner.toString()}`).emit("notification:new", notif);
      }
    }

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};
