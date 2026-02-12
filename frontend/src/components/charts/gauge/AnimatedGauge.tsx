/**
 * AnimatedGauge Component
 * Radial progress gauge with animation and glow effects
 */

import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { chartColors, createRadialChartOptions } from '../../../lib/charts';
import { ChartWrapper } from '../shared/ChartWrapper';
import { cn } from '../../../utils';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface GaugeThresholds {
  /** Value below which shows danger state */
  danger?: number;
  /** Value below which shows warning state */
  warning?: number;
}

export interface AnimatedGaugeProps {
  /** Current value (0-100 for percentage, or custom max) */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Label shown below the value */
  label?: string;
  /** Height of the gauge */
  height?: number;
  /** Color thresholds for danger/warning states */
  thresholds?: GaugeThresholds;
  /** Custom color (overrides thresholds) */
  color?: string;
  /** Show the value inside the gauge */
  showValue?: boolean;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Start angle in degrees */
  startAngle?: number;
  /** End angle in degrees */
  endAngle?: number;
  /** Size of the hollow center (percentage) */
  hollowSize?: number;
  /** Additional class names */
  className?: string;
  /** Stagger index for animation delay */
  staggerIndex?: number;
}

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

function getGaugeColor(
  percentage: number,
  thresholds?: GaugeThresholds,
  customColor?: string
): string {
  if (customColor) return customColor;

  if (thresholds) {
    if (thresholds.danger !== undefined && percentage <= thresholds.danger) {
      return chartColors.error[500];
    }
    if (thresholds.warning !== undefined && percentage <= thresholds.warning) {
      return chartColors.warning[500];
    }
  }

  return chartColors.primary[500];
}

function getGradientColors(baseColor: string): string {
  // Return a lighter version for gradient
  if (baseColor === chartColors.primary[500]) return chartColors.primary[300];
  if (baseColor === chartColors.error[500]) return chartColors.error[300];
  if (baseColor === chartColors.warning[500]) return chartColors.warning[300];
  if (baseColor === chartColors.success[500]) return chartColors.success[300];
  return baseColor;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function AnimatedGauge({
  value,
  max = 100,
  label,
  height = 200,
  thresholds,
  color,
  showValue = true,
  valueFormatter,
  startAngle = -135,
  endAngle = 135,
  hollowSize = 65,
  className,
  staggerIndex = 0,
}: AnimatedGaugeProps) {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Determine color based on thresholds
  const gaugeColor = getGaugeColor(percentage, thresholds, color);
  const gradientColor = getGradientColors(gaugeColor);

  const options = useMemo<ApexOptions>(() => {
    const baseOptions = createRadialChartOptions({
      colors: [gaugeColor],
      startAngle,
      endAngle,
      hollow: hollowSize,
      showValue,
      height,
    });

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        animations: {
          enabled: !prefersReducedMotion,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
        },
      },
      colors: [gaugeColor],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [gradientColor],
          stops: [0, 100],
        },
      },
      plotOptions: {
        radialBar: {
          startAngle,
          endAngle,
          hollow: {
            size: `${hollowSize}%`,
            background: 'transparent',
            dropShadow: {
              enabled: true,
              top: 0,
              left: 0,
              blur: 4,
              opacity: isDarkMode ? 0.3 : 0.15,
            },
          },
          track: {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.gray[100],
            strokeWidth: '100%',
            margin: 0,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              blur: 4,
              opacity: 0.1,
            },
          },
          dataLabels: {
            show: showValue,
            name: {
              show: !!label,
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
              offsetY: label ? 20 : 0,
            },
            value: {
              show: true,
              fontSize: '28px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : chartColors.gray[800],
              offsetY: label ? -10 : 5,
              formatter: valueFormatter
                ? () => valueFormatter(value)
                : (val) => `${Math.round(Number(val))}%`,
            },
          },
        },
      },
      labels: label ? [label] : [],
      stroke: {
        lineCap: 'round',
      },
    };
  }, [
    gaugeColor,
    gradientColor,
    startAngle,
    endAngle,
    hollowSize,
    showValue,
    label,
    height,
    isDarkMode,
    prefersReducedMotion,
    value,
    valueFormatter,
  ]);

  const series = useMemo(() => [percentage], [percentage]);

  return (
    <ChartWrapper staggerIndex={staggerIndex} animation="scale" className={className}>
      <div className="relative">
        <Chart options={options} series={series} type="radialBar" height={height} />
        {/* Glow effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${gaugeColor}15 0%, transparent 70%)`,
            opacity: percentage > 50 ? 0.5 : 0.3,
          }}
        />
      </div>
    </ChartWrapper>
  );
}

// ─────────────────────────────────────────────────────────────
// Gauge Cluster Component
// ─────────────────────────────────────────────────────────────

export interface GaugeClusterItem {
  value: number;
  max?: number;
  label: string;
  color?: string;
}

export interface GaugeClusterProps {
  items: GaugeClusterItem[];
  gaugeHeight?: number;
  className?: string;
}

export function GaugeCluster({ items, gaugeHeight = 150, className }: GaugeClusterProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        items.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {items.map((item, index) => (
        <AnimatedGauge
          key={item.label}
          value={item.value}
          max={item.max}
          label={item.label}
          color={item.color}
          height={gaugeHeight}
          hollowSize={60}
          staggerIndex={index}
        />
      ))}
    </div>
  );
}

export default AnimatedGauge;
