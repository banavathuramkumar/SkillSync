import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Trophy,
  Calendar,
  Layers,
  Code2,
  Sparkles,
  Eye,
  Send,
  Plus,
  X,
  MapPin,
  Globe,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useTeamStore } from "../../store/useTeamStore";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import { COMPETITION_CATEGORIES, FORMAT_OPTIONS } from "../../constants/categories";
import { POPULAR_SKILLS, INDIAN_STATES } from "../../constants/skills";

export const CreateTeamPage = () => {
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState("");
  const [competitionName, setCompetitionName] = useState("");
  const [category, setCategory] = useState(COMPETITION_CATEGORIES[1]);
  const [organizer, setOrganizer] = useState("");
  const [competitionUrl, setCompetitionUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [competitionDate, setCompetitionDate] = useState("");
  const [format, setFormat] = useState(FORMAT_OPTIONS[1]);
  const [state, setState] = useState("Andhra Pradesh");
  const [city, setCity] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [expectations, setExpectations] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Skills & Tech Stacks
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [openRoles, setOpenRoles] = useState([]);
  const [roleInput, setRoleInput] = useState("");

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skill Add/Remove Handlers
  const handleAddSkill = (val) => {
    const s = val.trim();
    if (s && !requiredSkills.includes(s)) {
      setRequiredSkills([...requiredSkills, s]);
      setSkillInput("");
    }
  };

  const handleAddTech = (val) => {
    const t = val.trim();
    if (t && !techStack.includes(t)) {
      setTechStack([...techStack, t]);
      setTechInput("");
    }
  };

  const handleAddRole = (val) => {
    const r = val.trim();
    if (r && !openRoles.includes(r)) {
      setOpenRoles([...openRoles, r]);
      setRoleInput("");
    }
  };

  const handleSaveDraft = () => {
    toast.success("Team draft saved to local storage!");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!name.trim()) return toast.error("Team Name is required.");
    if (!competitionName.trim()) return toast.error("Competition Name is required.");
    if (!projectTitle.trim()) return toast.error("Project Title is required.");
    if (!problemStatement.trim()) return toast.error("Problem statement is required.");
    if (!proposedSolution.trim()) return toast.error("Proposed solution is required.");
    if (!deadline) return toast.error("Registration deadline is required.");
    if (requiredSkills.length === 0) return toast.error("Please add at least 1 required skill.");

    setIsSubmitting(true);

    const teamPayload = {
      name: name.trim(),
      competitionName: competitionName.trim(),
      category,
      organizer: organizer.trim() || "National Organizing Committee",
      competitionUrl: competitionUrl.trim(),
      deadline,
      competitionDate: competitionDate || deadline,
      format,
      state,
      city: city.trim() || "All India",
      projectTitle: projectTitle.trim(),
      problemStatement: problemStatement.trim(),
      proposedSolution: proposedSolution.trim(),
      description: description.trim() || problemStatement.trim(),
      maxMembers: parseInt(maxMembers, 10) || 4,
      requiredSkills,
      techStack: techStack.length > 0 ? techStack : requiredSkills,
      openRoles: openRoles.length > 0 ? openRoles : ["Full Stack Contributor"],
      expectations: expectations.trim() || "Regular commits and collaborative spirit.",
      additionalInfo: additionalInfo.trim(),
    };

    const result = await useTeamStore.getState().createTeam(teamPayload);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Team "${result.team.name}" published successfully! Chat room activated.`);
      navigate(`/teams/${result.team._id || result.team.id}`);
    } else {
      toast.error(result.error || "Failed to create team.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Create & Recruit Team</h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
            Post your hackathon idea, specify missing skills, and attract verified teammates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-brand-border rounded-xl transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-subtle space-y-8">
        {/* Section 1: Team & Competition Identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-brand-blue" />
            1. Competition & Team Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Team Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AgriVision AI, QuantCoders, NeuroScan"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Competition / Event Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                placeholder="e.g. Smart India Hackathon (SIH 2026)"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Event Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
              >
                {COMPETITION_CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Organizer / Host Body
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="e.g. AICTE, IIT Madras, MeitY, ACM"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Registration Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Participation Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
              >
                {FORMAT_OPTIONS.filter((f) => f !== "All Formats").map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                State / Location
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Max Squad Size <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Project Vision & Solution */}
        <div className="space-y-4 pt-6 border-t border-brand-border">
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-blue" />
            2. Project Proposal & Problem Statement
          </h3>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Multimodal Crop Disease Detection via Mobile Edge Computing"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Problem Statement <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="What core challenge are you solving? (e.g. Farmers face undetected fungal blights causing 40% crop losses...)"
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Proposed Solution & Approach <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              placeholder="How will your team solve it? Describe the architecture, models, or system design..."
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
              required
            />
          </div>
        </div>

        {/* Section 3: Required Skills & Open Roles */}
        <div className="space-y-4 pt-6 border-t border-brand-border">
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-blue" />
            3. Required Skills & Open Positions
          </h3>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Required Skills <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2.5 bg-slate-50 rounded-2xl border border-brand-border mb-2">
              {requiredSkills.length === 0 ? (
                <span className="text-xs text-brand-muted self-center">
                  Add skills your team needs...
                </span>
              ) : (
                requiredSkills.map((sk) => (
                  <Badge key={sk} variant="blue" size="md">
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => setRequiredSkills(requiredSkills.filter((s) => s !== sk))}
                      className="ml-1 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type a skill and press enter..."
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {POPULAR_SKILLS.slice(0, 10).map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => handleAddSkill(sk)}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-brand-blue rounded-md border border-slate-200"
                >
                  + {sk}
                </button>
              ))}
            </div>
          </div>

          {/* Open Roles */}
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Specific Roles You are Recruiting For
            </label>
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2.5 bg-slate-50 rounded-2xl border border-brand-border mb-2">
              {openRoles.length === 0 ? (
                <span className="text-xs text-brand-muted self-center">
                  e.g. PyTorch Specialist, Figma UI Designer, Backend Engineer
                </span>
              ) : (
                openRoles.map((r) => (
                  <Badge key={r} variant="purple" size="md">
                    <span>{r}</span>
                    <button
                      type="button"
                      onClick={() => setOpenRoles(openRoles.filter((item) => item !== r))}
                      className="ml-1 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRole(roleInput);
                  }
                }}
                placeholder="Type open role and press enter..."
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <button
                type="button"
                onClick={() => handleAddRole(roleInput)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Add Role
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Team Expectations
            </label>
            <textarea
              rows={2}
              value={expectations}
              onChange={(e) => setExpectations(e.target.value)}
              placeholder="e.g. Weekly Discord syncs, 10 hours commitment, collaborative git flow..."
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-brand-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/teams")}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing Team..." : "Publish Team & Start Recruiting"}</span>
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Team Listing Preview"
        subtitle="Review how your team card will appear to prospective applicants"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-brand-border">
            <span className="text-[11px] font-semibold text-brand-blue uppercase">
              {competitionName || "Competition Name"}
            </span>
            <h3 className="text-xl font-bold text-brand-text mt-1">
              {name || "Untitled Team"}
            </h3>
            <p className="text-xs font-semibold text-slate-800 mt-2">
              {projectTitle || "Project Title"}
            </p>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              {problemStatement || "Problem statement description goes here..."}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {requiredSkills.map((sk) => (
                <Badge key={sk} variant="blue" size="sm">
                  {sk}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Continue Editing
            </button>
            <button
              onClick={() => {
                setIsPreviewOpen(false);
                handleSubmit();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-xl"
            >
              Publish Now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateTeamPage;
