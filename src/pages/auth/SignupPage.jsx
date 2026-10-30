import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { SkillSyncLogo } from "../../components/common/SkillSyncLogo";
import { useAuthStore } from "../../store/useAuthStore";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Community Guidelines & Terms.");
      return;
    }

    setIsLoading(true);
    const result = await signup(name, email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success("Account created! Please complete your mandatory student profile to unlock the platform.");
      navigate("/profile-setup");
    } else {
      toast.error(result.error || "Unable to create account.");
    }
  };

  const handleOpenGoogleModal = () => {
    setIsGoogleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <SkillSyncLogo size="lg" />
          </Link>
          <h2 className="text-2xl font-bold text-brand-text">Create your account</h2>
          <p className="text-xs text-brand-muted mt-1">
            Join collegiate builders from across India
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            <span>
              I agree to the{" "}
              <Link to="/guidelines" className="text-brand-blue hover:underline">
                Community Guidelines
              </Link>{" "}
              and Privacy Policy.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <span>{isLoading ? "Creating account..." : "Continue to Profile Setup"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-brand-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-blue font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
