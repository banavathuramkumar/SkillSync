import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Bookmark,
  MapPin,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { JoinRequestModal } from "./JoinRequestModal";
import { useAuthStore } from "../../store/useAuthStore";
import { useTeamStore } from "../../store/useTeamStore";
import { toast } from "sonner";

export const TeamCard = ({ team }) => {
  const { user } = useAuthStore();
  const { savedTeamIds, toggleSaveTeam, myRequests, withdrawRequest } =
    useTeamStore();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const teamId = team._id || team.id;
  const ownerId = team.owner?._id || team.owner?.id || team.ownerId || team.owner;
  const ownerName = team.owner?.name || team.ownerName || "Squad Leader";
  const ownerAvatar =
    team.owner?.avatar ||
    team.ownerAvatar ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

  const members = team.members || [];
  const maxMembers = team.maxMembers || 4;
  const isFull = members.length >= maxMembers;

  const currentUserId = user?._id || user?.id;
  const isSaved = savedTeamIds.includes(teamId);
  const isOwner = user && ownerId && ownerId.toString() === currentUserId?.toString();
  const isMember =
    user &&
    members.some((m) => {
      const mId = m.user?._id || m.user?.id || m.userId || m.user;
      return mId && mId.toString() === currentUserId?.toString();
    });

  // Check if current user has a pending request for this team
  const userPendingReq =
    user &&
    myRequests.find((r) => {
      const rTeamId = r.team?._id || r.team?.id || r.teamId || r.team;
      return (
        rTeamId &&
        rTeamId.toString() === teamId.toString() &&
        r.status === "pending"
      );
    });

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    await toggleSaveTeam(teamId);
    if (isSaved) {
      toast.info(`Removed ${team.name} from saved teams.`);
    } else {
      toast.success(`Saved ${team.name} to bookmarks!`);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (userPendingReq) {
      const res = await withdrawRequest(userPendingReq._id || userPendingReq.id);
      if (res.success) {
        toast.info("Join request withdrawn.");
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-brand-border p-5 sm:p-6 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between group">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-brand-blue tracking-wide uppercase truncate block">
                {team.competitionName}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-brand-text group-hover:text-brand-blue transition-colors truncate">
                {team.name}
              </h3>
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl transition-colors ${
                isSaved
                  ? "bg-blue-50 text-brand-blue"
                  : "text-slate-400 hover:text-brand-blue hover:bg-slate-50"
              }`}
              title={isSaved ? "Saved" : "Save team"}
              aria-label="Save team"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-brand-blue" : ""}`} />
            </button>
          </div>

          {/* Project Title & Teaser */}
          {team.projectTitle && (
            <p className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-1 mb-1">
              {team.projectTitle}
            </p>
          )}
          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed mb-4">
            {team.problemStatement || team.description}
          </p>

          {/* Badges / Format */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <Badge
              variant={
                team.status === "Recruiting"
                  ? "success"
                  : team.status === "Closed" || isFull
                  ? "warning"
                  : "default"
              }
              size="sm"
            >
              {team.status === "Recruiting" ? "Recruiting" : team.status}
            </Badge>

            <Badge variant="default" size="sm">
              {team.category}
            </Badge>

            {team.format && (
              <span className="text-[11px] text-slate-500 flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full">
                <MapPin className="w-3 h-3 text-slate-400" />
                {team.format}
              </span>
            )}
          </div>

          {/* Required Skills */}
          {team.requiredSkills && team.requiredSkills.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Seeking Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {team.requiredSkills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="blue" size="sm">
                    {skill}
                  </Badge>
                ))}
                {team.requiredSkills.length > 4 && (
                  <span className="text-[11px] text-slate-400 font-medium self-center">
                    +{team.requiredSkills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="pt-4 border-t border-brand-border space-y-3">
          {/* Member count & Lead */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <img
                src={ownerAvatar}
                alt={ownerName}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <span className="text-slate-600 font-medium truncate max-w-[120px]">
                {ownerName}
              </span>
            </div>

            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Users className="w-3.5 h-3.5 text-brand-blue" />
              <span>
                {members.length}/{maxMembers} Members
              </span>
            </div>
          </div>

          {/* Progress bar of members */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isFull ? "bg-amber-500" : "bg-brand-blue"
              }`}
              style={{
                width: `${Math.min(100, (members.length / maxMembers) * 100)}%`,
              }}
            />
          </div>

          {/* Card Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/teams/${teamId}`}
              className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 hover:text-brand-blue bg-slate-50 hover:bg-slate-100 border border-brand-border rounded-xl transition-all"
            >
              View Details
            </Link>

            {isOwner ? (
              <span className="px-3 py-2 text-xs font-semibold text-brand-blue bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Your Team
              </span>
            ) : isMember ? (
              <span className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Joined
              </span>
            ) : userPendingReq ? (
              <button
                onClick={handleWithdraw}
                className="px-3 py-2 text-xs font-semibold text-amber-700 hover:text-rose-600 bg-amber-50 hover:bg-rose-50 border border-amber-200 rounded-xl transition-colors flex items-center gap-1"
                title="Click to withdraw pending application"
              >
                <Clock className="w-3.5 h-3.5" />
                Withdraw
              </button>
            ) : (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                disabled={isFull || team.status === "Closed"}
                className="py-2 px-3 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm flex items-center gap-1"
              >
                <span>{isFull ? "Full" : "Request to Join"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        team={team}
      />
    </>
  );
};

export default TeamCard;
