"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "subtle" | "bordered" | "glow";
}

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, blur = "xl", variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-white/70 dark:bg-white/10",
          blurMap[blur],
          "border border-slate-200 dark:border-white/20",
          "shadow-lg shadow-black/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          variant === "subtle" && "bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/10",
          variant === "bordered" && "border-2 border-slate-300 dark:border-white/25",
          variant === "glow" && "shadow-glass-glow",
          className
        )}
        {...props}
      >
        {/* Top highlight line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-white/40 to-transparent" />

        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-white/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export { GlassCard };
