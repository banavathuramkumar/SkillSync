import React from "react";
import { ShieldCheck, Lock, Award, HeartHandshake, AlertCircle } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

export const GuidelinesPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">
          Community Guidelines & Privacy Policy
        </h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
          Our standards for student collaboration, academic integrity, and secure full-stack data protection
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
            <ShieldCheck className="w-6 h-6 text-brand-blue" />
            <h4 className="text-sm font-bold text-brand-text">Authentic Profiles</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every builder must provide genuine student credentials, active GitHub profiles, and truthful skill assessments.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
            <HeartHandshake className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-bold text-brand-text">Respect & Commitment</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you commit to a hackathon squad, respect your teammates' time, honor deadlines, and communicate actively in chat.
            </p>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
            <Award className="w-6 h-6 text-purple-700" />
            <h4 className="text-sm font-bold text-brand-text">Fair Play & Code Originality</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Honor all hackathon competition rules regarding pre-existing code, open-source licensing, and collaborative AI usage.
            </p>
          </div>
        </div>

        {/* Section: Full-Stack Production Architecture Notice */}
        <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-brand-blue" />
            <span>Full-Stack Production Architecture & Security Standards</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            SkillSync is an internet-accessible, production-ready full-stack platform. User authentication is secured via cryptographic bcrypt password hashing and validated JSON Web Tokens (JWT). All collegiate squads, join requests, persistent in-app notifications, and authorized chat rooms are powered by live MongoDB database aggregations and real-time Socket.IO streams. Uploaded student resumes and profiles are verified and restricted to authorized team leaders.
          </p>
        </div>

        {/* Section: Rules of Engagement */}
        <div className="space-y-4 pt-4 border-t border-brand-border">
          <h3 className="text-base font-bold text-brand-text">Rules of Engagement</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
            <li>
              <strong>No Spamming Join Requests:</strong> Apply only to squads where you realistically meet the requested technical requirements.
            </li>
            <li>
              <strong>Prompt Review by Team Leads:</strong> Team leaders should review or decline candidate applications within 48 hours to allow applicants to explore other opportunities.
            </li>
            <li>
              <strong>Professional Conduct:</strong> Harassment, discriminatory language, or unprofessional conduct in team discussions will result in immediate platform account revocation.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesPage;
