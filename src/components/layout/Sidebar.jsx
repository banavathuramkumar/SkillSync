import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Briefcase,
  Trophy,
  MessageSquare,
  Bell,
  Bookmark,
  User,
  Settings,
  HelpCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { SkillSyncLogo } from "../common/SkillSyncLogo";
import { useMessageStore } from "../../store/useMessageStore";
import { useNotificationStore } from "../../store/useNotificationStore";

export const Sidebar = ({ isOpen, onClose }) => {
  const { conversations } = useMessageStore();
  const { notifications } = useNotificationStore();

  const totalUnreadMessages = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true },
    { label: "Find Teams", path: "/teams", icon: Users, end: true },
    { label: "Create Team", path: "/teams/create", icon: PlusCircle, end: true },
    { label: "My Teams", path: "/my-teams", icon: Briefcase },
    { label: "Competitions", path: "/competitions", icon: Trophy },
    {
      label: "Messages",
      path: "/messages",
      icon: MessageSquare,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : null,
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : null,
    },
    { label: "Saved Teams", path: "/saved-teams", icon: Bookmark },
    { label: "My Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const secondaryItems = [
    { label: "Help & Feedback", path: "/help", icon: HelpCircle },
    { label: "Community Guidelines", path: "/guidelines", icon: ShieldCheck },
  ];

  const handleNavClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-brand-border">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
        <NavLink
          to="/dashboard"
          onClick={handleNavClick}
          className="flex items-center gap-2.5 group"
        >
          <SkillSyncLogo size="md" />
        </NavLink>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Nav Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <div>
          <p className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Platform Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-blue text-white shadow-sm shadow-blue-500/20 font-semibold"
                        : "text-slate-600 hover:text-brand-blue hover:bg-slate-50"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[11px] font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Support & Info
          </p>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-slate-100 text-brand-text font-semibold"
                        : "text-slate-600 hover:text-brand-blue hover:bg-slate-50"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
