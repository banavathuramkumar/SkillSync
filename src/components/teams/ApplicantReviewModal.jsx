import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  GraduationCap,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetcodeIcon } from "../common/BrandIcons";
import { toast } from "sonner";
import { useTeamStore } from "../../store/useTeamStore";

export const ApplicantReviewModal = ({
  isOpen,
  onClose,
  request,
  team,
  onDecisionUpdated,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { respondToJoinRequest } = useTeamStore();

  if (!request) return null;

  const applicant = request.applicant || {};
  const applicantName = applicant.name || request.applicantName || "Applicant";
  const applicantAvatar = applicant.avatar || request.applicantAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
  const applicantCollege = applicant.college || request.applicantCollege || "University Student";
  const applicantSkills = applicant.skills || request.applicantSkills || [];
  const applicantBio = applicant.bio || request.applicantBio || "";
  const applicantGithub = applicant.githubUrl || request.applicantGithub || "";
  const applicantLinkedin = applicant.linkedinUrl || request.applicantLinkedin || "";
  const applicantLeetcode = applicant.leetcodeUrl || request.applicantLeetcode || "";
  const applicantResume = applicant.resumeUrl || request.applicantResume || "";

  const members = team?.members || [];
  const maxMembers = team?.maxMembers || 4;
  const isTeamFull = members.length >= maxMembers;
  const requestId = request._id || request.id;

  const handleAccept = async () => {
    if (isTeamFull) {
      toast.error("Cannot accept applicant: Team has already reached maximum capacity.");
      return;
    }

    setIsProcessing(true);
    const result = await respondToJoinRequest(requestId, "accepted");
    setIsProcessing(false);

    if (result.success) {
      toast.success(`${applicantName} has been added to the team! Team Chat and Meetings are now unlocked.`);
      if (onDecisionUpdated) onDecisionUpdated();
      onClose();
    } else {
      toast.error(result.message || "Failed to accept applicant.");
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    const result = await respondToJoinRequest(requestId, "rejected");
    setIsProcessing(false);

    if (result.success) {
      toast.info(`Application from ${applicantName} was declined.`);
      if (onDecisionUpdated) onDecisionUpdated();
      onClose();
    } else {
      toast.error("Failed to update application.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Applicant Profile Review"
      subtitle={`Application for ${team?.name || "your squad"}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Applicant Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-brand-border">
          <img
            src={applicantAvatar}
            alt={applicantName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-blue/20"
          />
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-brand-text">
              {applicantName}
            </h4>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-brand-muted mt-1">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-brand-blue" />
                {applicantCollege}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {applicant.city ? `${applicant.city}, ${applicant.state}` : "India"}
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-200">
              Applying as: {request.role || request.applicantRole}
            </div>
          </div>
        </div>

        {/* Bio */}
        {applicantBio && (
          <div>
            <h5 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
              About Applicant
            </h5>
            <p className="text-xs sm:text-sm text-slate-600 bg-white p-3 rounded-xl border border-brand-border leading-relaxed">
              {applicantBio}
            </p>
          </div>
        )}

        {/* Applicant Pitch Note */}
        <div>
          <h5 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-brand-blue" />
            Applicant's Note
          </h5>
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-amber-900 leading-relaxed italic">
            "{request.message}"
          </div>
        </div>

        {/* Verified Skills */}
        <div>
          <h5 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
            Skills & Competencies
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {applicantSkills.length > 0 ? (
              applicantSkills.map((skill) => (
                <Badge key={skill} variant="blue" size="md">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-brand-muted">No skills specified</span>
            )}
          </div>
        </div>

        {/* Profiles & Resume */}
        <div>
          <h5 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
            Verified Links & Resume
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {applicantGithub && (
              <a
                href={applicantGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-slate-900" />
                  <span>GitHub Profile</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            {applicantLinkedin && (
              <a
                href={applicantLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon className="w-4 h-4 text-blue-600" />
                  <span>LinkedIn Profile</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            {applicantLeetcode && (
              <a
                href={applicantLeetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LeetcodeIcon className="w-4 h-4 text-amber-600" />
                  <span>LeetCode Profile</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            {applicantResume ? (
              <a
                href={`http://localhost:5000${applicantResume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-medium text-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>View Verified Resume (PDF)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              </a>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>No Resume Uploaded</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Decline Request</span>
          </button>

          <button
            onClick={handleAccept}
            disabled={isTeamFull || isProcessing}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isTeamFull ? "Team Full" : isProcessing ? "Saving..." : "Accept as Teammate"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicantReviewModal;
