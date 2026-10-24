import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";
import { ConversationList } from "../../components/chat/ConversationList";
import { ChatWindow } from "../../components/chat/ChatWindow";
import { EmptyState } from "../../components/common/EmptyState";
import { MessageSquare } from "lucide-react";
import { messageService } from "../../services/api/messageService";

export const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversation,
    fetchConversations,
    sendMessage,
    isLoading,
  } = useMessageStore();

  const convParam = searchParams.get("conversationId");
  const teamParam = searchParams.get("teamId");

  useEffect(() => {
    if (teamParam) {
      messageService
        .getTeamConversation(teamParam)
        .then((res) => {
          if (res?.conversation) {
            const id = res.conversation._id || res.conversation.id;
            fetchConversations(id);
          } else {
            fetchConversations();
          }
        })
        .catch(() => fetchConversations());
    } else if (convParam) {
      fetchConversations(convParam);
    } else {
      // Don't auto-open any chat by default when entering the page directly
      setActiveConversation(null);
      fetchConversations();
    }
  }, [convParam, teamParam, fetchConversations, setActiveConversation]);

  const activeConv = useMemo(() => {
    if (!activeConversationId || !conversations || conversations.length === 0) {
      return null;
    }
    return conversations.find((c) => (c._id || c.id) === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const activeId = activeConv ? activeConv._id || activeConv.id : null;
  const currentMessages = activeId ? messages[activeId] || [] : [];

  const handleSendMessage = (text) => {
    if (activeId && user) {
      sendMessage(activeId, text);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Team Communications</h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
          Authorized team chat channels for confirmed squad members
        </p>
      </div>

      <div className="h-[calc(100vh-12rem)] min-h-[500px] bg-white rounded-3xl border border-brand-border overflow-hidden shadow-subtle flex flex-col md:flex-row">
        {isLoading && (!conversations || conversations.length === 0) ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-xs text-brand-muted">Loading authorized channels...</p>
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={MessageSquare}
              title="No Authorized Team Channels Yet"
              description="Team chat rooms unlock automatically once you create a team or your join request is accepted by a team leader."
              actionText="Explore Open Teams"
              onAction={() => (window.location.href = "/teams")}
            />
          </div>
        ) : (
          <>
            {/* Left Channel Sidebar */}
            <div className="w-full md:w-80 h-48 md:h-full flex-shrink-0">
              <ConversationList
                conversations={conversations}
                activeId={activeId}
                onSelect={(id) => setActiveConversation(id)}
              />
            </div>

            {/* Right Chat Area */}
            <div className="flex-1 h-full min-w-0 flex flex-col">
              {activeConv ? (
                <ChatWindow
                  conversation={activeConv}
                  messages={currentMessages}
                  onSendMessage={handleSendMessage}
                  isAuthorized={true}
                />
              ) : (
                <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue mb-4 shadow-sm">
                    <MessageSquare className="w-8 h-8 text-brand-blue" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-brand-text mb-1">
                    Select a Team Channel
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted max-w-sm leading-relaxed">
                    Choose an authorized squad chat from the channel list on the left to start messaging, sharing updates, or launching a video meeting.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
