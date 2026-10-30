import React, { useState } from "react";
import { MessageSquare, Send, CornerDownRight, Edit2, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "../common/UserAvatar";
import { useAuthStore } from "../../store/useAuthStore";
import { teamService } from "../../services/api/teamService";
import { formatTimeAgo } from "../../utils/formatters";

export const CommentSection = ({ teamId, comments = [] }) => {
  const { user } = useAuthStore();
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    teamService.addComment(teamId, newCommentText.trim());
    setNewCommentText("");
    toast.success("Comment posted to discussion!");
  };

  const handlePostReply = (parentCommentId) => {
    if (!replyText.trim()) return;

    teamService.addComment(teamId, replyText.trim(), parentCommentId);
    setReplyText("");
    setReplyingToId(null);
    toast.success("Reply added!");
  };

  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) return;
    teamService.editComment(commentId, editText.trim());
    setEditingCommentId(null);
    setEditText("");
    toast.success("Comment updated.");
  };

  const handleDelete = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      teamService.deleteComment(commentId);
      toast.info("Comment deleted.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-blue" />
          <h4 className="text-base font-bold text-brand-text">
            Team Discussion ({comments.length})
          </h4>
        </div>
        <span className="text-xs text-brand-muted">
          Public questions & collaborative queries
        </span>
      </div>

      {/* Post New Comment Box */}
      <form onSubmit={handlePostComment} className="flex gap-3">
        <UserAvatar
          user={user}
          size="sm"
          className="w-9 h-9 rounded-xl flex-shrink-0"
        />
        <div className="flex-1 space-y-2">
          <textarea
            rows={2}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Ask the team lead a question or share project ideas..."
            className="w-full text-xs sm:text-sm p-3 bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none shadow-subtle"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Comment</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-brand-border text-xs text-brand-muted">
            No discussion yet. Start the conversation with the team leader!
          </div>
        ) : (
          comments.map((comment) => {
            const isAuthor = user?.id === comment.userId;
            const isEditing = editingCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className="p-4 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-3"
              >
                {/* Author Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-text">
                          {comment.userName}
                        </span>
                        {comment.userCollege && (
                          <span className="text-[10px] text-brand-muted bg-slate-100 px-2 py-0.5 rounded-full">
                            {comment.userCollege}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Author */}
                  {isAuthor && !isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditText(comment.content);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-blue rounded hover:bg-slate-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Body or Inline Editor */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-brand-blue text-white rounded-lg font-medium"
                      >
                        <Check className="w-3 h-3" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10">
                    {comment.content}
                  </p>
                )}

                {/* Reply trigger button */}
                <div className="pl-10 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setReplyingToId(
                        replyingToId === comment.id ? null : comment.id
                      );
                      setReplyText("");
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:underline"
                  >
                    <CornerDownRight className="w-3 h-3" />
                    Reply
                  </button>
                </div>

                {/* Reply Composer */}
                {replyingToId === comment.id && (
                  <div className="ml-10 pt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.userName}...`}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handlePostReply(comment.id)}
                        disabled={!replyText.trim()}
                        className="px-3 py-1 text-xs bg-brand-blue text-white rounded-lg font-medium disabled:opacity-50"
                      >
                        Submit Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-10 space-y-2 pt-2 border-t border-slate-100">
                    {comment.replies.map((reply) => {
                      const isReplyAuthor = user?.id === reply.userId;
                      return (
                        <div
                          key={reply.id}
                          className="p-3 bg-slate-50/80 rounded-xl space-y-1.5 border border-slate-100"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={reply.userAvatar}
                                alt={reply.userName}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                              />
                              <span className="text-xs font-bold text-brand-text">
                                {reply.userName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatTimeAgo(reply.createdAt)}
                              </span>
                            </div>
                            {isReplyAuthor && (
                              <button
                                onClick={() => handleDelete(reply.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded"
                                title="Delete reply"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-700 pl-8 leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
