import { ReactNode } from "react";
import { m, HTMLMotionProps } from "motion/react";
import { usePrefersReducedMotion } from "../../../hooks/useMediaQuery";
import { cn } from "../../../utils";

// Glass card effect variants
type GlassEffect =
  | "default"      // Standard lift + shadow
  | "interactive"  // Enhanced for clickable cards
  | "glow"         // Gradient border glow on hover
  | "shimmer"      // Shine sweep effect
  | "frost"        // Top edge light refraction
  | "premium";     // Animated rotating border

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  effect?: GlassEffect;
  className?: string;
  disableHover?: boolean;
}

// Animation variants for Framer Motion
const hoverVariants = {
  default: {
    rest: { y: 0, scale: 1 },
    hover: { y: -4, scale: 1 },
    tap: { y: -2, scale: 0.99 }
  },
  interactive: {
    rest: { y: 0, scale: 1 },
    hover: { y: -6, scale: 1.01 },
    tap: { y: -2, scale: 0.98 }
  },
  glow: {
    rest: { y: 0, scale: 1 },
    hover: { y: -4, scale: 1.005 },
    tap: { y: -2, scale: 0.99 }
  },
  shimmer: {
    rest: { y: 0, scale: 1 },
    hover: { y: -2, scale: 1 },
    tap: { y: 0, scale: 0.99 }
  },
  frost: {
    rest: { y: 0, scale: 1 },
    hover: { y: -4, scale: 1 },
    tap: { y: -2, scale: 0.99 }
  },
  premium: {
    rest: { y: 0, scale: 1 },
    hover: { y: -6, scale: 1.01 },
    tap: { y: -2, scale: 0.98 }
  }
};

// Spring transition config
const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25
};

// Reduced motion transition
const reducedMotionTransition = {
  duration: 0
};

// Map effects to CSS classes
const effectClasses: Record<GlassEffect, string> = {
  default: "",
  interactive: "glass-card-interactive cursor-pointer",
  glow: "glass-card-glow",
  shimmer: "glass-shimmer",
  frost: "glass-frost-ring",
  premium: "glass-animated-border glass-frost-ring"
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  effect = "default",
  className,
  disableHover = false,
  ...motionProps
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const transition = prefersReducedMotion
    ? reducedMotionTransition
    : springTransition;

  const variants = hoverVariants[effect];
  const effectClass = effectClasses[effect];

  // If hover is disabled or reduced motion, use static div
  if (disableHover || prefersReducedMotion) {
    return (
      <div
        className={cn(
          "rounded-2xl glass-card p-5 md:p-6",
          effectClass,
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <m.div
      className={cn(
        "rounded-2xl glass-card p-5 md:p-6",
        effectClass,
        className
      )}
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={transition}
      {...motionProps}
    >
      {children}
    </m.div>
  );
};

// Metric Card variant - optimized for KPIs
interface GlassMetricCardProps extends Omit<GlassCardProps, "effect"> {
  highlighted?: boolean;
}

const GlassMetricCard: React.FC<GlassMetricCardProps> = ({
  children,
  highlighted = false,
  className,
  ...props
}) => {
  return (
    <GlassCard
      effect={highlighted ? "glow" : "default"}
      className={cn(
        "glass-frost-ring",
        className
      )}
      {...props}
    >
      {children}
    </GlassCard>
  );
};

// Chart Card variant - for chart containers
const GlassChartCard: React.FC<GlassCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <GlassCard
      effect="frost"
      className={className}
      {...props}
    >
      {children}
    </GlassCard>
  );
};

// Interactive Card variant - for clickable cards
const GlassInteractiveCard: React.FC<GlassCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <GlassCard
      effect="interactive"
      className={className}
      {...props}
    >
      {children}
    </GlassCard>
  );
};

// Premium Card variant - for featured/highlighted content
const GlassPremiumCard: React.FC<GlassCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <GlassCard
      effect="premium"
      className={className}
      {...props}
    >
      {children}
    </GlassCard>
  );
};

// Responsive Card variant - with container query support for component-level responsiveness
interface GlassResponsiveCardProps extends GlassCardProps {
  containerName?: string;
}

const GlassResponsiveCard: React.FC<GlassResponsiveCardProps> = ({
  children,
  className,
  containerName,
  ...props
}) => {
  return (
    <div
      className="container-query"
      style={containerName ? { containerName } : undefined}
    >
      <GlassCard
        effect="frost"
        className={cn("glass-card-responsive flex-safe", className)}
        {...props}
      >
        {children}
      </GlassCard>
    </div>
  );
};

// Widget Card variant - for dashboard widgets with container query layout
const GlassWidgetCard: React.FC<GlassCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className="container-query-named">
      <GlassCard
        effect="frost"
        className={cn("widget-layout", className)}
        {...props}
      >
        {children}
      </GlassCard>
    </div>
  );
};

export {
  GlassCard,
  GlassMetricCard,
  GlassChartCard,
  GlassInteractiveCard,
  GlassPremiumCard,
  GlassResponsiveCard,
  GlassWidgetCard,
  type GlassCardProps,
  type GlassResponsiveCardProps,
  type GlassEffect
};
