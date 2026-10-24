import { JoinRequest } from "../models/JoinRequest.js";
import { Team } from "../models/Team.js";
import { Conversation } from "../models/Conversation.js";
import { Notification } from "../models/Notification.js";
import { getIO } from "../sockets/socketHandler.js";

/**
 * Submit a join request for a team
 * POST /api/requests
 */
export const createJoinRequest = async (req, res, next) => {
  try {
    const { teamId, role, message } = req.body;
    const applicantId = req.user._id;

    if (!teamId || !role) {
      return res.status(400).json({
        success: false,
        error: "Team identifier and requested role are required.",
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: "Target squad was not found." });
    }

    // 1. Prevent team owner from applying to own team
    if (team.owner.toString() === applicantId.toString()) {
      return res.status(400).json({
        success: false,
        error: "You are the squad leader of this team and cannot apply as an applicant.",
      });
    }

    // 2. Prevent already accepted members from applying
    const isAlreadyMember = team.members.some(
      (m) => m.user.toString() === applicantId.toString()
    );
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        error: "You are already a confirmed member of this squad.",
      });
    }

    // 3. Verify team is currently recruiting
    if (team.status !== "Recruiting") {
      return res.status(400).json({
        success: false,
        error: "This team has closed recruitment and is not currently accepting applications.",
      });
    }

    // 4. Verify capacity
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        error: "This team has reached its maximum roster capacity.",
      });
    }

    // 5. Prevent duplicate pending requests
    const existingPending = await JoinRequest.findOne({
      team: teamId,
      applicant: applicantId,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        error: "You already have a pending application awaiting squad leader review for this team.",
      });
    }

    // 6. Create Join Request
    const joinRequest = await JoinRequest.create({
      team: teamId,
      applicant: applicantId,
      role: role.trim(),
      message: message ? message.trim() : "",
      status: "pending",
    });

    // 7. Create persistent in-app notification for Team Leader
    const leaderNotification = await Notification.create({
      recipient: team.owner,
      sender: applicantId,
      title: "New Team Join Request",
      message: `${req.user.name} applied for the "${role}" position on "${team.name}".`,
      type: "join_request",
      link: `/teams/${team._id}`,
      metadata: {
        teamId: team._id,
        teamName: team.name,
        requestId: joinRequest._id,
        applicantId: applicantId,
        applicantName: req.user.name,
        role: role.trim(),
      },
    });

    // 8. Deliver in real time via Socket.IO if leader is connected
    const io = getIO();
    if (io) {
      io.to(`user:${team.owner.toString()}`).emit(
        "notification:new",
        leaderNotification
      );
    }

    const populatedRequest = await JoinRequest.findById(joinRequest._id)
      .populate("team", "name competitionName status maxMembers")
      .populate(
        "applicant",
        "name email college educationLevel skills bio avatar resumeUrl githubUrl linkedinUrl"
      );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully! The team leader has been notified.",
      request: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all join requests for a specific team (Leader only)
 * GET /api/requests/team/:teamId
 */
export const getTeamRequests = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only the squad leader can view candidate applications.",
      });
    }

    const requests = await JoinRequest.find({ team: teamId })
      .sort({ createdAt: -1 })
      .populate(
        "applicant",
        "name email college educationLevel state city skills bio avatar resumeUrl resumeFilename githubUrl linkedinUrl leetcodeUrl"
      );

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's submitted applications
 * GET /api/requests/my
 */
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await JoinRequest.find({ applicant: req.user._id })
      .sort({ createdAt: -1 })
      .populate("team", "name competitionName status maxMembers members deadline owner");

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept or reject a join request (Team Leader only)
 * PUT /api/requests/:id/decision
 */
export const respondToJoinRequest = async (req, res, next) => {
  try {
    const { decision } = req.body; // "accepted" | "rejected"
    const requestId = req.params.id;

    if (!["accepted", "rejected"].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: "Decision must be either 'accepted' or 'rejected'.",
      });
    }

    const request = await JoinRequest.findById(requestId).populate("applicant");
    if (!request) {
      return res.status(404).json({ success: false, error: "Application request not found." });
    }

    const team = await Team.findById(request.team);
    if (!team) {
      return res.status(404).json({ success: false, error: "Associated team not found." });
    }

    // Verify current user is team leader
    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only the team leader can review applications.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: `This application has already been ${request.status}.`,
      });
    }

    const io = getIO();

    if (decision === "accepted") {
      // Check capacity
      if (team.members.length >= team.maxMembers) {
        return res.status(400).json({
          success: false,
          error: "Cannot accept applicant: team has already reached maximum capacity.",
        });
      }

      // Concurrency check: make sure applicant is not already in members
      const alreadyMember = team.members.some(
        (m) => m.user.toString() === request.applicant._id.toString()
      );

      if (!alreadyMember) {
        team.members.push({
          user: request.applicant._id,
          role: request.role,
          joinedAt: new Date(),
          isOwner: false,
        });

        // Close recruitment if team reached capacity
        if (team.members.length >= team.maxMembers) {
          team.status = "Closed";
        }

        await team.save();

        // Add applicant to team chat conversation participants
        await Conversation.findOneAndUpdate(
          { team: team._id },
          { $addToSet: { participants: request.applicant._id } }
        );
      }

      request.status = "accepted";
      request.reviewedAt = new Date();
      request.reviewedBy = req.user._id;
      await request.save();

      // Send real-time notification to applicant
      const notif = await Notification.create({
        recipient: request.applicant._id,
        sender: req.user._id,
        title: "Application Accepted! 🎉",
        message: `Congratulations! Your request to join "${team.name}" as "${request.role}" was accepted. Team Chat and Meetings are now unlocked.`,
        type: "join_accepted",
        link: `/teams/${team._id}`,
        metadata: { teamId: team._id, role: request.role },
      });

      if (io) {
        io.to(`user:${request.applicant._id.toString()}`).emit(
          "notification:new",
          notif
        );
      }

      return res.json({
        success: true,
        message: `Successfully accepted ${request.applicant.name} into ${team.name}!`,
        request,
      });
    } else {
      // Rejected
      request.status = "rejected";
      request.reviewedAt = new Date();
      request.reviewedBy = req.user._id;
      await request.save();

      // Send notification to applicant
      const notif = await Notification.create({
        recipient: request.applicant._id,
        sender: req.user._id,
        title: "Application Status Update",
        message: `Your application to join "${team.name}" for "${request.role}" was not accepted at this time.`,
        type: "join_rejected",
        link: `/teams/${team._id}`,
        metadata: { teamId: team._id },
      });

      if (io) {
        io.to(`user:${request.applicant._id.toString()}`).emit(
          "notification:new",
          notif
        );
      }

      return res.json({
        success: true,
        message: `Application declined.`,
        request,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Withdraw a pending application (Applicant only)
 * DELETE /api/requests/:id
 */
export const withdrawJoinRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "Application not found." });
    }

    if (request.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. You can only withdraw your own applications.",
      });
    }

    request.status = "withdrawn";
    await request.save();

    res.json({
      success: true,
      message: "Application successfully withdrawn.",
    });
  } catch (error) {
    next(error);
  }
};
