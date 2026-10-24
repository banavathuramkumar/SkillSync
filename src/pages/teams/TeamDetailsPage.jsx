import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Users,
  Trophy,
  Calendar,
  MapPin,
  Bookmark,
  Share2,
  Lock,
  MessageSquare,
  CheckCircle2,
  Clock,
  Video,
  Layers,
  Sparkles,
  AlertCircle,
  Trash2,
  Power,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { useTeamStore } from "../../store/useTeamStore";
import { useMessageStore } from "../../store/useMessageStore";
import { Badge } from "../../components/common/Badge";
import { CommentSection } from "../../components/teams/CommentSection";
import { JoinRequestModal } from "../../components/teams/JoinRequestModal";
import { ApplicantReviewModal } from "../../components/teams/ApplicantReviewModal";
import { TeamChatDrawer } from "../../components/chat/TeamChatDrawer";
import { TeamMeetingsSection } from "../../components/teams/TeamMeetingsSection";
import { formatDate } from "../../utils/formatters";

export const TeamDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentTeam,
    comments,
    joinRequests,
    savedTeamIds,
    fetchTeamById,
    fetchTeamRequests,
    deleteTeam,
    toggleRecruitmentStatus,
    toggleSaveTeam,
    isLoading,
  } = useTeamStore();
  const { setActiveConversation } = useMessageStore();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "members" | "meetings" | "discussion" | "requests"
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedApplicantReq, setSelectedApplicantReq] = useState(null);
  const [isTeamChatOpen, setIsTeamChatOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTeamById(id);
    }
  }, [id, fetchTeamById]);

  const team = currentTeam;

  const teamId = team?._id || team?.id;
  const ownerId = team?.owner?._id || team?.owner?.id || team?.ownerId || team?.owner;
  const currentUserId = user?._id || user?.id;

  const isOwner = Boolean(
    user && ownerId && ownerId.toString() === currentUserId?.toString()
  );

  const isMember = Boolean(
    user &&
      team?.members?.some((m) => {
        const mId = m.user?._id || m.user?.id || m.userId || m.user;
        return mId && mId.toString() === currentUserId?.toString();
      })
  );

  // Fetch pending requests for this team if owner
  useEffect(() => {
    if (isOwner && teamId) {
      fetchTeamRequests(teamId);
    }
  }, [isOwner, teamId, fetchTeamRequests]);

  if (isLoading && !team) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-brand-border p-8">
        <p className="text-xs text-brand-muted">Loading team details...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-brand-border p-8">
        <h3 className="text-lg font-bold text-brand-text mb-2">Team Not Found</h3>
        <p className="text-xs text-brand-muted mb-4">
          This team may have been removed or the link is incorrect.
        </p>
        <Link
          to="/teams"
          className="px-4 py-2 bg-brand-blue text-white text-xs font-semibold rounded-xl"
        >
          Back to Find Teams
        </Link>
      </div>
    );
  }

  const isSaved = savedTeamIds.includes(teamId);
  const members = team.members || [];
  const maxMembers = team.maxMembers || 4;

  const teamJoinRequests = joinRequests.filter((r) => r.status === "pending");

  const handleToggleRecruitment = async () => {
    const res = await toggleRecruitmentStatus(teamId);
    if (res.success) {
      toast.success(
        res.status === "Recruiting"
          ? "Recruitment reopened!"
          : "Recruitment closed for this squad."
      );
    }
  };

  const handleDeleteTeam = async () => {
    if (
      window.confirm(
        `Are you sure you want to permanently disband "${team.name}"?`
      )
    ) {
      const res = await deleteTeam(teamId);
      if (res.success) {
        toast.info("Team disbanded.");
        navigate("/teams");
      }
    }
  };

  const handleOpenChat = () => {
    setIsTeamChatOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wide">
                {team.competitionName}
              </span>
              <span className="text-slate-300">•</span>
              <Badge
                variant={
                  team.status === "Recruiting"
                    ? "success"
                    : team.status === "Closed"
                    ? "warning"
                    : "default"
                }
              >
                {team.status}
              </Badge>
              <Badge variant="default">{team.category}</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
              {team.name}
            </h1>

            {team.projectTitle && (
              <p className="text-sm font-semibold text-slate-800">
                {team.projectTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {team.format} ({team.state || "India"})
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Deadline: {formatDate(team.deadline)}
              </span>
              <span className="flex items-center gap-1.5 text-brand-blue font-semibold">
                <Users className="w-3.5 h-3.5" />
                {members.length} / {maxMembers} Members
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                toggleSaveTeam(teamId);
                toast.success(isSaved ? "Team removed from bookmarks" : "Team saved to bookmarks!");
              }}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSaved
                  ? "bg-blue-50 text-brand-blue border-blue-200"
                  : "bg-white text-slate-600 border-brand-border hover:bg-slate-50"
              }`}
              title="Bookmark team"
              aria-label="Bookmark team"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-brand-blue" : ""}`} />
            </button>

            {/* If Member/Owner: Open Chat */}
            {(isOwner || isMember) && (
              <button
                onClick={handleOpenChat}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Team Chat</span>
              </button>
            )}

            {/* If Non-member: Request to Join */}
            {!isOwner && !isMember && (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                disabled={members.length >= maxMembers || team.status === "Closed"}
                className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                {members.length >= maxMembers ? "Squad Full" : "Apply to Join"}
              </button>
            )}

            {/* Owner Settings Actions */}
            {isOwner && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleRecruitment}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{team.status === "Recruiting" ? "Close Recruitment" : "Reopen Recruitment"}</span>
                </button>

                <button
                  onClick={handleDeleteTeam}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-brand-border rounded-xl transition-colors"
                  title="Disband Team"
                  aria-label="Disband Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 border-b border-brand-border -mb-6 pb-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-brand-blue text-brand-blue"
                : "border-transparent text-slate-500 hover:text-brand-text"
            }`}
          >
            Project Overview
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "members"
                ? "border-brand-blue text-brand-blue"
                : "border-transparent text-slate-500 hover:text-brand-text"
            }`}
          >
            Team Members ({members.length})
          </button>

          <button
            onClick={() => setActiveTab("meetings")}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "meetings"
                ? "border-brand-blue text-brand-blue"
                : "border-transparent text-slate-500 hover:text-brand-text"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Meetings</span>
          </button>

          <button
            onClick={() => setActiveTab("discussion")}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "discussion"
                ? "border-brand-blue text-brand-blue"
                : "border-transparent text-slate-500 hover:text-brand-text"
            }`}
          >
            Discussion ({comments.length})
          </button>

          {/* Join Requests tab visible to owner */}
          {isOwner && (
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "requests"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-slate-500 hover:text-brand-text"
              }`}
            >
              <span>Join Requests</span>
              {teamJoinRequests.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-bold">
                  {teamJoinRequests.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
              <div>
                <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
                  Problem Statement
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {team.problemStatement || team.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
                  Project Description & Vision
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-blue-50/40 p-4 rounded-2xl border border-blue-100">
                  {team.description}
                </p>
              </div>
            </div>

            {/* Tech Stack & Required Skills */}
            <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
              <div>
                <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
                  Required Teammate Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {team.requiredSkills?.map((sk) => (
                    <Badge key={sk} variant="blue" size="md">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Team Leader Contact Card */}
            <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-3">
              <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider">
                Team Leader
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={team.owner?.avatar || team.ownerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                  alt={team.owner?.name || "Leader"}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <p className="text-sm font-bold text-brand-text">{team.owner?.name || "Squad Leader"}</p>
                  <p className="text-xs text-brand-muted">{team.owner?.college || team.ownerCollege || "University Student"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Team Members */}
      {activeTab === "members" && (
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-brand-text">
              Active Squad ({members.length} of {maxMembers} spots filled)
            </h4>
            <span className="text-xs text-brand-muted">
              {Math.max(0, maxMembers - members.length)} remaining position{maxMembers - members.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member, idx) => {
              const u = member.user || {};
              const name = u.name || member.name || "Member";
              const avatar = u.avatar || member.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
              const college = u.college || member.college || "University Student";

              return (
                <div
                  key={u._id || member.userId || idx}
                  className="p-4 rounded-2xl border border-brand-border bg-slate-50 flex items-center gap-3"
                >
                  <img
                    src={avatar}
                    alt={name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-brand-text truncate">
                        {name}
                      </p>
                      {member.isOwner && (
                        <span className="text-[10px] font-bold text-brand-blue bg-blue-100/70 px-2 py-0.5 rounded-full">
                          Leader
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-muted truncate">{college}</p>
                    <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                      {member.role || "Member"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Meetings & Video Calling */}
      {activeTab === "meetings" && (
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle">
          <TeamMeetingsSection team={team} currentUser={user} />
        </div>
      )}

      {/* Tab 4: Discussion */}
      {activeTab === "discussion" && (
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle">
          <CommentSection teamId={teamId} comments={comments} />
        </div>
      )}

      {/* Tab 5: Join Requests (Owner only) */}
      {activeTab === "requests" && isOwner && (
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-brand-text">
              Pending Candidate Applications ({teamJoinRequests.length})
            </h4>
            <span className="text-xs text-brand-muted">
              Inspect applicant portfolios, skills, and resumes
            </span>
          </div>

          {teamJoinRequests.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-brand-border text-xs text-brand-muted">
              No pending applications for {team.name} right now.
            </div>
          ) : (
            <div className="space-y-4">
              {teamJoinRequests.map((req) => {
                const applicant = req.applicant || {};
                const name = applicant.name || req.applicantName || "Applicant";
                const avatar = applicant.avatar || req.applicantAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                const college = applicant.college || req.applicantCollege || "University Student";
                const role = req.role || req.applicantRole;

                return (
                  <div
                    key={req._id || req.id}
                    className="p-5 rounded-2xl border border-brand-border bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-brand-text">
                            {name}
                          </span>
                          <span className="text-[10px] font-semibold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            {role}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted">{college}</p>
                        <p className="text-xs text-slate-700 italic">
                          "{req.message}"
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedApplicantReq(req)}
                      className="self-end sm:self-center px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                    >
                      Review Profile & Decide
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Join Request Modal */}
      <JoinRequestModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        team={team}
      />

      {/* Applicant Review Modal for Owner */}
      <ApplicantReviewModal
        isOpen={!!selectedApplicantReq}
        onClose={() => setSelectedApplicantReq(null)}
        request={selectedApplicantReq}
        team={team}
        onDecisionUpdated={() => {
          fetchTeamById(teamId);
          fetchTeamRequests(teamId);
        }}
      />
      {/* Team Chat Drawer for Instant Messaging */}
      <TeamChatDrawer
        isOpen={isTeamChatOpen}
        onClose={() => setIsTeamChatOpen(false)}
        teamId={teamId}
        teamName={team?.name}
      />
    </div>
  );
};

export default TeamDetailsPage;
