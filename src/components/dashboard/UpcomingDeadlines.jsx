import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Calendar, Trophy } from "lucide-react";
import { useCompetitionStore } from "../../store/useCompetitionStore";
import { formatDate } from "../../utils/formatters";

export const UpcomingDeadlines = () => {
  const { competitions, fetchCompetitions, isLoading } = useCompetitionStore();

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const upcoming = competitions.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h4 className="text-base font-bold text-brand-text">
            Upcoming Registration Deadlines
          </h4>
        </div>
        <Link
          to="/competitions"
          className="text-xs font-semibold text-brand-blue hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {isLoading && upcoming.length === 0 ? (
          <div className="text-center py-8 text-xs text-brand-muted">
            Loading upcoming deadlines...
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200">
            <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-brand-text">
              No Active Deadlines
            </p>
            <p className="text-[11px] text-brand-muted mt-1 max-w-xs mx-auto">
              Real competition dates will appear here once officially announced and scheduled.
            </p>
          </div>
        ) : (
          upcoming.map((comp) => (
            <div
              key={comp._id || comp.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50/40 hover:border-blue-100 transition-colors"
            >
              <div className="min-w-0 pr-3">
                <p className="text-xs font-bold text-brand-text truncate">
                  {comp.title}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-brand-muted mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Due: {formatDate(comp.registrationDeadline)}
                  </span>
                  <span>•</span>
                  <span className="text-brand-blue font-medium">{comp.teamSizeLabel}</span>
                </div>
              </div>

              <Link
                to={`/teams?competition=${encodeURIComponent(comp.title)}`}
                className="flex-shrink-0 text-xs font-semibold text-brand-blue bg-white px-2.5 py-1 rounded-lg border border-brand-border hover:bg-brand-blue hover:text-white transition-all"
              >
                Squads
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
