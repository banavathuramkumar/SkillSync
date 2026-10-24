import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  PlusCircle,
  Briefcase,
  UserCheck,
  Clock,
  MessageSquare,
  CheckCircle2,
  Power,
  XCircle,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { useTeamStore } from "../../store/useTeamStore";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate } from "../../utils/formatters";
import { TeamChatDrawer } from "../../components/chat/TeamChatDrawer";

export const MyTeamsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    myTeams,
    myRequests,
    fetchMyTeams,
    fetchMyRequests,
    withdrawRequest,
    toggleRecruitmentStatus,
    isLoading,
  } = useTeamStore();

  const [activeTab, setActiveTab] = useState("created"); // "created" | "joined" | "pending" | "previous"
  const [activeChatTeam, setActiveChatTeam] = useState(null);

  useEffect(() => {
    fetchMyTeams();
    fetchMyRequests();
  }, [fetchMyTeams, fetchMyRequests]);

  const myCreatedTeams = myTeams.created || [];
  const myJoinedTeams = myTeams.joined || [];
  const previousTeams = myTeams.previous || [];
  const myPendingRequests = (myRequests || []).filter(
    (r) => r.status === "pending"
  );

  const handleOpenChat = (teamId, teamName) => {
    setActiveChatTeam({ id: teamId, name: teamName });
  };

  const handleWithdraw = async (reqId) => {
    const res = await withdrawRequest(reqId);
    if (res.success) {
      toast.info("Application withdrawn.");
    } else {
      toast.error(res.message || "Failed to withdraw.");
    }
  };

  const handleToggleRecruitment = async (teamId, currentStatus) => {
    const res = await toggleRecruitmentStatus(teamId);
    if (res.success) {
      toast.success(
        res.status === "Recruiting"
          ? "Recruitment reopened!"
          : "Recruitment closed for this squad."
      );
      fetchMyTeams();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">My Teams & Squads</h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
            Manage squads you lead, active memberships, and pending candidate applications
          </p>
        </div>

        <Link
          to="/teams/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Team</span>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-brand-border p-2 flex items-center gap-1 overflow-x-auto shadow-subtle">
        <button
          onClick={() => setActiveTab("created")}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "created"
              ? "bg-brand-blue text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Teams I Lead ({myCreatedTeams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("joined")}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "joined"
              ? "bg-brand-blue text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Teams I Joined ({myJoinedTeams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "pending"
              ? "bg-brand-blue text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Requests ({myPendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("previous")}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "previous"
              ? "bg-brand-blue text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Previous / Closed ({previousTeams.length})</span>
        </button>
      </div>

      {/* Tab Content: Teams I Created */}
      {activeTab === "created" && (
        <div className="space-y-4">
          {isLoading && myCreatedTeams.length === 0 ? (
            <div className="text-center py-12 text-xs text-brand-muted bg-white rounded-3xl border border-brand-border">
              Loading your squads...
            </div>
          ) : myCreatedTeams.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="You haven't formed any teams yet"
              description="Post a team project to begin recruiting skilled teammates for SIH or upcoming hackathons."
              actionText="Create Team"
              onAction={() => navigate("/teams/create")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCreatedTeams.map((team) => {
                const teamId = team._id || team.id;
                const members = team.members || [];
                const maxMembers = team.maxMembers || 4;

                return (
                  <div
                    key={teamId}
                    className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-brand-blue uppercase">
                          {team.competitionName}
                        </span>
                        <Badge
                          variant={team.status === "Recruiting" ? "success" : "default"}
                          size="sm"
                        >
                          {team.status}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-brand-text">
                        {team.name}
                      </h3>
                      {team.projectTitle && (
                        <p className="text-xs text-brand-muted line-clamp-2">
                          {team.projectTitle}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-600 pt-2">
                        <Users className="w-4 h-4 text-brand-blue" />
                        <span className="font-semibold">
                          {members.length} / {maxMembers} Members
                        </span>
                        <span>•</span>
                        <span>Deadline: {formatDate(team.deadline)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/teams/${teamId}`}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          Manage Squad
                        </Link>
                        <button
                          onClick={() => handleOpenChat(teamId, team.name)}
                          className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Team Chat</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleRecruitment(teamId, team.status)}
                        className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded-xl transition-colors"
                        title="Toggle Recruitment Status"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Teams I Joined */}
      {activeTab === "joined" && (
        <div className="space-y-4">
          {myJoinedTeams.length === 0 ? (
            <EmptyState
              icon={Users}
              title="You haven't joined any squads yet"
              description="Browse open teams and send an application to match with collaborative teammates."
              actionText="Explore Teams"
              onAction={() => navigate("/teams")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myJoinedTeams.map((team) => {
                const teamId = team._id || team.id;
                const members = team.members || [];
                const maxMembers = team.maxMembers || 4;
                const leaderName = team.owner?.name || "Squad Leader";

                return (
                  <div
                    key={teamId}
                    className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-brand-blue uppercase">
                          {team.competitionName}
                        </span>
                        <Badge variant="blue" size="sm">
                          Member
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-brand-text">
                        {team.name}
                      </h3>
                      <p className="text-xs text-brand-muted">
                        Led by {leaderName}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-600 pt-2">
                        <Users className="w-4 h-4 text-brand-blue" />
                        <span className="font-semibold">
                          {members.length} / {maxMembers} Members
                        </span>
                        <span>•</span>
                        <span>Format: {team.format}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-border flex items-center justify-between gap-2">
                      <Link
                        to={`/teams/${teamId}`}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        View Team Page
                      </Link>

                      <button
                        onClick={() => handleOpenChat(teamId, team.name)}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open Team Chat</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Pending Requests */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {myPendingRequests.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No pending applications"
              description="When you apply to join a squad, your pending candidate requests will appear here."
              actionText="Find Squads"
              onAction={() => navigate("/teams")}
            />
          ) : (
            <div className="space-y-3">
              {myPendingRequests.map((req) => {
                const reqId = req._id || req.id;
                const team = req.team || {};
                const teamName = team.name || "Target Squad";
                const compName = team.competitionName || "Competition";

                return (
                  <div
                    key={reqId}
                    className="p-5 rounded-2xl border border-brand-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle hover:shadow-card transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-blue uppercase">
                          {compName}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Awaiting Review
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-brand-text">
                        {teamName}
                      </h4>

                      <p className="text-xs text-slate-600">
                        Applied Position: <strong>{req.role}</strong>
                      </p>

                      {req.message && (
                        <p className="text-xs text-slate-500 italic mt-1">
                          "{req.message}"
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 pt-1">
                        Applied on {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleWithdraw(reqId)}
                        className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Withdraw Request</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Previous / Closed Teams */}
      {activeTab === "previous" && (
        <div className="space-y-4">
          {previousTeams.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No previous teams"
              description="Teams that conclude after hackathon deadlines will be archived here for your portfolio."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previousTeams.map((team) => (
                <div
                  key={team._id || team.id}
                  className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-2 opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {team.competitionName}
                    </span>
                    <Badge variant="default" size="sm">
                      {team.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-brand-text">{team.name}</h3>
                  <p className="text-xs text-brand-muted">{team.projectTitle}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Instant Team Chat Drawer */}
      <TeamChatDrawer
        isOpen={!!activeChatTeam}
        onClose={() => setActiveChatTeam(null)}
        teamId={activeChatTeam?.id}
        teamName={activeChatTeam?.name}
      />
    </div>
  );
};

export default MyTeamsPage;
