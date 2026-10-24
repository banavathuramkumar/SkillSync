import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Search,
  Calendar,
  MapPin,
  Users,
  Bookmark,
  ExternalLink,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { useCompetitionStore } from "../../store/useCompetitionStore";
import { COMPETITION_CATEGORIES, FORMAT_OPTIONS } from "../../constants/categories";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate } from "../../utils/formatters";

export const CompetitionsPage = () => {
  const {
    competitions,
    savedCompetitionIds,
    toggleSaveCompetition,
    fetchCompetitions,
    isLoading,
  } = useCompetitionStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [formatFilter, setFormatFilter] = useState("All Formats");

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const filteredCompetitions = useMemo(() => {
    return (competitions || []).filter((comp) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = comp.title?.toLowerCase().includes(q);
        const matchesOrg = comp.organizer?.toLowerCase().includes(q);
        const matchesDesc = comp.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesDesc) return false;
      }
      if (category !== "All Categories" && comp.category !== category) {
        return false;
      }
      const mode = comp.mode || comp.format;
      if (formatFilter !== "All Formats" && mode !== formatFilter) {
        return false;
      }
      return true;
    });
  }, [competitions, search, category, formatFilter]);

  const handleToggleBookmark = async (id, title) => {
    await toggleSaveCompetition(id);
    const isSaved = savedCompetitionIds.includes(id);
    toast.success(isSaved ? `Removed ${title} from saved` : `Saved ${title}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Discover Competitions</h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
            Smart India Hackathon, national AI challenges, ICPC, and student developer initiatives
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-brand-muted bg-white border border-brand-border px-3 py-1.5 rounded-xl shadow-subtle">
          <Award className="w-4 h-4 text-brand-blue" />
          <span>Verified Student Competitions</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-subtle grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search competitions or organizers..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
          >
            {COMPETITION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
          >
            {FORMAT_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Competitions Grid */}
      {isLoading && filteredCompetitions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-border">
          <p className="text-xs text-brand-muted">Loading competitions from database...</p>
        </div>
      ) : filteredCompetitions.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title={
            competitions.length === 0
              ? "No Competitions Listed Yet"
              : "No competitions match your search"
          }
          description={
            competitions.length === 0
              ? "Official national hackathons, SIH problem statements, and developer challenges will appear here as registration schedules open."
              : "Try selecting 'All Categories' or resetting your search keywords."
          }
          actionText={competitions.length === 0 ? null : "Show All Competitions"}
          onAction={() => {
            setSearch("");
            setCategory("All Categories");
            setFormatFilter("All Formats");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCompetitions.map((comp) => {
            const compId = comp._id || comp.id;
            const isSaved = savedCompetitionIds.includes(compId);
            const portalUrl = comp.websiteUrl || comp.officialUrl;
            const mode = comp.mode || comp.format || "Online / Virtual";

            return (
              <div
                key={compId}
                className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="blue" size="sm">
                          {comp.category}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-brand-text mt-1.5">
                        {comp.title}
                      </h3>
                      <p className="text-xs font-semibold text-brand-blue">
                        Organized by: {comp.organizer}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(compId, comp.title)}
                      className={`p-2 rounded-xl transition-colors ${
                        isSaved
                          ? "bg-blue-50 text-brand-blue"
                          : "text-slate-400 hover:text-brand-blue hover:bg-slate-50"
                      }`}
                      title="Save competition"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-brand-blue" : ""}`} />
                    </button>
                  </div>

                  <p className="text-xs text-brand-muted leading-relaxed">
                    {comp.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Deadline: {formatDate(comp.registrationDeadline)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{comp.teamSizeLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" />
                      <span className="truncate">{mode}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-semibold text-brand-text truncate">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span className="truncate">{comp.prizePool}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/teams?competition=${encodeURIComponent(comp.title)}`}
                      className="px-3.5 py-2 text-xs font-semibold text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      Find Teammates
                    </Link>

                    <Link
                      to="/teams/create"
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Post Team
                    </Link>
                  </div>

                  {portalUrl && (
                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-brand-blue font-medium flex items-center gap-1 px-2 py-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompetitionsPage;
