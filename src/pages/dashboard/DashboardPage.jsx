import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  PlusCircle,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useTeamStore } from "../../store/useTeamStore";
import { PlatformStats } from "../../components/dashboard/PlatformStats";
import { ActivityChart } from "../../components/dashboard/ActivityChart";
import { CorporateConnectCard } from "../../components/dashboard/CorporateConnectCard";
import { FounderProfile } from "../../components/dashboard/FounderProfile";
import { UpcomingDeadlines } from "../../components/dashboard/UpcomingDeadlines";
import { TeamCard } from "../../components/teams/TeamCard";
import { EmptyState } from "../../components/common/EmptyState";
import { UserAvatar } from "../../components/common/UserAvatar";

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { teams, fetchTeams, isLoading } = useTeamStore();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Highlight 3 recommended teams that are recruiting
  const recommendedTeams = teams
    .filter((t) => t.status === "Recruiting")
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 1. Personalized Welcome Section */}
      <div className="bg-white rounded-3xl border border-brand-border p-4 sm:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <UserAvatar
            user={user}
            size="md"
            className="border-2 border-brand-blue/30 shadow-sm ring-2 ring-blue-50/50 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-bold text-brand-text truncate">
              Welcome back, <span className="text-brand-blue">{user?.name ? user.name.split(" ")[0] : "Builder"}!</span> 👋
            </h2>
            <p className="text-[11px] sm:text-xs text-brand-muted truncate mt-0.5">
              {user?.college || "SRM University AP"} • {user?.skills?.slice(0, 3).join(", ") || "Full Stack Developer"}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Verified Student Profile Active
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action CTAs (Balanced 2-Column on Mobile, Inline on Desktop) */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 flex-shrink-0 pt-1 md:pt-0">
          <Link
            to="/teams"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all text-center"
          >
            <Users className="w-3.5 h-3.5 text-brand-blue" />
            <span>Find Teams</span>
          </Link>

          <Link
            to="/teams/create"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] text-center"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Team</span>
          </Link>
        </div>
      </div>

      {/* 2. Platform Statistics & Engagement */}
      <PlatformStats />

      {/* 3. Recommended Teams & Matching Velocity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-text">
              Recommended Teams For You
            </h3>
            <p className="text-xs text-brand-muted">
              Squads actively looking for your technical competencies
            </p>
          </div>
          <Link
            to="/teams"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
          >
            <span>Browse all teams</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading && recommendedTeams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-brand-border">
            <p className="text-xs text-brand-muted">Loading squads from database...</p>
          </div>
        ) : recommendedTeams.length === 0 ? (
          <div className="bg-white rounded-3xl border border-brand-border p-8">
            <EmptyState
              icon={Users}
              title="No recruiting teams yet"
              description="Be the first to create a team and invite fellow student builders across India!"
              actionText="Create Team"
              onAction={() => (window.location.href = "/teams/create")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedTeams.map((team) => (
              <TeamCard key={team._id || team.id} team={team} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Secondary Grid: Activity Chart (Hidden on Small Screens) & Upcoming Deadlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="hidden md:block md:col-span-1 lg:col-span-2">
          <ActivityChart />
        </div>
        <div className="col-span-1">
          <UpcomingDeadlines />
        </div>
      </div>

      {/* 5. Community & Founder Section (Clean 2-Column Responsive Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <CorporateConnectCard />
        <FounderProfile />
      </div>
    </div>
  );
};

export default DashboardPage;
