import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  MapPin,
  Mail,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Code2,
  Camera,
  Trash2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetcodeIcon } from "../../components/common/BrandIcons";
import { toast } from "sonner";
import { SkillSyncLogo } from "../../components/common/SkillSyncLogo";
import { UserAvatar } from "../../components/common/UserAvatar";
import { useAuthStore } from "../../store/useAuthStore";
import { EDUCATION_LEVELS, INDIAN_STATES, MAJOR_CITIES, POPULAR_SKILLS } from "../../constants/skills";

export const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { user, completeProfile, uploadResume, uploadAvatar } = useAuthStore();

  const [fullName, setFullName] = useState(user?.name || "");
  const [college, setCollege] = useState(user?.college || "");
  const [educationLevel, setEducationLevel] = useState(user?.educationLevel || "");
  const [state, setState] = useState(user?.state || "");
  const [city, setCity] = useState(user?.city || "");
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [bio, setBio] = useState(user?.bio || "");
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");
  const [leetcodeUrl, setLeetcodeUrl] = useState(user?.leetcodeUrl || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFilename || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Picture state (if not selected, no profile pic)
  const [avatarOption, setAvatarOption] = useState(user?.avatar ? "upload" : "none"); // "none" | "upload"
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  // URL Validator
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (selectedSkills.includes(trimmed)) {
      toast.info(`"${trimmed}" is already added.`);
      return;
    }
    setSelectedSkills([...selectedSkills, trimmed]);
    setCustomSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Invalid file format. Please upload a PDF resume.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume file size exceeds the 5MB limit.");
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
    toast.success(`Resume selected: ${file.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mandatory checks for all fields
    if (!fullName.trim()) {
      toast.error("Full Name is mandatory.");
      return;
    }
    if (!college.trim()) {
      toast.error("College or School name is mandatory.");
      return;
    }
    if (!educationLevel) {
      toast.error("Education Level selection is mandatory.");
      return;
    }
    if (!state) {
      toast.error("State selection is mandatory.");
      return;
    }
    if (!city.trim()) {
      toast.error("City is mandatory.");
      return;
    }
    if (selectedSkills.length === 0) {
      toast.error("Please add at least one technical skill.");
      return;
    }
    if (!bio.trim() || bio.trim().length < 20) {
      toast.error("Please write a short description (at least 20 characters).");
      return;
    }
    if (!githubUrl.trim() || !isValidUrl(githubUrl.trim())) {
      toast.error("A valid GitHub profile URL is mandatory.");
      return;
    }
    if (!linkedinUrl.trim() || !isValidUrl(linkedinUrl.trim())) {
      toast.error("A valid LinkedIn profile URL is mandatory.");
      return;
    }
    if (!leetcodeUrl.trim() || !isValidUrl(leetcodeUrl.trim())) {
      toast.error("A valid LeetCode profile URL is mandatory.");
      return;
    }
    if (!resumeFileName && !resumeFile) {
      toast.error("Uploading a PDF resume (max 5MB) is mandatory.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload avatar if user selected photo upload
      let finalAvatarUrl = avatarOption === "upload" ? avatarPreview : "";
      if (avatarOption === "upload" && avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        const avatarRes = await uploadAvatar(avatarFormData);
        if (avatarRes?.avatarUrl) {
          finalAvatarUrl = avatarRes.avatarUrl;
        }
      }

      // 2. Upload resume to backend if file selected
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        await uploadResume(formData);
      }

      // 3. Save profile fields
      const profileData = {
        name: fullName.trim(),
        college: college.trim(),
        educationLevel,
        state,
        city: city.trim(),
        skills: selectedSkills,
        bio: bio.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        leetcodeUrl: leetcodeUrl.trim(),
        resumeName: resumeFileName,
        avatar: finalAvatarUrl,
      };

      const result = await completeProfile(profileData);

      if (result.success) {
        toast.success("Profile completed successfully! Welcome to SkillSync.");
        navigate("/dashboard");
      } else {
        toast.error(result.error || "Failed to save profile.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to complete profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-card">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b border-brand-border">
          <div className="mb-3 flex justify-center">
            <SkillSyncLogo size="lg" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
            Mandatory Profile Completion
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto mt-1">
            SkillSync requires verified student credentials to ensure authentic, high-quality team formations for SIH and national hackathons.
          </p>
        </div>

        {/* Mandatory Gate Notice */}
        <div className="mb-8 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-brand-blue">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            All fields below are mandatory to activate your account. You will not be able to browse or request to join teams until this step is completed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Profile Picture Selection */}
          <div className="space-y-3 p-5 rounded-2xl border border-brand-border bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-brand-text">
                  Profile Picture (Optional)
                </h3>
                <p className="text-xs text-brand-muted">
                  Choose whether to upload a photo or continue without one
                </p>
              </div>
              <UserAvatar
                user={{ name: fullName || "Student", avatar: avatarOption === "upload" ? avatarPreview : "" }}
                size="lg"
                className="border-2 border-brand-blue/30 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  avatarOption === "none"
                    ? "bg-blue-50/80 border-brand-blue text-brand-blue font-semibold shadow-sm"
                    : "bg-white border-brand-border text-slate-600 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="avatarChoice"
                  checked={avatarOption === "none"}
                  onChange={() => {
                    setAvatarOption("none");
                    setAvatarFile(null);
                    setAvatarPreview("");
                  }}
                  className="w-4 h-4 text-brand-blue"
                />
                <div className="text-left text-xs">
                  <span className="block font-bold">No Profile Picture</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Display clean student initials only
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  avatarOption === "upload"
                    ? "bg-blue-50/80 border-brand-blue text-brand-blue font-semibold shadow-sm"
                    : "bg-white border-brand-border text-slate-600 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="avatarChoice"
                  checked={avatarOption === "upload"}
                  onChange={() => setAvatarOption("upload")}
                  className="w-4 h-4 text-brand-blue"
                />
                <div className="text-left text-xs">
                  <span className="block font-bold">Upload Profile Picture</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    JPG, PNG, or WebP up to 3MB
                  </span>
                </div>
              </label>
            </div>

            {avatarOption === "upload" && (
              <div className="pt-2 animate-fade-in">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (!file.type.startsWith("image/")) {
                        return toast.error("Please select a valid image file.");
                      }
                      if (file.size > 3 * 1024 * 1024) {
                        return toast.error("Image file must be under 3MB.");
                      }
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue-dark cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Section: Academic Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-blue" />
              Academic & Personal Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Banavathu Ramkumar"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">
                  Email Address <span className="text-slate-400 text-[10px]">(Read-only)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user?.email || "user@university.edu.in"}
                    readOnly
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-100 text-slate-500 border border-brand-border rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-text mb-1.5">
                  College or School <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. SRM University AP, IIT Madras, BITS Pilani"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">
                  Education Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-slate-700"
                  required
                >
                  <option value="">Select Level...</option>
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1.5">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none text-slate-700"
                    required
                  >
                    <option value="">Select...</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Amaravati"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Technical Skills */}
          <div className="space-y-3 pt-4 border-t border-brand-border">
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-blue" />
              Technical Skills & Proficiencies <span className="text-rose-500">*</span>
            </h3>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 bg-slate-50 rounded-2xl border border-brand-border">
              {selectedSkills.length === 0 ? (
                <span className="text-xs text-brand-muted self-center">
                  Select recommended skills below or type custom ones...
                </span>
              ) : (
                selectedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-brand-blue border border-blue-200 text-xs font-semibold rounded-full"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sk)}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(customSkillInput);
                  }
                }}
                placeholder="Type a skill and click Add..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(customSkillInput)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Suggested Skill Pills */}
            <div>
              <p className="text-[11px] font-semibold text-brand-muted mb-2">
                Quick Add Suggestions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.slice(0, 14).map((sk) => (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleAddSkill(sk)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      selectedSkills.includes(sk)
                        ? "bg-blue-100 text-brand-blue border-blue-300 font-semibold"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    + {sk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Short Personal Bio */}
          <div className="space-y-2 pt-4 border-t border-brand-border">
            <label className="block text-xs font-semibold text-brand-text">
              Personal Bio / About You <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell team leaders about your hackathon goals, past projects, domains of interest, or what you enjoy building..."
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue resize-none"
              required
            />
            <p className="text-[11px] text-brand-muted">
              Minimum 20 characters. This appears on your applicant card when applying to teams.
            </p>
          </div>

          {/* Section: Professional Links */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-blue" />
              Verified Developer Links <span className="text-rose-500">*</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  GitHub Profile URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  LinkedIn Profile URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <LinkedinIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  LeetCode Profile URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <LeetcodeIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={leetcodeUrl}
                    onChange={(e) => setLeetcodeUrl(e.target.value)}
                    placeholder="https://leetcode.com/..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Resume Upload */}
          <div className="space-y-3 pt-4 border-t border-brand-border">
            <label className="block text-xs font-semibold text-brand-text">
              Upload Resume (PDF only, up to 5 MB) <span className="text-rose-500">*</span>
            </label>

            <div className="border-2 border-dashed border-brand-border rounded-2xl p-6 text-center hover:bg-slate-50/50 transition-colors relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                {resumeFileName ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selected: {resumeFileName}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-semibold text-brand-text">
                      Click or drag and drop your PDF resume here
                    </p>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Accepted format: PDF up to 5 MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-brand-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Saving Profile & Uploading Resume..." : "Complete Profile & Enter SkillSync"}
            </button>
            <p className="text-center text-[11px] text-brand-muted mt-2">
              By completing your profile, you agree to represent your skills honestly to team leaders.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
