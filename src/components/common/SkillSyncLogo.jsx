import React from "react";

export const SkillSyncLogo = ({
  size = "md", // "sm" | "md" | "lg"
  showText = true,
  className = "",
}) => {
  const iconSizes = {
    sm: "w-7 h-5",
    md: "w-9 h-6",
    lg: "w-12 h-8",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* High-fidelity Vector Infinity Logo Icon */}
      <svg
        className={`${iconSizes[size]} flex-shrink-0`}
        viewBox="0 0 120 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ss-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#087CF5" />
            <stop offset="100%" stopColor="#0256B8" />
          </linearGradient>
          <linearGradient id="ss-mint-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78D6C0" />
            <stop offset="100%" stopColor="#34B898" />
          </linearGradient>
          <linearGradient id="ss-bridge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#087CF5" />
            <stop offset="50%" stopColor="#3DB4DA" />
            <stop offset="100%" stopColor="#78D6C0" />
          </linearGradient>
        </defs>

        {/* Outer Intertwined Ribbon Loops */}
        {/* Left Loop - SkillSync Vivid Blue */}
        <path
          d="M36 12C20 12 10 22 10 36C10 50 20 60 36 60C50 60 58 48 68 36C58 24 50 12 36 12Z"
          stroke="url(#ss-blue-grad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Loop - SkillSync Mint Green */}
        <path
          d="M84 12C98 12 110 22 110 36C110 50 98 60 84 60C70 60 62 48 52 36C62 24 70 12 84 12Z"
          stroke="url(#ss-mint-grad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Synchronized Central Ribbon Overlap */}
        <path
          d="M44 26C52 34 60 42 68 46"
          stroke="url(#ss-blue-grad)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M52 26C60 34 68 42 76 46"
          stroke="url(#ss-mint-grad)"
          strokeWidth="11"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <span
          className={`font-black tracking-tight ${textSizes[size]} text-slate-900 leading-none flex items-center`}
        >
          <span>Skill</span>
          <span className="text-brand-blue">Sync</span>
        </span>
      )}
    </div>
  );
};

export default SkillSyncLogo;
