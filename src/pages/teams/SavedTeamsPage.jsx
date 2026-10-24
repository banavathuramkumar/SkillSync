import React, { useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useTeamStore } from "../../store/useTeamStore";
import { TeamCard } from "../../components/teams/TeamCard";
import { EmptyState } from "../../components/common/EmptyState";

export const SavedTeamsPage = () => {
  const { savedTeams, fetchSavedTeams, isLoading } = useTeamStore();

  useEffect(() => {
    fetchSavedTeams();
  }, [fetchSavedTeams]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Saved Teams</h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
          Your bookmarked squads and opportunities to review later
        </p>
      </div>

      {isLoading && (!savedTeams || savedTeams.length === 0) ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-border">
          <p className="text-xs text-brand-muted">Loading saved teams...</p>
        </div>
      ) : !savedTeams || savedTeams.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No teams saved yet"
          description="Bookmark teams while exploring to compare problem statements and apply when ready."
          actionText="Discover Teams"
          onAction={() => (window.location.href = "/teams")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTeams.map((team) => (
            <TeamCard key={team._id || team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTeamsPage;
