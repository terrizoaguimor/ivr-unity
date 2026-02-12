/**
 * Sparkline Component
 * Compact inline chart for KPI cards and metrics
 */

import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { createSparklineOptions, chartColors } from '../../../lib/charts';
import { cn } from '../../../utils';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type SparklineVariant = 'line' | 'area' | 'bar';
export type SparklineColor = 'primary' | 'accent' | 'success' | 'error' | 'warning';

export interface SparklineProps {
  /** Data points to display */
  data: number[];
  /** Chart variant */
  variant?: SparklineVariant;
  /** Color preset or custom hex color */
  color?: SparklineColor | string;
  /** Chart height in pixels */
  height?: number;
  /** Stroke width for line/area variants */
  strokeWidth?: number;
  /** Additional class names */
  className?: string;
  /** Show tooltip on hover */
  showTooltip?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Color Mapping
// ─────────────────────────────────────────────────────────────

const colorMap: Record<SparklineColor, string> = {
  primary: chartColors.primary[500],
  accent: chartColors.accent[500],
  success: chartColors.success[500],
  error: chartColors.error[500],
  warning: chartColors.warning[500],
};

function getColor(color: SparklineColor | string): string {
  if (color in colorMap) {
    return colorMap[color as SparklineColor];
  }
  return color;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function Sparkline({
  data,
  variant = 'area',
  color = 'primary',
  height = 50,
  strokeWidth = 2,
  className,
  showTooltip = false,
}: SparklineProps) {
  const { prefersReducedMotion } = useChartTheme();

  const resolvedColor = getColor(color);

  const options = useMemo<ApexOptions>(() => {
    const baseOptions = createSparklineOptions({
      color: resolvedColor,
      type: variant,
      height,
      strokeWidth,
    });

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        animations: {
          enabled: !prefersReducedMotion,
          easing: 'easeinout',
          speed: 300,
        },
      },
      tooltip: {
        enabled: showTooltip,
        theme: 'dark',
        cssClass: 'glass-tooltip',
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          formatter: (val: number) => val.toLocaleString(),
        },
        marker: {
          show: false,
        },
      },
    };
  }, [variant, resolvedColor, height, strokeWidth, prefersReducedMotion, showTooltip]);

  const series = useMemo(
    () => [
      {
        name: 'Value',
        data,
      },
    ],
    [data]
  );

  return (
    <div className={cn('sparkline-container', className)}>
      <Chart options={options} series={series} type={variant} height={height} width="100%" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sparkline Metric Component
// ─────────────────────────────────────────────────────────────

export interface SparklineMetricProps {
  /** Main value to display */
  value: string | number;
  /** Label for the metric */
  label: string;
  /** Sparkline data */
  data: number[];
  /** Percentage change */
  change?: number;
  /** Change direction override (auto-detected from change if not provided) */
  changeDirection?: 'up' | 'down' | 'neutral';
  /** Sparkline color */
  color?: SparklineColor | string;
  /** Additional class names */
  className?: string;
}

export function SparklineMetric({
  value,
  label,
  data,
  change,
  changeDirection,
  color = 'primary',
  className,
}: SparklineMetricProps) {
  const direction =
    changeDirection || (change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : 'neutral');

  const changeColor =
    direction === 'up'
      ? 'text-success-500'
      : direction === 'down'
      ? 'text-error-500'
      : 'text-gray-500';

  const sparklineColor =
    direction === 'up' ? 'success' : direction === 'down' ? 'error' : color;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</span>
          {change !== undefined && (
            <span className={cn('text-sm font-medium', changeColor)}>
              {direction === 'up' ? '+' : ''}
              {change}%
            </span>
          )}
        </div>
      </div>
      <div className="w-24 flex-shrink-0">
        <Sparkline data={data} color={sparklineColor} height={40} variant="area" />
      </div>
    </div>
  );
}

export default Sparkline;
