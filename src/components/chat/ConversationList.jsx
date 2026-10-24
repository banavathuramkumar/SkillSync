import React, { useState } from "react";
import { Search, Users } from "lucide-react";
import { formatTimeAgo } from "../../utils/formatters";

export const ConversationList = ({
  conversations = [],
  activeId,
  onSelect,
}) => {
  const [query, setQuery] = useState("");

  const filtered = conversations.filter((c) => {
    const title = c.team?.name || c.name || c.teamName || "Channel";
    return title.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-brand-border">
      {/* Header & Search */}
      <div className="p-4 border-b border-brand-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-brand-text">Team Channels</h3>
          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-brand-blue rounded-full">
            {conversations.length} Active
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team chats..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      {/* Conversations Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-brand-muted">
            {query ? "No matching team channels" : "No joined team chats yet"}
          </div>
        ) : (
          filtered.map((conv) => {
            const convId = conv._id || conv.id;
            const isActive = convId === activeId;
            const title = conv.team?.name || conv.name || conv.teamName || "Channel";
            const initials = title.substring(0, 2).toUpperCase();
            const memberCount =
              conv.participants?.length ||
              conv.participantIds?.length ||
              conv.team?.members?.length ||
              1;

            return (
              <button
                key={convId}
                onClick={() => onSelect(convId)}
                className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                  isActive
                    ? "bg-blue-50/70 border-l-4 border-brand-blue"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-brand-blue flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-brand-text truncate">
                      {title}
                    </h4>
                    {conv.lastMessage?.timestamp && (
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {formatTimeAgo(conv.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-brand-muted truncate">
                    {conv.lastMessage?.text || "No messages yet"}
                  </p>

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {memberCount} members
                    </span>

                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-brand-blue text-white rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
