import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Trash2,
  UserPlus,
  MessageSquare,
  Trophy,
  Video,
  Info,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useNotificationStore } from "../../store/useNotificationStore";
import { formatTimeAgo } from "../../utils/formatters";
import { EmptyState } from "../../components/common/EmptyState";

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    isLoading,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case "join_request":
        return <UserPlus className="w-5 h-5 text-brand-blue" />;
      case "join_accepted":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "join_rejected":
        return <Info className="w-5 h-5 text-slate-400" />;
      case "meeting":
        return <Video className="w-5 h-5 text-blue-600" />;
      case "comment":
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case "competition":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-brand-blue" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Notifications</h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
            Real-time activity alerts, candidate requests, and team updates
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={async () => {
              await markAllAsRead();
              toast.success("All notifications marked as read.");
            }}
            className="text-xs font-semibold text-brand-blue hover:underline self-start sm:self-auto"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading && notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-border">
          <p className="text-xs text-brand-muted">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! You'll receive updates when teammates apply or replies are posted."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border divide-y divide-slate-100 shadow-subtle overflow-hidden">
          {notifications.map((notif) => {
            const notifId = notif._id || notif.id;

            return (
              <div
                key={notifId}
                onClick={() => {
                  markAsRead(notifId);
                  if (notif.link) navigate(notif.link);
                }}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                  !notif.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-2xl bg-white border border-brand-border shadow-subtle flex-shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-brand-text">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-blue" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(notif.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notifId);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
