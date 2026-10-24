import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Users, PlusCircle } from "lucide-react";
import { useTeamStore } from "../../store/useTeamStore";
import { TeamCard } from "../../components/teams/TeamCard";
import { TeamFilterBar } from "../../components/teams/TeamFilterBar";
import { EmptyState } from "../../components/common/EmptyState";

export const FindTeamsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { teams, fetchTeams, isLoading } = useTeamStore();

  const initialSearch = searchParams.get("q") || "";
  const initialComp = searchParams.get("competition") || "";

  const [search, setSearch] = useState(initialSearch || initialComp);
  const [category, setCategory] = useState("All Categories");
  const [skill, setSkill] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [format, setFormat] = useState("All Formats");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const filteredTeams = useMemo(() => {
    return (teams || [])
      .filter((team) => {
        // Search term
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchesName = team.name?.toLowerCase().includes(query);
          const matchesComp = team.competitionName?.toLowerCase().includes(query);
          const matchesProject = team.projectTitle?.toLowerCase().includes(query);
          const matchesProblem = team.problemStatement?.toLowerCase().includes(query);
          const matchesSkills = team.requiredSkills?.some((s) =>
            s.toLowerCase().includes(query)
          );
          if (
            !matchesName &&
            !matchesComp &&
            !matchesProject &&
            !matchesProblem &&
            !matchesSkills
          ) {
            return false;
          }
        }

        // Category
        if (category !== "All Categories" && team.category !== category) {
          return false;
        }

        // Skill
        if (
          skill &&
          !team.requiredSkills?.some(
            (s) => s.toLowerCase() === skill.toLowerCase()
          )
        ) {
          return false;
        }

        // State
        if (stateFilter && team.state !== stateFilter) {
          return false;
        }

        // Format
        if (format !== "All Formats" && team.format !== format) {
          return false;
        }

        // Only open positions
        if (onlyOpen && team.status !== "Recruiting") {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === "deadline") {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        if (sortBy === "size_asc") {
          return (a.members?.length || 0) - (b.members?.length || 0);
        }
        return 0;
      });
  }, [teams, search, category, skill, stateFilter, format, onlyOpen, sortBy]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setSkill("");
    setStateFilter("");
    setFormat("All Formats");
    setOnlyOpen(false);
    setSortBy("newest");
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Find Teammates</h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
            Discover student teams recruiting for upcoming hackathons & competitions
          </p>
        </div>

        <Link
          to="/teams/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Your Team</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <TeamFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        skill={skill}
        setSkill={setSkill}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        format={format}
        setFormat={setFormat}
        onlyOpen={onlyOpen}
        setOnlyOpen={setOnlyOpen}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-brand-muted px-1">
        <span>
          Showing <strong>{filteredTeams.length}</strong> matching team{filteredTeams.length === 1 ? "" : "s"}
        </span>
        {search && (
          <span>
            Filtering by "<strong>{search}</strong>"
          </span>
        )}
      </div>

      {/* Teams Grid */}
      {isLoading && filteredTeams.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-border">
          <p className="text-xs text-brand-muted">Loading teams from database...</p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <EmptyState
          icon={Users}
          title={teams.length === 0 ? "No Teams Created Yet" : "No teams match your criteria"}
          description={
            teams.length === 0
              ? "No student squads have been created yet. Be the first to build a team and invite builders across the country!"
              : "Try broadening your skill filters, clearing search terms, or be the first to create a team for this challenge!"
          }
          actionText={teams.length === 0 ? "Create First Team" : "Reset All Filters"}
          onAction={
            teams.length === 0
              ? () => (window.location.href = "/teams/create")
              : handleResetFilters
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard key={team._id || team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindTeamsPage;
