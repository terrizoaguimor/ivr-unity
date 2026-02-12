/**
 * LazyChart Component
 * Lazy loading wrapper for heavy chart types with suspense support
 */

import { lazy, Suspense } from 'react';
import { ChartSkeleton } from './shared/ChartWrapper';

// ─────────────────────────────────────────────────────────────
// Lazy Loaded Components
// ─────────────────────────────────────────────────────────────

const Sparkline = lazy(() =>
  import('./sparkline/Sparkline').then((mod) => ({ default: mod.Sparkline }))
);

const SparklineMetric = lazy(() =>
  import('./sparkline/Sparkline').then((mod) => ({ default: mod.SparklineMetric }))
);

const AnimatedGauge = lazy(() =>
  import('./gauge/AnimatedGauge').then((mod) => ({ default: mod.AnimatedGauge }))
);

const GaugeCluster = lazy(() =>
  import('./gauge/AnimatedGauge').then((mod) => ({ default: mod.GaugeCluster }))
);

const ActivityHeatmap = lazy(() =>
  import('./heatmap/ActivityHeatmap').then((mod) => ({ default: mod.ActivityHeatmap }))
);

const BarLineCombo = lazy(() =>
  import('./mixed/BarLineCombo').then((mod) => ({ default: mod.BarLineCombo }))
);

// ─────────────────────────────────────────────────────────────
// Chart Type Registry
// ─────────────────────────────────────────────────────────────

export const lazyChartComponents = {
  sparkline: Sparkline,
  sparklineMetric: SparklineMetric,
  gauge: AnimatedGauge,
  gaugeCluster: GaugeCluster,
  heatmap: ActivityHeatmap,
  barLineCombo: BarLineCombo,
} as const;

export type LazyChartType = keyof typeof lazyChartComponents;

// ─────────────────────────────────────────────────────────────
// Convenience Wrappers (Simple, type-safe lazy components)
// ─────────────────────────────────────────────────────────────

import type { SparklineProps, SparklineMetricProps } from './sparkline/Sparkline';
import type { AnimatedGaugeProps, GaugeClusterProps } from './gauge/AnimatedGauge';
import type { ActivityHeatmapProps } from './heatmap/ActivityHeatmap';
import type { BarLineComboProps } from './mixed/BarLineCombo';

export function LazySparkline(props: SparklineProps & { fallbackHeight?: number }) {
  const { fallbackHeight = 50, ...chartProps } = props;
  return (
    <Suspense fallback={<ChartSkeleton height={fallbackHeight} />}>
      <Sparkline {...chartProps} />
    </Suspense>
  );
}

export function LazySparklineMetric(props: SparklineMetricProps & { fallbackHeight?: number }) {
  const { fallbackHeight = 80, ...chartProps } = props;
  return (
    <Suspense fallback={<ChartSkeleton height={fallbackHeight} />}>
      <SparklineMetric {...chartProps} />
    </Suspense>
  );
}

export function LazyGauge(props: AnimatedGaugeProps & { fallbackHeight?: number }) {
  const { fallbackHeight = 200, ...chartProps } = props;
  return (
    <Suspense fallback={<ChartSkeleton height={fallbackHeight} />}>
      <AnimatedGauge {...chartProps} />
    </Suspense>
  );
}

export function LazyGaugeCluster(props: GaugeClusterProps & { fallbackHeight?: number }) {
  const { fallbackHeight = 200, ...chartProps } = props;
  return (
    <Suspense fallback={<ChartSkeleton height={fallbackHeight} />}>
      <GaugeCluster {...chartProps} />
    </Suspense>
  );
}

export function LazyHeatmap(props: ActivityHeatmapProps & { fallbackHeight?: number }) {
  const { fallbackHeight = 300, ...chartProps } = props;
  return (
    <Suspense fallback={<ChartSkeleton height={fallbackHeight} />}>
      <ActivityHeatmap {...chartProps} />
    </Suspense>
  );
}

export function LazyBarLineCombo(props: BarLineComboProps & { fallbackHeight?: number }) {
  const { fallbackHeight = 350, ...chartProps } = props;
  return (
    <Suspense fallback={<ChartSkeleton height={fallbackHeight} />}>
      <BarLineCombo {...chartProps} />
    </Suspense>
  );
}

// ─────────────────────────────────────────────────────────────
// Re-export types
// ─────────────────────────────────────────────────────────────

export type {
  SparklineProps,
  SparklineMetricProps,
  AnimatedGaugeProps,
  GaugeClusterProps,
  ActivityHeatmapProps,
  BarLineComboProps,
};
