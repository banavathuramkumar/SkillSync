import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { COMPETITION_CATEGORIES, FORMAT_OPTIONS, SORT_OPTIONS } from "../../constants/categories";
import { POPULAR_SKILLS, INDIAN_STATES } from "../../constants/skills";

export const TeamFilterBar = ({
  search,
  setSearch,
  category,
  setCategory,
  skill,
  setSkill,
  stateFilter,
  setStateFilter,
  format,
  setFormat,
  onlyOpen,
  setOnlyOpen,
  sortBy,
  setSortBy,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-subtle space-y-4">
      {/* Search & Sort Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams by project name, keywords, problem statement, or contest..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
          />
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-slate-700"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Selects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Category */}
        <div>
          <label className="block text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
          >
            {COMPETITION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Skill */}
        <div>
          <label className="block text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1">
            Required Skill
          </label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
          >
            <option value="">All Skills</option>
            {POPULAR_SKILLS.map((sk) => (
              <option key={sk} value={sk}>
                {sk}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1">
            Location / State
          </label>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
          >
            <option value="">All Locations</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="block text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
          >
            {FORMAT_OPTIONS.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggles & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-border text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
          <input
            type="checkbox"
            checked={onlyOpen}
            onChange={(e) => setOnlyOpen(e.target.checked)}
            className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
          />
          <span>Show only teams with open positions (Recruiting)</span>
        </label>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-brand-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

export default TeamFilterBar;
