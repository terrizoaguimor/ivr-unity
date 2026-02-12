/**
 * ActivityHeatmap Component
 * GitHub-style contribution/activity heatmap
 */

import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { chartColors, createHeatmapOptions } from '../../../lib/charts';
import { ChartWrapper } from '../shared/ChartWrapper';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type HeatmapGranularity = 'hour' | 'day' | 'week';

export interface HeatmapDataPoint {
  x: string; // Category (e.g., day name, hour)
  y: number; // Value
}

export interface HeatmapSeries {
  name: string; // Row name (e.g., week number, month)
  data: HeatmapDataPoint[];
}

export interface ActivityHeatmapProps {
  /** Heatmap series data */
  data: HeatmapSeries[];
  /** Height of the chart */
  height?: number;
  /** Color intensity ranges */
  colorRange?: { from: number; to: number; color: string; name?: string }[];
  /** Show legend */
  showLegend?: boolean;
  /** Additional class names */
  className?: string;
  /** Stagger index for animation */
  staggerIndex?: number;
  /** Enable shading between color ranges */
  enableShades?: boolean;
  /** Title for the chart */
  title?: string;
}

// ─────────────────────────────────────────────────────────────
// Default Color Ranges
// ─────────────────────────────────────────────────────────────

const defaultColorRange = [
  { from: 0, to: 0, color: chartColors.gray[100], name: 'None' },
  { from: 1, to: 25, color: chartColors.primary[100], name: 'Low' },
  { from: 26, to: 50, color: chartColors.primary[200], name: 'Medium' },
  { from: 51, to: 75, color: chartColors.primary[400], name: 'High' },
  { from: 76, to: 100, color: chartColors.primary[500], name: 'Very High' },
];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function ActivityHeatmap({
  data,
  height = 300,
  colorRange = defaultColorRange,
  showLegend = true,
  className,
  staggerIndex = 0,
  enableShades = true,
  title,
}: ActivityHeatmapProps) {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  // Adjust color range for dark mode
  const adjustedColorRange = useMemo(() => {
    if (!isDarkMode) return colorRange;

    return colorRange.map((range) => {
      // Make the "None" color darker in dark mode
      if (range.from === 0 && range.to === 0) {
        return { ...range, color: 'rgba(255, 255, 255, 0.05)' };
      }
      return range;
    });
  }, [colorRange, isDarkMode]);

  const options = useMemo<ApexOptions>(() => {
    const baseOptions = createHeatmapOptions({
      colorRange: adjustedColorRange,
      enableShades,
      height,
      showLegend,
    });

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        fontFamily: 'Poppins, sans-serif',
        background: 'transparent',
        animations: {
          enabled: !prefersReducedMotion,
          easing: 'easeinout',
          speed: 500,
          animateGradually: {
            enabled: true,
            delay: 50,
          },
        },
      },
      title: title
        ? {
            text: title,
            align: 'left',
            style: {
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : chartColors.gray[800],
            },
          }
        : undefined,
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 4,
          useFillColorAsStroke: false,
          colorScale: {
            ranges: adjustedColorRange,
          },
          distributed: false,
          enableShades,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        colors: [isDarkMode ? 'rgba(26, 34, 49, 1)' : '#fff'],
      },
      legend: {
        show: showLegend,
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : chartColors.gray[700],
        },
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        markers: {
          size: 8,
        },
      },
      xaxis: {
        labels: {
          style: {
            colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
            fontSize: '11px',
            fontFamily: 'Poppins, sans-serif',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
            fontSize: '11px',
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
      tooltip: {
        enabled: true,
        theme: isDarkMode ? 'dark' : 'light',
        cssClass: 'glass-tooltip',
        y: {
          formatter: (val: number) => `${val} activities`,
        },
      },
      grid: {
        show: false,
      },
    };
  }, [
    adjustedColorRange,
    enableShades,
    height,
    showLegend,
    isDarkMode,
    prefersReducedMotion,
    title,
  ]);

  return (
    <ChartWrapper staggerIndex={staggerIndex} animation="fade-up" className={className}>
      <Chart options={options} series={data} type="heatmap" height={height} />
    </ChartWrapper>
  );
}

// ─────────────────────────────────────────────────────────────
// Weekly Activity Heatmap Helper
// ─────────────────────────────────────────────────────────────

export interface WeeklyActivityData {
  [dayOfWeek: string]: number[];
}

export function generateWeeklyHeatmapData(
  weeklyData: WeeklyActivityData,
  weekCount = 12
): HeatmapSeries[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return days.map((day) => ({
    name: day,
    data: Array.from({ length: weekCount }, (_, weekIndex) => ({
      x: `W${weekIndex + 1}`,
      y: weeklyData[day]?.[weekIndex] || 0,
    })),
  }));
}

// ─────────────────────────────────────────────────────────────
// Hourly Activity Heatmap Helper
// ─────────────────────────────────────────────────────────────

export function generateHourlyHeatmapData(
  hourlyData: Record<string, number[]>
): HeatmapSeries[] {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const days = Object.keys(hourlyData);

  return days.map((day) => ({
    name: day,
    data: hours.map((hour, index) => ({
      x: hour,
      y: hourlyData[day]?.[index] || 0,
    })),
  }));
}

export default ActivityHeatmap;
