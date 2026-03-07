import React from "react";

export default function Input({
    label,
    error,
    className = "",
    ...props
}) {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-2 rounded-lg border bg-white dark:bg-dark-card text-gray-900 dark:text-white
          focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all
          ${error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 dark:border-gray-700"
                    }
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
