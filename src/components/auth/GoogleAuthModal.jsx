import React, { useState, useEffect } from "react";
import { X, ArrowRight, ShieldCheck, Mail, User } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const GoogleAuthModal = ({ isOpen, onClose, redirectPath = "/dashboard" }) => {
  const navigate = useNavigate();
  const { loginWithGoogle, isLoading } = useAuthStore();
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  // Handle Google callback if Google Identity Services is initialized
  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              const result = await loginWithGoogle({ credential: response.credential });
              if (result.success) {
                toast.success(`Welcome, ${result.user.name}!`);
                onClose();
                if (!result.user.isProfileComplete) {
                  navigate("/profile-setup");
                } else {
                  navigate(redirectPath);
                }
              }
            }
          },
        });
        const buttonDiv = document.getElementById("google-official-btn");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: 320,
            text: "continue_with",
            shape: "pill",
          });
        }
      } catch (err) {
        console.warn("[GoogleAuth] GSI initialization:", err.message);
      }
    }
  }, [isOpen, loginWithGoogle, navigate, onClose, redirectPath]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmail.trim() || !googleEmail.includes("@")) {
      return toast.error("Please enter a valid Google email address.");
    }

    const email = googleEmail.trim().toLowerCase();
    const name = googleName.trim() || email.split("@")[0];

    const result = await loginWithGoogle({
      email,
      name,
    });

    if (result.success) {
      toast.success(`Signed in as ${result.user.name}!`);
      onClose();
      if (!result.user.isProfileComplete) {
        navigate("/profile-setup");
      } else {
        navigate(redirectPath);
      }
    } else {
      toast.error(result.error || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text">Sign in with Google</h3>
            <p className="text-xs text-brand-muted">Direct authentication to SkillSync</p>
          </div>
        </div>

        {/* Official Google Identity Button Slot (if VITE_GOOGLE_CLIENT_ID configured) */}
        <div id="google-official-btn" className="flex justify-center mb-4 empty:hidden" />

        {/* Direct Google Sign-in / Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                placeholder="e.g. Your Name"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Google Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <span>{isLoading ? "Connecting to Google..." : "Continue with Google"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Direct Google Authentication</span>
          </div>
          <span>SkillSync v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthModal;
