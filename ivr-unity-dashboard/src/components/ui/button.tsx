"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", loading, className, disabled, type = "button", onClick }, ref) => {
    const variants = {
      primary: [
        "bg-gradient-to-r from-indigo-500 to-purple-500",
        "hover:from-indigo-600 hover:to-purple-600",
        "text-white shadow-lg shadow-indigo-500/25",
        "border border-indigo-400/20 dark:border-white/10",
      ],
      secondary: [
        "bg-slate-100 dark:bg-white/10 backdrop-blur-md",
        "hover:bg-slate-200 dark:hover:bg-white/20",
        "text-slate-700 dark:text-white",
        "border border-slate-200 dark:border-white/20",
      ],
      ghost: [
        "bg-transparent",
        "hover:bg-slate-100 dark:hover:bg-white/10",
        "text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white",
      ],
      danger: [
        "bg-gradient-to-r from-red-500 to-pink-500",
        "hover:from-red-600 hover:to-pink-600",
        "text-white shadow-lg shadow-red-500/25",
        "border border-red-400/20 dark:border-white/10",
      ],
      glass: [
        "bg-slate-100/80 dark:bg-white/5 backdrop-blur-xl",
        "hover:bg-slate-200/80 dark:hover:bg-white/15",
        "text-slate-700 dark:text-white",
        "border border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/30",
      ],
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-medium rounded-xl",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
