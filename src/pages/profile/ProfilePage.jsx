import React, { useState, useRef } from "react";
import {
  User,
  GraduationCap,
  MapPin,
  Mail,
  FileText,
  Edit2,
  Check,
  X,
  Upload,
  Plus,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Camera,
  Trash2,
  Image,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetcodeIcon } from "../../components/common/BrandIcons";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { useTeamStore } from "../../store/useTeamStore";
import { Badge } from "../../components/common/Badge";
import { UserAvatar } from "../../components/common/UserAvatar";
import { EDUCATION_LEVELS, INDIAN_STATES, POPULAR_SKILLS } from "../../constants/skills";

export const ProfilePage = () => {
  const { user, updateProfile, uploadAvatar, removeAvatar } = useAuthStore();
  const { teams } = useTeamStore();

  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Edit form state
  const [name, setName] = useState(user?.name || "");
  const [college, setCollege] = useState(user?.college || "");
  const [educationLevel, setEducationLevel] = useState(user?.educationLevel || "");
  const [state, setState] = useState(user?.state || "");
  const [city, setCity] = useState(user?.city || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");
  const [leetcodeUrl, setLeetcodeUrl] = useState(user?.leetcodeUrl || "");
  const [resumeName, setResumeName] = useState(user?.resumeName || "Verified_Resume.pdf");

  const myTeams = teams.filter(
    (t) =>
      user &&
      (t.ownerId === user.id || t.members.some((m) => m.userId === user.id))
  );

  const handleAddSkill = (skill) => {
    const s = skill.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((item) => item !== skill));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim(),
      college: college.trim(),
      educationLevel,
      state,
      city: city.trim(),
      bio: bio.trim(),
      skills,
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      leetcodeUrl: leetcodeUrl.trim(),
      resumeName,
    });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF format resume.");
      return;
    }
    setResumeName(file.name);
    toast.success(`Selected new resume: ${file.name}`);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image file (PNG, JPG, WebP).");
    }
    if (file.size > 3 * 1024 * 1024) {
      return toast.error("Image file size must be under 3 MB.");
    }

    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData);
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload profile picture.");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await removeAvatar();
      toast.success("Profile picture removed. Initials will be displayed.");
    } catch (err) {
      toast.error("Failed to remove profile picture.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar with Photo Controls */}
            <div className="relative group flex-shrink-0">
              <UserAvatar
                user={user}
                size="2xl"
                className="border-4 border-white shadow-lg ring-2 ring-brand-blue/20"
              />

              {/* Photo Action Overlay / Buttons */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg shadow-sm transition-colors"
                  title="Upload / Change Profile Picture"
                >
                  <Camera className="w-3 h-3" />
                  <span>{isUploadingPhoto ? "..." : user?.avatar ? "Change" : "Upload"}</span>
                </button>

                {user?.avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors"
                    title="Remove Profile Picture (Use Initials)"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text">
                  {user?.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Student
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-brand-blue mt-1">
                {user?.college} • {user?.educationLevel}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-brand-muted mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user?.city ? `${user.city}, ${user.state}` : user?.state || "India"}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Bio */}
        {!isEditing && user?.bio && (
          <div className="mt-6 pt-6 border-t border-brand-border">
            <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
              About
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {user.bio}
            </p>
          </div>
        )}
      </div>

      {/* Edit Form or View Sections */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
          <h3 className="text-base font-bold text-brand-text pb-3 border-b border-brand-border">
            Update Student Profile Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                College or University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
              >
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-2.5 py-2.5 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
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
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-2.5 py-2.5 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Personal Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
            />
          </div>

          {/* Skills Editor */}
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Technical Skills
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-brand-border mb-2">
              {skills.map((sk) => (
                <Badge key={sk} variant="blue" size="md">
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="ml-1 hover:text-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add skill..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkillInput)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>

          {/* Social Links Editor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                LeetCode URL
              </label>
              <input
                type="url"
                value={leetcodeUrl}
                onChange={(e) => setLeetcodeUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Resume Re-upload */}
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Resume Document (PDF)
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 truncate">
                Current: {resumeName}
              </span>
              <label className="cursor-pointer px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
                <span>Upload New PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Save & Cancel */}
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skills & Links Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-3">
              <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider">
                Technical Skills & Domains
              </h4>
              <div className="flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((sk) => (
                    <Badge key={sk} variant="blue" size="md">
                      {sk}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-brand-muted">No skills listed</span>
                )}
              </div>
            </div>

            {/* My Active Teams */}
            <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider">
                  Active Squad Memberships ({myTeams.length})
                </h4>
                <a
                  href="/my-teams"
                  className="text-xs font-semibold text-brand-blue hover:underline"
                >
                  Manage Teams
                </a>
              </div>

              {myTeams.length === 0 ? (
                <p className="text-xs text-brand-muted">Not participating in any teams yet.</p>
              ) : (
                <div className="space-y-2">
                  {myTeams.map((team) => (
                    <div
                      key={team.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-brand-text">{team.name}</p>
                        <p className="text-[11px] text-brand-muted">{team.competitionName}</p>
                      </div>
                      <a
                        href={`/teams/${team.id}`}
                        className="text-xs font-semibold text-brand-blue hover:underline"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Links & Resume */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
              <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider">
                Verified Handles
              </h4>

              <div className="space-y-2.5">
                {user?.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GithubIcon className="w-4 h-4 text-slate-900" />
                      <span>GitHub</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {user?.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LinkedinIcon className="w-4 h-4 text-blue-600" />
                      <span>LinkedIn</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {user?.leetcodeUrl && (
                  <a
                    href={user.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LeetcodeIcon className="w-4 h-4 text-amber-600" />
                      <span>LeetCode</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>

              {/* Resume Card */}
              <div className="pt-2">
                {user?.resumeUrl ? (
                  <a
                    href={
                      user.resumeUrl.startsWith("http")
                        ? user.resumeUrl
                        : `${
                            (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
                              ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
                              : "") ||
                            (typeof window !== "undefined" && window.location.hostname !== "localhost"
                              ? "https://skillsync-api-nqdt.onrender.com"
                              : "http://localhost:5000")
                          }${user.resumeUrl.startsWith("/") ? "" : "/"}${user.resumeUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>View Uploaded Resume (PDF)</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                ) : (
                  <div className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-500 border border-slate-200 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>No Resume Uploaded</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
