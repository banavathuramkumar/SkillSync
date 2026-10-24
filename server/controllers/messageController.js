import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { Team } from "../models/Team.js";
import { getIO } from "../sockets/socketHandler.js";

/**
 * Get all conversations for the authenticated user
 * GET /api/messages/conversations
 */
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Retrieve teams where user is owner or accepted member
    const userTeams = await Team.find({
      $or: [{ owner: userId }, { "members.user": userId }],
    });

    const userTeamIds = userTeams.map((t) => t._id);

    // Retrieve conversations for these teams or direct chats
    const conversations = await Conversation.find({
      $or: [{ team: { $in: userTeamIds } }, { participants: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate("team", "name category status maxMembers members owner")
      .populate("participants", "name email college avatar");

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get messages for a specific conversation
 * GET /api/messages/conversations/:id/messages
 */
export const getMessages = async (req, res, next) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, error: "Conversation not found." });
    }

    // Verify user authorization: must be in participants or accepted team member
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );

    if (!isParticipant) {
      if (conversation.team) {
        const team = await Team.findById(conversation.team);
        const isTeamMember =
          team &&
          (team.owner.toString() === userId.toString() ||
            team.members.some((m) => m.user.toString() === userId.toString()));

        if (!isTeamMember) {
          return res.status(403).json({
            success: false,
            error: "Access denied. Only confirmed squad members can view this channel.",
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          error: "Access denied to this private conversation.",
        });
      }
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message
 * POST /api/messages/conversations/:id/messages
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { id: conversationId } = req.params;
    const { text, type = "text", meeting } = req.body;
    const user = req.user;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: "Message text cannot be empty." });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, error: "Conversation not found." });
    }

    // Authorization check
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === user._id.toString()
    );

    if (!isParticipant) {
      if (conversation.team) {
        const team = await Team.findById(conversation.team);
        const isTeamMember =
          team &&
          (team.owner.toString() === user._id.toString() ||
            team.members.some((m) => m.user.toString() === user._id.toString()));

        if (!isTeamMember) {
          return res.status(403).json({
            success: false,
            error: "Access denied. Only confirmed squad members can send messages in this channel.",
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          error: "Access denied to this private conversation.",
        });
      }
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: user._id,
      senderName: user.name,
      senderAvatar: user.avatar,
      text: text.trim(),
      type,
      meeting: meeting || undefined,
    });

    // Update conversation lastMessage
    conversation.lastMessage = {
      text: message.text,
      senderName: user.name,
      timestamp: message.createdAt,
      type: message.type,
    };
    await conversation.save();

    // Broadcast in real-time via Socket.IO
    const io = getIO();
    if (io) {
      io.to(`conversation:${conversationId}`).emit("message:new", message);
      // Also broadcast directly to participants' personal notification rooms for instant delivery
      if (conversation.participants && Array.isArray(conversation.participants)) {
        conversation.participants.forEach((p) => {
          const pId = p._id ? p._id.toString() : p.toString();
          io.to(`user:${pId}`).emit("message:new", message);
        });
      }
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get or initialize conversation for a specific team
 * GET /api/messages/conversations/team/:teamId
 */
export const getTeamConversation = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found." });
    }

    // Check membership
    const isMember =
      team.owner.toString() === userId.toString() ||
      team.members.some((m) => m.user.toString() === userId.toString());

    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Only confirmed squad members can access this team chat.",
      });
    }

    let conversation = await Conversation.findOne({ team: teamId })
      .populate("team", "name category status maxMembers members owner")
      .populate("participants", "name email college avatar");

    if (!conversation) {
      const allParticipants = [team.owner, ...team.members.map((m) => m.user)];
      conversation = await Conversation.create({
        team: team._id,
        name: team.name,
        type: "team",
        participants: allParticipants,
        lastMessage: {
          text: `Team "${team.name}" conversation initialized.`,
          senderName: "System",
          timestamp: new Date(),
          type: "system",
        },
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("team", "name category status maxMembers members owner")
        .populate("participants", "name email college avatar");
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};
