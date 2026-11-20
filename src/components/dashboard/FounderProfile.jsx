import React from "react";
import { GraduationCap, Code2, Sparkles, ExternalLink, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/BrandIcons";
import { siteConfig } from "../../config/siteConfig";

export const FounderProfile = ({ member, memberIndex }) => {
  const profile =
    member ||
    (memberIndex !== undefined ? siteConfig.developers[memberIndex] : null) ||
    siteConfig.founder;

  return (
    <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-card flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header: Photo & Title */}
        <div className="flex items-center gap-4">
          <div className="relative group flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-brand-blue/30 shadow-md ring-4 ring-blue-50/70">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-brand-blue to-brand-mint text-white p-1 rounded-full shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-text truncate">
                {profile.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-brand-blue border border-blue-200 flex-shrink-0">
                <Code2 className="w-3 h-3 inline mr-1" />
                {profile.roleBadge || profile.title || "Developer"}
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-700">
              {profile.communityRole}
            </p>
          </div>
        </div>

        {/* Education (clean text wrapping without cutting off) */}
        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/70">
          <GraduationCap className="w-4 h-4 text-brand-blue flex-shrink-0" />
          <span>{profile.education}</span>
        </div>

        {/* Mission / Quote */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
          "{profile.mission}"
        </p>
      </div>

      {/* Bottom Actions: Social Profiles & Contact */}
      <div className="pt-5 mt-4 border-t border-brand-border/80">
        <div className="grid grid-cols-3 gap-2.5 text-center">
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm"
              title={`${profile.name} GitHub Profile`}
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-brand-blue text-xs font-semibold border border-blue-200/50 transition-all hover:scale-[1.02] shadow-sm"
              title={`${profile.name} LinkedIn Profile`}
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          )}

          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm"
              title={`Contact ${profile.name}`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          )}
        </div>
        <p className="text-[11px] text-brand-muted text-center mt-2.5">
          {profile.footerNote || "Verified Developer Profile"}
        </p>
      </div>
    </div>
  );
};

export default FounderProfile;
