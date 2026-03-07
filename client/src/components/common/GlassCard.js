import React from "react";

export default function GlassCard({ children, className = "", ...props }) {
    return (
        <div
            className={`
        bg-white/70 dark:bg-dark-card/70 backdrop-blur-lg 
        border border-white/20 dark:border-gray-700/30
        rounded-2xl shadow-xl
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}
