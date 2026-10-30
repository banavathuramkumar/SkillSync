import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  Lock,
  ExternalLink,
  Users,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";
import { formatTimeAgo } from "../../utils/formatters";
import { UserAvatar } from "../common/UserAvatar";
import { VideoMeetingModal } from "./VideoMeetingModal";
import { MeetingInvitationMessage } from "./MeetingInvitationMessage";
import {
  generateMeetingRoomName,
  getMeetingUrl,
} from "../../services/api/meetingService";

export const ChatWindow = ({
  conversation,
  messages = [],
  onSendMessage,
  isAuthorized = true,
}) => {
  const { user } = useAuthStore();
  const { activeMeetings, sendMeetingInvitation, endMeeting } = useMessageStore();

  const [inputText, setInputText] = useState("");
  const [currentMeetingModal, setCurrentMeetingModal] = useState(null);
  const messagesEndRef = useRef(null);

  const convId = conversation?._id || conversation?.id;
  const teamId =
    conversation?.team?._id || conversation?.team?.id || conversation?.teamId;
  const teamName =
    conversation?.team?.name ||
    conversation?.name ||
    conversation?.teamName ||
    "Team Channel";

  const activeMeetingForThisChat = convId ? activeMeetings[convId] : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  /**
   * Start a real Jitsi video call or group meeting
   */
  const handleStartCall = async ({ callType, title }) => {
    if (!convId || !user) return;

    const roomName = generateMeetingRoomName(teamName, callType);
    const meetingUrl = getMeetingUrl(roomName);

    const meetingData = {
      roomName,
      meetingUrl,
      title,
      callType,
    };

    // 1. Post meeting invitation card inside conversation message history
    await sendMeetingInvitation(convId, meetingData);

    // 2. Open embedded Jitsi conference modal for current user
    setCurrentMeetingModal({
      ...meetingData,
      conversationId: convId,
    });

    toast.success(
      `${callType === "group" ? "Group meeting" : "Video call"} launched! Invitation posted to team chat.`
    );
  };

  /**
   * Join an ongoing meeting from toolbar or chat invitation card
   */
  const handleJoinMeeting = (meeting) => {
    if (!meeting) return;
    setCurrentMeetingModal({
      ...meeting,
      conversationId: convId,
    });
  };

  const handleMeetingEnded = (meeting) => {
    if (convId && meeting?.roomName) {
      endMeeting(convId);
    }
    setCurrentMeetingModal(null);
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <Users className="w-12 h-12 text-slate-300 mb-3" />
        <h4 className="text-base font-semibold text-brand-text mb-1">
          Select a Team Channel
        </h4>
        <p className="text-xs text-brand-muted max-w-sm">
          Choose a team from the left sidebar to coordinate tasks, review submissions, and chat with confirmed teammates.
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-200">
          <Lock className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-brand-text mb-1">
          Private Team Room
        </h4>
        <p className="text-xs text-brand-muted max-w-sm mb-4 leading-relaxed">
          Access to this team channel is restricted to confirmed members and the team leader. Pending applicants cannot view team messages or join video calls.
        </p>
        {teamId && (
          <Link
            to={`/teams/${teamId}`}
            className="px-4 py-2 bg-brand-blue text-white text-xs font-semibold rounded-xl"
          >
            View Team Page
          </Link>
        )}
      </div>
    );
  }

  const participantsCount =
    conversation.participants?.length ||
    conversation.participantIds?.length ||
    conversation.team?.members?.length ||
    1;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 relative">
      {/* Channel Header with Video/Group Call Toolbar */}
      <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-brand-border flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-brand-text truncate">
              {teamName}
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
              <Lock className="w-2.5 h-2.5" />
              Authorized Room
            </span>
          </div>
          <p className="text-[11px] text-brand-muted truncate">
            {participantsCount} confirmed teammates
          </p>
        </div>

        {/* Right Header Actions: Call Buttons & Details */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Audio / Video / Group Call Toolbar */}
          <ChatCallToolbar
            conversation={{ ...conversation, teamName }}
            activeMeeting={activeMeetingForThisChat}
            onStartCall={handleStartCall}
            onJoinMeeting={handleJoinMeeting}
            disabled={!isAuthorized}
          />

          {teamId && (
            <Link
              to={`/teams/${teamId}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-blue bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="View Team Page"
            >
              <span className="hidden lg:inline">Team Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl flex items-start gap-2 text-[11px] text-brand-blue">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Real-time chat & Jitsi video meetings enabled. Messages and meeting invitations are saved to the persistent database.
          </p>
        </div>

        {messages.map((msg) => {
          const msgId = msg._id || msg.id;

          // If message is a Meeting Invitation Card
          if (msg.type === "meeting_invitation") {
            return (
              <MeetingInvitationMessage
                key={msgId}
                message={msg}
                currentUserId={user?._id || user?.id}
                onJoinMeeting={handleJoinMeeting}
              />
            );
          }

          // If message is a system message
          if (msg.type === "system") {
            return (
              <div
                key={msgId}
                className="text-center my-2 text-[11px] text-slate-400 font-medium py-1 px-3 bg-slate-100 rounded-full inline-block mx-auto"
              >
                {msg.text}
              </div>
            );
          }

          const senderId =
            msg.sender?._id || msg.sender?.id || msg.senderId || msg.sender;
          const isMe =
            user &&
            senderId &&
            senderId.toString() === (user._id || user.id).toString();

          const senderName =
            msg.senderName || msg.sender?.name || (isMe ? "You" : "Teammate");
          const senderAvatar =
            msg.senderAvatar ||
            msg.sender?.avatar ||
            "";

          return (
            <div
              key={msgId}
              className={`flex items-start gap-3 ${
                isMe ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <UserAvatar
                user={msg.sender?.name ? msg.sender : { name: senderName, avatar: senderAvatar }}
                size="sm"
                className="w-8 h-8 rounded-full mt-1 flex-shrink-0"
              />

              <div
                className={`max-w-[75%] sm:max-w-md ${
                  isMe ? "items-end" : "items-start"
                } flex flex-col`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-brand-text">
                    {senderName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatTimeAgo(msg.createdAt || msg.timestamp)}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? "bg-brand-blue text-white rounded-tr-none shadow-sm"
                      : "bg-white text-slate-800 border border-brand-border rounded-tl-none shadow-subtle"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 bg-white border-t border-brand-border flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${teamName}...`}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-brand-border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-40 text-white rounded-xl shadow-sm transition-all flex-shrink-0 active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Embedded Real Jitsi Video Call Modal with Minimize & Popout */}
      {currentMeetingModal && (
        <VideoMeetingModal
          isOpen={!!currentMeetingModal}
          onClose={() => handleMeetingEnded(currentMeetingModal)}
          meeting={currentMeetingModal}
          currentUser={user}
          chatTitle={teamName}
        />
      )}
    </div>
  );
};

export default ChatWindow;
