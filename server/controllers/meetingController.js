import crypto from "crypto";
import { Meeting } from "../models/Meeting.js";
import { Team } from "../models/Team.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { Notification } from "../models/Notification.js";
import { getIO } from "../sockets/socketHandler.js";

const generateRoomName = (teamName, callType) => {
  const sanitized = (teamName || "SkillSync")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 15);
  const hash = crypto.randomBytes(4).toString("hex");
  return `SkillSync-${sanitized}-${callType === "group" ? "Group" : "Call"}-${hash}`;
};

/**
 * Start an instant audio/video meeting
 * POST /api/meetings/instant
 */
export const createInstantMeeting = async (req, res, next) => {
  try {
    const { teamId, title, callType = "group" } = req.body;
    const user = req.user;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    // Verify user is accepted member or owner
    const isMember =
      team.owner.toString() === user._id.toString() ||
      team.members.some((m) => m.user.toString() === user._id.toString());

    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Only confirmed squad members can initiate meetings.",
      });
    }

    const roomName = generateRoomName(team.name, callType);
    const meetingUrl = `https://meet.jit.si/${encodeURIComponent(roomName)}`;

    const meeting = await Meeting.create({
      team: team._id,
      organizer: user._id,
      title: title || `${team.name} ${callType === "group" ? "Squad Meeting" : "Call"}`,
      callType,
      roomName,
      meetingUrl,
      scheduledStart: new Date(),
      status: "available",
    });

    // Find team conversation and post invitation card
    const conversation = await Conversation.findOne({ team: team._id });
    if (conversation) {
      const inviteMsg = await Message.create({
        conversation: conversation._id,
        sender: user._id,
        senderName: user.name,
        senderAvatar: user.avatar,
        text: `📹 ${callType === "group" ? "Team Group Meeting" : "Video Call"} started by ${user.name}`,
        type: "meeting_invitation",
        meeting: {
          meetingId: meeting._id,
          roomName,
          meetingUrl,
          title: meeting.title,
          callType,
          status: "available",
          startedAt: new Date(),
          startedByName: user.name,
          startedByAvatar: user.avatar,
        },
      });

      conversation.lastMessage = {
        text: inviteMsg.text,
        senderName: user.name,
        timestamp: inviteMsg.createdAt,
        type: "meeting_invitation",
      };
      await conversation.save();

      const io = getIO();
      if (io) {
        io.to(`conversation:${conversation._id}`).emit("message:new", inviteMsg);
      }
    }

    // Send notifications to all other team members
    const otherMemberIds = team.members
      .map((m) => m.user.toString())
      .filter((id) => id !== user._id.toString());

    if (team.owner.toString() !== user._id.toString() && !otherMemberIds.includes(team.owner.toString())) {
      otherMemberIds.push(team.owner.toString());
    }

    const io = getIO();
    for (const memberId of otherMemberIds) {
      const notif = await Notification.create({
        recipient: memberId,
        sender: user._id,
        title: "Live Meeting Started",
        message: `${user.name} started a live video meeting for "${team.name}". Join now!`,
        type: "meeting",
        link: `/messages`,
        metadata: { teamId: team._id, meetingId: meeting._id },
      });

      if (io) {
        io.to(`user:${memberId}`).emit("notification:new", notif);
      }
    }

    res.status(201).json({
      success: true,
      meeting,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Schedule a future team meeting
 * POST /api/meetings/schedule
 */
export const scheduleMeeting = async (req, res, next) => {
  try {
    const { teamId, title, description, scheduledStart, durationMinutes = 45 } = req.body;
    const user = req.user;

    if (!teamId || !title || !scheduledStart) {
      return res.status(400).json({
        success: false,
        error: "Team identifier, meeting title, and scheduled date/time are required.",
      });
    }

    const startDate = new Date(scheduledStart);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ success: false, error: "Invalid meeting date format." });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    // Verify membership
    const isMember =
      team.owner.toString() === user._id.toString() ||
      team.members.some((m) => m.user.toString() === user._id.toString());

    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Only confirmed squad members can schedule team meetings.",
      });
    }

    const roomName = generateRoomName(team.name, "group");
    const meetingUrl = `https://meet.jit.si/${encodeURIComponent(roomName)}`;

    const duration = parseInt(durationMinutes, 10) || 45;
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

    const meeting = await Meeting.create({
      team: team._id,
      organizer: user._id,
      title: title.trim(),
      description: description ? description.trim() : "",
      callType: "group",
      roomName,
      meetingUrl,
      scheduledStart: startDate,
      scheduledEnd: endDate,
      durationMinutes: duration,
      status: "scheduled",
    });

    // Send notifications to all other team members
    const otherMemberIds = team.members
      .map((m) => m.user.toString())
      .filter((id) => id !== user._id.toString());

    if (team.owner.toString() !== user._id.toString() && !otherMemberIds.includes(team.owner.toString())) {
      otherMemberIds.push(team.owner.toString());
    }

    const io = getIO();
    for (const memberId of otherMemberIds) {
      const notif = await Notification.create({
        recipient: memberId,
        sender: user._id,
        title: "Team Meeting Scheduled",
        message: `"${title}" has been scheduled for "${team.name}" on ${startDate.toLocaleString()}.`,
        type: "meeting",
        link: `/teams/${team._id}`,
        metadata: { teamId: team._id, meetingId: meeting._id },
      });

      if (io) {
        io.to(`user:${memberId}`).emit("notification:new", notif);
      }
    }

    res.status(201).json({
      success: true,
      message: "Team meeting scheduled successfully!",
      meeting,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get meetings for a specific team
 * GET /api/meetings/team/:teamId
 */
export const getTeamMeetings = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const user = req.user;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    const isMember =
      team.owner.toString() === user._id.toString() ||
      team.members.some((m) => m.user.toString() === user._id.toString());

    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Only confirmed squad members can view team meetings.",
      });
    }

    const meetings = await Meeting.find({ team: teamId })
      .sort({ scheduledStart: 1 })
      .populate("organizer", "name email college avatar");

    res.json({
      success: true,
      meetings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a scheduled meeting (Organizer or Team Leader only)
 * PUT /api/meetings/:id/cancel
 */
export const cancelMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, error: "Meeting not found." });
    }

    const team = await Team.findById(meeting.team);
    const isOrganizer = meeting.organizer.toString() === req.user._id.toString();
    const isTeamOwner = team && team.owner.toString() === req.user._id.toString();

    if (!isOrganizer && !isTeamOwner) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized. Only the organizer or squad leader can cancel this meeting.",
      });
    }

    meeting.status = "cancelled";
    meeting.cancelledReason = req.body.reason || "Cancelled by organizer";
    await meeting.save();

    // Notify members of cancellation
    if (team) {
      const otherMemberIds = team.members
        .map((m) => m.user.toString())
        .filter((id) => id !== req.user._id.toString());

      const io = getIO();
      for (const memberId of otherMemberIds) {
        const notif = await Notification.create({
          recipient: memberId,
          sender: req.user._id,
          title: "Meeting Cancelled",
          message: `The meeting "${meeting.title}" for "${team.name}" has been cancelled.`,
          type: "meeting",
          link: `/teams/${team._id}`,
          metadata: { teamId: team._id, meetingId: meeting._id },
        });

        if (io) {
          io.to(`user:${memberId}`).emit("notification:new", notif);
        }
      }
    }

    res.json({
      success: true,
      message: "Meeting cancelled.",
      meeting,
    });
  } catch (error) {
    next(error);
  }
};
