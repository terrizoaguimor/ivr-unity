/**
 * ChartWrapper Component
 * Animated wrapper for charts with entry animations and reduced motion support
 */

import React from 'react';
import { m, HTMLMotionProps, Variants } from 'motion/react';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import { cn } from '../../../utils';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface ChartWrapperProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  /** Stagger index for multiple charts (0-based) */
  staggerIndex?: number;
  /** Animation variant: 'fade-up' | 'scale' | 'slide' */
  animation?: 'fade-up' | 'scale' | 'slide';
  /** Disable animation completely */
  disableAnimation?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────────────────────

const animationVariants: Record<string, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  slide: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
};

// Custom easing function matching --ease-glass
const glassEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function ChartWrapper({
  children,
  className,
  staggerIndex = 0,
  animation = 'fade-up',
  disableAnimation = false,
  ...motionProps
}: ChartWrapperProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Use static div if animations are disabled or user prefers reduced motion
  if (disableAnimation || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = animationVariants[animation];

  return (
    <m.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.5,
        delay: staggerIndex * 0.1,
        ease: glassEasing,
      }}
      {...motionProps}
    >
      {children}
    </m.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chart Skeleton (Loading State)
// ─────────────────────────────────────────────────────────────

export interface ChartSkeletonProps {
  height?: number | string;
  className?: string;
}

export function ChartSkeleton({ height = 300, className }: ChartSkeletonProps) {
  return (
    <div
      className={cn('chart-skeleton', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      role="status"
      aria-label="Loading chart..."
    >
      <span className="sr-only">Loading chart...</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chart Error Boundary Fallback
// ─────────────────────────────────────────────────────────────

export interface ChartErrorProps {
  height?: number | string;
  message?: string;
  onRetry?: () => void;
}

export function ChartError({
  height = 300,
  message = 'Failed to load chart',
  onRetry,
}: ChartErrorProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800/50"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <svg
        className="w-12 h-12 text-gray-400 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chart Empty State
// ─────────────────────────────────────────────────────────────

export interface ChartEmptyProps {
  height?: number | string;
  message?: string;
  icon?: React.ReactNode;
}

export function ChartEmpty({
  height = 300,
  message = 'No data available',
  icon,
}: ChartEmptyProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800/50"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {icon || (
        <svg
          className="w-12 h-12 text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

export default ChartWrapper;
