import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
    label,
    error,
    className = "",
    type = "text",
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={inputType}
                    className={`
                        w-full px-4 py-2 rounded-lg border bg-white dark:bg-dark-card text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all
                        ${error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        }
                        ${type === 'password' ? 'pr-10' : ''}
                    `}
                    {...props}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
