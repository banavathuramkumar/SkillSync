import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  PlusCircle,
  Copy,
  Check,
  XCircle,
  User,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { meetingService, copyMeetingLinkToClipboard } from "../../services/api/meetingService";
import { VideoMeetingModal } from "../chat/VideoMeetingModal";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import { formatDate } from "../../utils/formatters";

export const TeamMeetingsSection = ({ team, currentUser }) => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeCallMeeting, setActiveCallMeeting] = useState(null);

  // Scheduling Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("45");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamId = team?._id || team?.id;

  const fetchMeetings = async () => {
    if (!teamId) return;
    try {
      setIsLoading(true);
      const res = await meetingService.getTeamMeetings(teamId);
      setMeetings(res.meetings || []);
    } catch (err) {
      console.warn("[Meetings] Could not load meetings:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [teamId]);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) {
      toast.error("Please enter a meeting title, date, and start time.");
      return;
    }

    const scheduledStart = new Date(`${date}T${time}`);
    if (isNaN(scheduledStart.getTime())) {
      toast.error("Invalid date or time selected.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await meetingService.scheduleMeeting({
        teamId,
        title: title.trim(),
        description: description.trim(),
        scheduledStart: scheduledStart.toISOString(),
        durationMinutes: parseInt(duration, 10) || 45,
      });

      if (res.success) {
        toast.success("Team meeting scheduled! Teammates have been notified in real time.");
        setIsScheduleModalOpen(false);
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        fetchMeetings();
      }
    } catch (err) {
      toast.error(err.message || "Failed to schedule meeting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async (url) => {
    const success = await copyMeetingLinkToClipboard(url);
    if (success) {
      toast.success("Meeting link copied to clipboard!");
    } else {
      toast.error("Failed to copy link.");
    }
  };

  const handleCancelMeeting = async (meetingId) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled meeting?")) return;
    try {
      const res = await meetingService.cancelMeeting(meetingId, "Cancelled by team member");
      if (res.success) {
        toast.info("Meeting cancelled.");
        fetchMeetings();
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel meeting.");
    }
  };

  const isMemberOrOwner = Boolean(
    currentUser &&
      (team?.owner?._id === currentUser?.id ||
        team?.owner === currentUser?.id ||
        team?.ownerId === currentUser?.id ||
        team?.members?.some(
          (m) =>
            (m.user?._id || m.user?.id || m.userId || m.user) ===
            (currentUser?.id || currentUser?._id)
        ))
  );

  const upcomingMeetings = meetings.filter(
    (m) => m.status !== "cancelled" && m.status !== "completed"
  );
  const pastMeetings = meetings.filter(
    (m) => m.status === "cancelled" || m.status === "completed"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-brand-text">Team Video & Audio Meetings</h3>
          <p className="text-xs text-brand-muted">
            Coordinate synchronous syncs, sprint planning, and competition prep
          </p>
        </div>

        {isMemberOrOwner && (
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        )}
      </div>

      {/* Meetings List */}
      {isLoading ? (
        <div className="text-center py-12 text-xs text-brand-muted bg-slate-50 rounded-2xl border border-brand-border">
          Loading scheduled squad meetings...
        </div>
      ) : upcomingMeetings.length === 0 && pastMeetings.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
          <Video className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-brand-text">No Team Meetings Scheduled Yet</h4>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Plan your next hackathon brainstorming session or sprint sync with integrated Jitsi video calling.
          </p>
          {isMemberOrOwner && (
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-brand-blue bg-white border border-brand-border rounded-xl hover:bg-blue-50 transition-colors"
            >
              Schedule First Meeting
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingMeetings.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                Upcoming Meetings ({upcomingMeetings.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMeetings.map((meeting) => {
                  const mId = meeting._id || meeting.id;
                  const organizerName = meeting.organizer?.name || "Team Member";
                  const isOrganizer =
                    currentUser &&
                    (meeting.organizer?._id === currentUser.id ||
                      meeting.organizer === currentUser.id ||
                      meeting.organizer?.id === currentUser.id);

                  return (
                    <div
                      key={mId}
                      className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-bold text-brand-text truncate">
                            {meeting.title}
                          </h5>
                          <Badge variant="blue" size="sm">
                            {meeting.status}
                          </Badge>
                        </div>

                        {meeting.description && (
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {meeting.description}
                          </p>
                        )}

                        <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                            <span>{new Date(meeting.scheduledStart).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {new Date(meeting.scheduledStart).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              ({meeting.durationMinutes} mins)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Organized by {organizerName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-brand-border mt-4">
                        <button
                          onClick={() => setActiveCallMeeting(meeting)}
                          className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Meeting</span>
                        </button>

                        <button
                          onClick={() => handleCopyLink(meeting.meetingUrl)}
                          className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-100 border border-brand-border rounded-xl transition-colors"
                          title="Copy Meeting Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {isOrganizer && (
                          <button
                            onClick={() => handleCancelMeeting(mId)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-brand-border rounded-xl transition-colors"
                            title="Cancel Meeting"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pastMeetings.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Previous / Cancelled Meetings ({pastMeetings.length})
              </h4>
              <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-brand-border overflow-hidden">
                {pastMeetings.map((meeting) => (
                  <div
                    key={meeting._id || meeting.id}
                    className="p-4 flex items-center justify-between text-xs text-slate-500"
                  >
                    <div>
                      <p className="font-semibold text-brand-text">{meeting.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(meeting.scheduledStart).toLocaleDateString()} • {meeting.durationMinutes} mins
                      </p>
                    </div>
                    <Badge variant={meeting.status === "cancelled" ? "default" : "success"} size="sm">
                      {meeting.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Squad Video Meeting"
        subtitle={`Schedule an upcoming call for ${team?.name}`}
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SIH Architecture Sync & Task Allocation"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Agenda & Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will be reviewed during this session..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Expected Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            >
              <option value="15">15 Minutes (Standup)</option>
              <option value="30">30 Minutes (Quick Sync)</option>
              <option value="45">45 Minutes (Standard Meeting)</option>
              <option value="60">60 Minutes (Deep Dive / Sprint)</option>
              <option value="90">90 Minutes (Hackathon Prep)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50 rounded-xl transition-all shadow-sm"
            >
              {isSubmitting ? "Scheduling..." : "Confirm & Notify Teammates"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Embedded Real Jitsi Video Call Modal */}
      {activeCallMeeting && (
        <VideoMeetingModal
          isOpen={!!activeCallMeeting}
          onClose={() => setActiveCallMeeting(null)}
          meeting={activeCallMeeting}
          currentUser={currentUser}
          chatTitle={team?.name}
        />
      )}
    </div>
  );
};

export default TeamMeetingsSection;
