import React, { useEffect, useState } from "react";
import { X, Maximize2, MessageSquare, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";
import { messageService } from "../../services/api/messageService";
import { ChatWindow } from "./ChatWindow";

export const TeamChatDrawer = ({ isOpen, onClose, teamId, teamName }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    messages,
    sendMessage,
    fetchMessages,
    setActiveConversation,
  } = useMessageStore();

  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !teamId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadTeamChat = async () => {
      try {
        const res = await messageService.getTeamConversation(teamId);
        if (isMounted && res.success && res.conversation) {
          const conv = res.conversation;
          setConversation(conv);
          setActiveConversation(conv._id || conv.id);
          await fetchMessages(conv._id || conv.id);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.error ||
              err.message ||
              "Could not open team chat."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTeamChat();

    return () => {
      isMounted = false;
    };
  }, [isOpen, teamId, setActiveConversation, fetchMessages]);

  if (!isOpen) return null;

  const convId = conversation?._id || conversation?.id;
  const currentMessages = convId ? messages[convId] || [] : [];

  const handleSendMessage = (text) => {
    if (convId) {
      sendMessage(convId, text);
    }
  };

  const handleExpandToFullScreen = () => {
    if (convId) {
      navigate(`/messages?conversationId=${convId}`);
    } else if (teamId) {
      navigate(`/messages?teamId=${teamId}`);
    } else {
      navigate("/messages");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-brand-border">
        {/* Drawer Header */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-brand-blue flex-shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-brand-text truncate">
                {teamName || conversation?.name || "Team Squad Chat"}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Squad Communications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleExpandToFullScreen}
              className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded-xl transition-colors"
              title="Open Full Page Communications"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-hidden relative">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold text-brand-text">
                Opening team channel...
              </p>
              <p className="text-[11px] text-brand-muted mt-0.5">
                Connecting to authorized squad room
              </p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
              <p className="text-sm font-bold text-brand-text">Channel Restricted</p>
              <p className="text-xs text-brand-muted mt-1 max-w-xs">{error}</p>
            </div>
          ) : conversation ? (
            <ChatWindow
              conversation={conversation}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
              isAuthorized={true}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-brand-muted p-8">
              No conversation available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamChatDrawer;
