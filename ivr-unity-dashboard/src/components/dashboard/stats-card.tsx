"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
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
  const cardRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.from(cardRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power3.out",
    });
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/5 backdrop-blur-xl",
        "border border-white/10",
        "p-6 transition-all duration-300",
        "hover:bg-white/10 hover:border-white/20",
        "hover:shadow-lg hover:shadow-black/20",
        "group"
      )}
    >
      {/* Background glow effect */}
      <div
        className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20",
          "bg-gradient-to-br",
          gradients[color],
          "group-hover:opacity-30 transition-opacity duration-500"
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/60">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="mt-3 flex items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  trend.value >= 0
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/20 text-rose-400"
                )}
              >
                {trend.value >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {trend.value >= 0 ? "+" : ""}
                  {trend.value}%
                </span>
              </div>
              <span className="text-xs text-white/40">
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
          "bg-gradient-to-r from-transparent via-white/20 to-transparent"
        )}
      />
    </div>
  );
}
