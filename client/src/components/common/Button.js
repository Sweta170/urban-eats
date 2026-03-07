import React from "react";

const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30",
    secondary: "bg-secondary-500 hover:bg-secondary-600 text-white shadow-lg shadow-secondary-500/30",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30",
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    fullWidth = false,
    ...props
}) {
    return (
        <button
            className={`
        inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
