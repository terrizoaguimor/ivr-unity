"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "cyan";
  index?: number;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  index = 0
}: StatsCardProps) {
  const gradients = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-emerald-500 to-teal-600",
    yellow: "from-amber-400 to-orange-500",
    red: "from-rose-500 to-pink-600",
    purple: "from-purple-500 to-violet-600",
    cyan: "from-cyan-400 to-blue-500",
  };

  const glowColors = {
    blue: "shadow-blue-500/20",
    green: "shadow-emerald-500/20",
    yellow: "shadow-amber-500/20",
    red: "shadow-rose-500/20",
    purple: "shadow-purple-500/20",
    cyan: "shadow-cyan-500/20",
  };

  const bgGlowColors = {
    blue: "bg-blue-500/20 dark:bg-blue-500/30",
    green: "bg-emerald-500/20 dark:bg-emerald-500/30",
    yellow: "bg-amber-500/20 dark:bg-amber-500/30",
    red: "bg-rose-500/20 dark:bg-rose-500/30",
    purple: "bg-purple-500/20 dark:bg-purple-500/30",
    cyan: "bg-cyan-500/20 dark:bg-cyan-500/30",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white dark:bg-white/5 backdrop-blur-xl",
        "border border-slate-200 dark:border-white/10",
        "p-6 transition-all duration-300",
        "hover:bg-slate-50 dark:hover:bg-white/10",
        "hover:border-slate-300 dark:hover:border-white/20",
        "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
        "group animate-fadeIn"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background glow effect */}
      <div
        className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 dark:opacity-20",
          bgGlowColors[color],
          "group-hover:opacity-50 dark:group-hover:opacity-30 transition-opacity duration-500"
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-white/60">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="mt-3 flex items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  (trend.positive ?? trend.value >= 0)
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"
                )}
              >
                {(trend.positive ?? trend.value >= 0) ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {(trend.positive ?? trend.value >= 0) ? "+" : "-"}
                  {trend.value}%
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-white/40">
                {trend.label}
              </span>
            </div>
          )}
        </div>

        {/* Icon container with gradient */}
        <div
          className={cn(
            "p-3 rounded-xl",
            "bg-gradient-to-br",
            gradients[color],
            "shadow-lg",
            glowColors[color]
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Bottom highlight line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px",
          "bg-gradient-to-r from-transparent via-slate-200 dark:via-white/20 to-transparent"
        )}
      />
    </div>
  );
}
