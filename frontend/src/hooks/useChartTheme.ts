/**
 * useChartTheme Hook
 * Provides theme-aware chart configuration combining dark mode and reduced motion preferences
 */

import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePrefersReducedMotion } from './useMediaQuery';
import {
  getChartTheme,
  getTooltipTheme,
  getLegendTheme,
  getAxisTheme,
  getGridTheme,
  animationConfig,
  chartColors,
} from '../lib/charts';
import type { ApexOptions } from 'apexcharts';

export interface ChartThemeOptions {
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  showHorizontalGrid?: boolean;
  showVerticalGrid?: boolean;
}

export interface ChartThemeReturn {
  /** Theme-aware ApexChart base options */
  theme: Partial<ApexOptions>;
  /** Animation configuration based on reduced motion preference */
  animations: typeof animationConfig.enabled | typeof animationConfig.disabled;
  /** Whether dark mode is active */
  isDarkMode: boolean;
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Chart colors palette */
  colors: typeof chartColors;
  /** Merge helper - combines base theme with custom options */
  mergeWithTheme: (customOptions: ApexOptions) => ApexOptions;
}

/**
 * Hook for getting theme-aware chart configurations
 *
 * @example
 * ```tsx
 * const { theme, animations, mergeWithTheme } = useChartTheme();
 *
 * const options = useMemo(() => mergeWithTheme({
 *   chart: { type: 'area', height: 300 },
 *   colors: [chartColors.primary[500]],
 * }), [mergeWithTheme]);
 * ```
 */
export function useChartTheme(options: ChartThemeOptions = {}): ChartThemeReturn {
  const { theme: themeMode } = useTheme();
  const isDarkMode = themeMode === 'dark';
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    showLegend = false,
    legendPosition = 'top',
    showHorizontalGrid = true,
    showVerticalGrid = false,
  } = options;

  const theme = useMemo<Partial<ApexOptions>>(() => {
    const baseTheme = getChartTheme(isDarkMode);
    const tooltipTheme = getTooltipTheme(isDarkMode);
    const legendTheme = getLegendTheme(isDarkMode, legendPosition);
    const axisTheme = getAxisTheme(isDarkMode);
    const gridTheme = getGridTheme(isDarkMode, showHorizontalGrid, showVerticalGrid);

    return {
      ...baseTheme,
      tooltip: tooltipTheme,
      legend: {
        ...legendTheme,
        show: showLegend,
      },
      ...axisTheme,
      grid: gridTheme,
    };
  }, [isDarkMode, showLegend, legendPosition, showHorizontalGrid, showVerticalGrid]);

  const animations = useMemo(
    () => (prefersReducedMotion ? animationConfig.disabled : animationConfig.enabled),
    [prefersReducedMotion]
  );

  const mergeWithTheme = useMemo(
    () => (customOptions: ApexOptions): ApexOptions => {
      return {
        ...theme,
        ...customOptions,
        chart: {
          ...theme.chart,
          ...customOptions.chart,
          animations: {
            ...animations,
            ...customOptions.chart?.animations,
          },
        },
        tooltip: {
          ...theme.tooltip,
          ...customOptions.tooltip,
        },
        legend: {
          ...theme.legend,
          ...customOptions.legend,
        },
        xaxis: {
          ...theme.xaxis,
          ...customOptions.xaxis,
        },
        yaxis: customOptions.yaxis || theme.yaxis,
        grid: {
          ...theme.grid,
          ...customOptions.grid,
        },
      };
    },
    [theme, animations]
  );

  return {
    theme,
    animations,
    isDarkMode,
    prefersReducedMotion,
    colors: chartColors,
    mergeWithTheme,
  };
}

export default useChartTheme;
