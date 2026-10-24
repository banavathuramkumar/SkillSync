import React from "react";

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-colors";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    blue: "bg-blue-50 text-brand-blue border border-blue-200",
    mint: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    rose: "bg-rose-50 text-rose-700 border border-rose-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    warning: "bg-amber-100 text-amber-800 border border-amber-300",
    danger: "bg-rose-100 text-rose-800 border border-rose-300",
    outline: "bg-transparent text-slate-600 border border-slate-300",
  };

  const clickableStyles = onClick ? "cursor-pointer hover:opacity-80" : "";

  return (
    <span
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${clickableStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
