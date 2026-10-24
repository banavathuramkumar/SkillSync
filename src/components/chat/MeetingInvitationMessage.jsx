import React from "react";
import {
  Video,
  Users,
  Copy,
  ExternalLink,
  Check,
  Clock,
  Radio,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { formatTimeAgo } from "../../utils/formatters";
import { copyMeetingLinkToClipboard } from "../../services/api/meetingService";

export const MeetingInvitationMessage = ({
  message,
  currentUserId,
  onJoinMeeting,
}) => {
  const { meeting, senderName, senderAvatar, senderId, timestamp } = message;
  const isMe = currentUserId === senderId;
  const [copied, setCopied] = React.useState(false);

  const isGroup = meeting?.callType === "group";
  const isEnded = meeting?.status === "ended";

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!meeting?.meetingUrl) return;
    const ok = await copyMeetingLinkToClipboard(meeting.meetingUrl);
    if (ok) {
      setCopied(true);
      toast.success("Meeting link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy meeting link");
    }
  };

  const handleJoin = (e) => {
    e.stopPropagation();
    if (onJoinMeeting && meeting) {
      onJoinMeeting(meeting);
    }
  };

  return (
    <div
      className={`my-3 flex flex-col ${isMe ? "items-end" : "items-start"} max-w-full`}
    >
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-brand-blue/30 shadow-card hover:shadow-card-hover transition-all overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {isGroup ? (
                <Users className="w-4 h-4 text-white" />
              ) : (
                <Video className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {meeting?.title || (isGroup ? "Squad Group Meeting" : "Team Video Call")}
              </h4>
              <p className="text-[10px] text-blue-100 flex items-center gap-1 mt-0.5">
                <span>By {senderName}</span>
                <span>•</span>
                <span>{formatTimeAgo(timestamp)}</span>
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isEnded
                ? "bg-slate-700/60 text-slate-200"
                : "bg-emerald-400 text-slate-900 animate-pulse font-bold"
            }`}
          >
            <Radio className="w-2.5 h-2.5" />
            {isEnded ? "Ended" : "Meeting Link Available"}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3 bg-gradient-to-b from-blue-50/20 to-white">
          <div className="flex items-center justify-between text-xs text-brand-muted bg-slate-50 p-2.5 rounded-xl border border-brand-border">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Official Jitsi Room
              </span>
              <p className="text-xs font-mono font-medium text-slate-700 truncate">
                {meeting?.roomName}
              </p>
            </div>
            <a
              href={meeting?.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-brand-blue hover:bg-slate-200/60 transition-colors"
              title="Open meeting in external tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleJoin}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Meeting</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
              title="Copy meeting invitation link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingInvitationMessage;
