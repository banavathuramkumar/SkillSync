import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import { SkillSyncLogo } from "../../components/common/SkillSyncLogo";
import { useAuthStore } from "../../store/useAuthStore";
import { GoogleAuthModal } from "../../components/auth/GoogleAuthModal";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`);
      if (!result.user.isProfileComplete) {
        navigate("/profile-setup");
      } else {
        navigate(from);
      }
    } else {
      toast.error(result.error || "Invalid credentials.");
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
          <h2 className="text-2xl font-bold text-brand-text">Welcome back</h2>
          <p className="text-xs text-brand-muted mt-1">
            Sign in to access your collegiate squads, hackathons, and chats
          </p>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="you@university.edu.in"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-brand-text">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-brand-blue hover:underline font-medium"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <span>{isLoading ? "Signing in..." : "Sign In to SkillSync"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-brand-border w-full" />
          <span className="bg-white px-3 text-xs text-brand-muted uppercase tracking-wider absolute">
            or
          </span>
        </div>

        {/* Google OAuth Button */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={handleOpenGoogleModal}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-brand-border text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.1-6.71-4.93H1.26v3.13C3.27 21.37 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.29 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.26C.46 8.19 0 9.99 0 12s.46 3.81 1.26 5.41l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.63 1.26 6.59l4.03 3.13c.95-2.83 3.59-4.97 6.71-4.97z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Google Auth Modal */}
        <GoogleAuthModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          redirectPath={from}
        />

        {/* Link to Signup */}
        <p className="text-center text-xs text-brand-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="text-brand-blue font-bold hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
