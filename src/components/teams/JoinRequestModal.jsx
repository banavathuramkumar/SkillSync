import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTeamStore } from "../../store/useTeamStore";

export const JoinRequestModal = ({ isOpen, onClose, team }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [pitchMessage, setPitchMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestToJoin, fetchMyRequests } = useTeamStore();

  if (!team) return null;

  const teamId = team._id || team.id;
  const ownerName = team.owner?.name || team.ownerName || "the squad leader";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pitchMessage.trim()) {
      toast.error("Please add a short note describing how you can help this team.");
      return;
    }

    setIsSubmitting(true);
    const role = selectedRole || (team.requiredSkills?.[0] || "Contributor");

    const result = await requestToJoin(teamId, role, pitchMessage.trim());

    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Application submitted! ${ownerName} has been notified in real time.`);
      fetchMyRequests();
      onClose();
    } else {
      toast.error(result.message || "Failed to submit application.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request to Join ${team.name}`}
      subtitle={`Competing in ${team.competitionName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Role You Want to Fill
          </label>
          {team.requiredSkills && team.requiredSkills.length > 0 ? (
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            >
              <option value="">Select a role or skill...</option>
              {team.requiredSkills.map((skill) => (
                <option key={skill} value={`${skill} Specialist`}>
                  {skill} Specialist
                </option>
              ))}
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="General Contributor">General Contributor</option>
            </select>
          ) : (
            <input
              type="text"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              placeholder="e.g. Frontend Developer, ML Engineer"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Why are you a good fit? (Note to Squad Leader)
          </label>
          <textarea
            rows={4}
            value={pitchMessage}
            onChange={(e) => setPitchMessage(e.target.value)}
            placeholder="Introduce your relevant experience, GitHub links, or what you're excited to contribute..."
            className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue resize-none"
            required
          />
        </div>

        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-brand-blue">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            The team leader will review your full profile, verified skills, and resume before accepting.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Submitting..." : "Send Application"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinRequestModal;
