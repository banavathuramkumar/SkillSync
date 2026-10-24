import { format, formatDistanceToNow, parseISO } from "date-fns";

/**
 * Format an ISO string to a human friendly date: e.g. "Nov 20, 2026"
 */
export const formatDate = (dateString, formatPattern = "MMM dd, yyyy") => {
  if (!dateString) return "N/A";
  try {
    const d = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(d, formatPattern);
  } catch {
    return dateString;
  }
};

/**
 * Relative time from now: e.g. "2 hours ago"
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  try {
    const d = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return dateString;
  }
};

/**
 * Helper to get initials from a person's name
 */
export const getInitials = (name = "") => {
  if (!name) return "SS";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Truncate long strings safely
 */
export const truncateText = (text = "", maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
