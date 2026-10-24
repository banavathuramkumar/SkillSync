import React, { useState } from "react";
import { User } from "lucide-react";

export const UserAvatar = ({
  user,
  size = "md",
  className = "",
  showBadge = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
    "2xl": "w-24 h-24 text-2xl",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-10 h-10",
    "2xl": "w-12 h-12",
  };

  const name = user?.name || "Student";
  const avatarUrl = user?.avatar;

  // Compute 1-2 letter initials
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  // Check if avatar is present and hasn't errored
  const hasValidAvatar = avatarUrl && avatarUrl.trim() !== "" && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl select-none flex-shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {hasValidAvatar ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-2xl object-cover object-top shadow-sm"
        />
      ) : (
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-brand-blue to-brand-mint text-white font-extrabold flex items-center justify-center shadow-sm border border-brand-blue/20">
          {initials.length > 0 ? (
            <span>{initials}</span>
          ) : (
            <User className={`${iconSizes[size] || iconSizes.md} text-white`} />
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
