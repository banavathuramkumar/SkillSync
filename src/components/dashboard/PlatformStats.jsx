import React, { useState, useEffect } from "react";
import { Users, Briefcase, UserPlus, Trophy, Activity } from "lucide-react";
import { statsService } from "../../services/api/statsService";

export const PlatformStats = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    teamsCreated: 0,
    openPositions: 0,
    competitionsListed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await statsService.getPlatformStats();
        if (isMounted && res.stats) {
          setStatsData(res.stats);
        }
      } catch (err) {
        console.warn("[Stats] Could not load live platform stats:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      id: "users",
      label: "Registered Students & Devs",
      value: isLoading ? "..." : statsData.totalUsers.toLocaleString(),
      sublabel: "Verified student profiles",
      icon: Users,
      bg: "bg-blue-50 text-brand-blue border-blue-200",
    },
    {
      id: "teams",
      label: "Teams Formed",
      value: isLoading ? "..." : statsData.teamsCreated.toLocaleString(),
      sublabel: "Collegiate squads created",
      icon: Briefcase,
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "positions",
      label: "Open Team Roles",
      value: isLoading ? "..." : statsData.openPositions.toLocaleString(),
      sublabel: "Actively looking for talent",
      icon: UserPlus,
      bg: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "competitions",
      label: "Competitions Listed",
      value: isLoading ? "..." : statsData.competitionsListed.toLocaleString(),
      sublabel: "SIH, AI challenges, Hackathons",
      icon: Trophy,
      bg: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
          Platform Activity Overview
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-brand-muted bg-slate-100/80 px-2.5 py-1 rounded-full">
          <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Real-time database records</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle hover:shadow-card transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-muted">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl border ${stat.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-text mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-brand-muted">{stat.sublabel}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformStats;
