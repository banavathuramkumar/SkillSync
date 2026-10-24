import React, { useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

export const SettingsPage = () => {
  const { user, logout } = useAuthStore();

  // Notification toggles
  const [requestAlerts, setRequestAlerts] = useState(true);
  const [chatAlerts, setChatAlerts] = useState(true);
  const [meetingAlerts, setMeetingAlerts] = useState(true);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in current and new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Security preferences updated.");
  };

  const handleSignOutAll = () => {
    logout();
    toast.info("Logged out of session.");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Account Settings</h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
          Manage real-time notification preferences, credentials, and session state
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
          <Bell className="w-5 h-5 text-brand-blue" />
          <h3 className="text-base font-bold text-brand-text">
            In-App Notification Preferences
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-brand-text">
                Candidate Join Requests
              </p>
              <p className="text-[11px] text-brand-muted">
                Receive real-time push alerts when students apply for your squads
              </p>
            </div>
            <input
              type="checkbox"
              checked={requestAlerts}
              onChange={(e) => {
                setRequestAlerts(e.target.checked);
                toast.success("Preferences updated.");
              }}
              className="rounded text-brand-blue focus:ring-brand-blue"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-brand-text">
                Team Chat Messages & Mentions
              </p>
              <p className="text-[11px] text-brand-muted">
                Receive alerts when team members post updates in authorized channels
              </p>
            </div>
            <input
              type="checkbox"
              checked={chatAlerts}
              onChange={(e) => {
                setChatAlerts(e.target.checked);
                toast.success("Preferences updated.");
              }}
              className="rounded text-brand-blue focus:ring-brand-blue"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-brand-text">
                Live Video Meeting Invitations
              </p>
              <p className="text-[11px] text-brand-muted">
                Receive instant pop-ups when a teammate initiates a sync or group call
              </p>
            </div>
            <input
              type="checkbox"
              checked={meetingAlerts}
              onChange={(e) => {
                setMeetingAlerts(e.target.checked);
                toast.success("Preferences updated.");
              }}
              className="rounded text-brand-blue focus:ring-brand-blue"
            />
          </label>
        </div>
      </div>

      {/* Security & Password */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
          <Lock className="w-5 h-5 text-brand-blue" />
          <h3 className="text-base font-bold text-brand-text">
            Security & Authentication
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-rose-100 border-b">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-bold text-rose-900">
            Session & Account
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-200">
          <div>
            <p className="text-xs sm:text-sm font-bold text-rose-900">
              Sign Out Everywhere
            </p>
            <p className="text-[11px] text-rose-700">
              Terminates your active authorization tokens and disconnects real-time sockets
            </p>
          </div>

          <button
            onClick={handleSignOutAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
