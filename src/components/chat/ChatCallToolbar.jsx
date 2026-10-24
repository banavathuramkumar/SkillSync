import React, { useState } from "react";
import {
  Video,
  Users,
  PhoneCall,
  Link2,
  Copy,
  ExternalLink,
  Radio,
  Check,
  Shield,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../common/Modal";
import { copyMeetingLinkToClipboard } from "../../services/api/meetingService";

export const ChatCallToolbar = ({
  conversation,
  activeMeeting,
  onStartCall,
  onJoinMeeting,
  disabled = false,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [callType, setCallType] = useState("direct"); // "direct" | "group"
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const teamName = conversation?.teamName || "Team";

  const handleOpenConfirm = (type) => {
    setCallType(type);
    setMeetingTitle(
      type === "group" ? `${teamName} — Squad Sync` : `${teamName} — Video Call`
    );
    setIsConfirmOpen(true);
  };

  const handleConfirmStart = () => {
    setIsConfirmOpen(false);
    if (onStartCall) {
      onStartCall({
        callType,
        title: meetingTitle.trim() || `${teamName} Meeting`,
      });
    }
  };

  const handleCopyActiveLink = async () => {
    if (!activeMeeting?.meetingUrl) return;
    const ok = await copyMeetingLinkToClipboard(activeMeeting.meetingUrl);
    if (ok) {
      setCopied(true);
      toast.success("Meeting link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Active Call Indicator Pill (if an active call exists for this chat) */}
        {activeMeeting && (
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl text-xs">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse flex-shrink-0" />
            <button
              onClick={() => onJoinMeeting(activeMeeting)}
              className="font-bold hover:underline truncate max-w-[100px] sm:max-w-[140px]"
              title="Click to rejoin active meeting"
            >
              Live Meeting
            </button>
            <button
              onClick={() => setIsDetailsOpen(true)}
              className="p-0.5 hover:text-emerald-950 rounded"
              title="Meeting Details"
            >
              <Link2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* 1. Audio / Video Call Button */}
        <button
          onClick={() => handleOpenConfirm("direct")}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-blue bg-slate-50 hover:bg-blue-50/70 border border-brand-border hover:border-blue-200 rounded-xl transition-all shadow-subtle active:scale-95 disabled:opacity-40"
          title="Start Audio/Video Call"
          aria-label="Start Audio/Video Call"
        >
          <Video className="w-3.5 h-3.5 text-brand-blue" />
          <span className="hidden sm:inline">Call</span>
        </button>

        {/* 2. Group Meeting Button */}
        <button
          onClick={() => handleOpenConfirm("group")}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-blue bg-slate-50 hover:bg-blue-50/70 border border-brand-border hover:border-blue-200 rounded-xl transition-all shadow-subtle active:scale-95 disabled:opacity-40"
          title="Start Group Meeting"
          aria-label="Start Group Meeting"
        >
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline">Group Call</span>
        </button>

        {/* 3. Meeting Details / Link Button */}
        {activeMeeting && (
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-slate-100 rounded-xl transition-colors border border-brand-border"
            title="View Meeting Details & Link"
            aria-label="View Meeting Details & Link"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Confirmation Dialog before starting call */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={callType === "group" ? "Start Group Meeting" : "Start Video Call"}
        subtitle={`Connect with teammates from ${teamName}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-start gap-3 text-xs text-brand-blue">
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-blue" />
            <p className="leading-relaxed">
              This initiates a real video conference room powered by <strong>Jitsi Meet</strong>. All confirmed teammates in this channel will receive an invitation card to join.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Meeting Topic / Title
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g. Sprint Review, SIH Brainstorming, Code Sync"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-brand-border">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmStart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Start Call Now</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Meeting Details Modal */}
      {activeMeeting && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title="Active Meeting Details"
          subtitle={activeMeeting.title || teamName}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-brand-border space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Direct Meeting Link
              </span>
              <p className="text-xs font-mono font-medium text-slate-800 break-all bg-white p-2 rounded-lg border border-slate-200 select-all">
                {activeMeeting.meetingUrl}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-brand-muted">
              <span>Host: <strong>{activeMeeting.startedByName || "Teammate"}</strong></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                Active Link
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-brand-border">
              <button
                onClick={handleCopyActiveLink}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>

              <button
                onClick={() => {
                  setIsDetailsOpen(false);
                  onJoinMeeting(activeMeeting);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join in App</span>
              </button>

              <a
                href={activeMeeting.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200"
                title="Open in new browser tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ChatCallToolbar;
