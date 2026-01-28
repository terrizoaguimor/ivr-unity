"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, type, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("relative", className)}>
        {label && (
          <label
            className={cn(
              "block text-sm font-medium mb-2 transition-colors duration-200",
              error
                ? "text-red-500 dark:text-red-400"
                : focused
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-white/70"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(!!e.target.value);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            className={cn(
              "w-full px-4 py-3 rounded-xl",
              "bg-white dark:bg-white/5 backdrop-blur-sm",
              "border border-slate-200 dark:border-white/20",
              "text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40",
              "outline-none transition-all duration-300",
              "focus:bg-slate-50 dark:focus:bg-white/10 focus:border-slate-300 dark:focus:border-white/40",
              "focus:ring-2 focus:ring-indigo-500/30",
              icon && "pl-12",
              isPassword && "pr-12",
              error && "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30"
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
