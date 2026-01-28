"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header
      className={cn(
        "h-16",
        "bg-white/80 dark:bg-white/5 backdrop-blur-xl",
        "border-b border-slate-200 dark:border-white/10",
        "flex items-center justify-between px-6"
      )}
    >
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            {title}
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-white/50">{subtitle}</p>
          )}
        </div>
        {children && (
          <div className="hidden sm:flex items-center gap-2">
            {children}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            placeholder="Buscar..."
            className={cn(
              "pl-10 pr-4 py-2 w-64",
              "bg-slate-100 dark:bg-white/5 backdrop-blur-sm",
              "border border-slate-200 dark:border-white/10 rounded-xl",
              "text-sm text-slate-900 dark:text-white",
              "placeholder:text-slate-400 dark:placeholder:text-white/30",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
              "focus:border-indigo-500 dark:focus:border-indigo-500/50",
              "transition-all duration-200"
            )}
          />
        </div>

        {/* Notifications */}
        <button
          className={cn(
            "relative p-2.5 rounded-xl",
            "bg-slate-100 dark:bg-white/5",
            "border border-slate-200 dark:border-white/10",
            "hover:bg-slate-200 dark:hover:bg-white/10",
            "hover:border-slate-300 dark:hover:border-white/20",
            "transition-all duration-200"
          )}
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-white/70" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-xl",
              "bg-gradient-to-br from-indigo-500 to-purple-600",
              "flex items-center justify-center",
              "text-white font-semibold text-sm",
              "shadow-lg shadow-indigo-500/30"
            )}
          >
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Admin</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400">En línea</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
